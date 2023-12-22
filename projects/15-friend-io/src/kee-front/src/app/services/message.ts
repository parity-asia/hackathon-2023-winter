import { createApi } from "@reduxjs/toolkit/query/react";
import { unescape } from "lodash";

import { ChatContext } from "@/types/common";
import { ChatMessage, ContentTypeKey, UploadFileResponse } from "@/types/message";
import { Archive, FavoriteArchive, OG } from "@/types/resource";
import handleChatMessage from "@/hooks/useStreaming/chat.handler";
import { encodeBase64, normalizeArchiveData } from "@/utils";
import { ContentTypes } from "../config";
import { addFavorite, deleteFavorite, fillFavorites, populateFavorite } from "../slices/favorites";
import { updateReadChannels, updateReadUsers, upsertOG } from "../slices/footprint";
import { upsertArchiveMessage } from "../slices/message.archive";
import { RootState } from "../store";
import baseQuery from "./base.query";
import { onMessageSendStarted } from "./handlers";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery,
  endpoints: (builder) => ({
    editMessage: builder.mutation<number, { mid: number; content: string; type: ContentTypeKey }>({
      query: ({ mid, content, type = "text" }) => ({
        headers: {
          "content-type": ContentTypes[type]
        },
        url: `/message/${mid}/edit`,
        method: "PUT",
        body: content
      })
    }),
    reactMessage: builder.mutation<number, { mid: number; action: string }>({
      query: ({ mid, action }) => ({
        url: `/message/${mid}/like`,
        method: "PUT",
        body: { action }
      })
    }),
    deleteMessage: builder.query<number, number>({
      query: (mid) => ({
        url: `/message/${mid}`,
        method: "DELETE"
      })
    }),
    deleteMessages: builder.query<number, number[]>({
      query: (mids) => ({
        url: `/message/bulk/${mids}`,
        method: "DELETE"
      })
    }),
    prepareUploadFile: builder.mutation<string, { content_type: string; filename: string }>({
      query: (meta = { content_type: "", filename: "" }) => ({
        url: `/resource/file/prepare`,
        method: "POST",
        body: meta
      })
    }),
    createArchive: builder.mutation<string, number[]>({
      query: (mids = []) => ({
        url: `/resource/archive`,
        method: "POST",
        body: { mid_list: mids }
      })
    }),
    uploadFile: builder.mutation<UploadFileResponse | {}, FormData>({
      query: (formData) => ({
        url: `/resource/file/upload`,
        method: "POST",
        body: formData
      }),
      transformResponse: (data: UploadFileResponse | null) => {
        return data ? data : {};
      }
    }),
    getOGInfo: builder.query<OG, string>({
      query: (url) => ({
        url: `/resource/open_graphic_parse?url=${encodeURIComponent(url)}`
      }),
      async onQueryStarted(url, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertOG({ key: url, value: data }));
        } catch (err) {
          console.log("get og error", err);
          dispatch(
            upsertOG({
              key: url,
              value: {
                images: [],
                audios: [],
                videos: [],
                title: "",
                url
              }
            })
          );
        }
      }
    }),

    getArchiveMessage: builder.query<Archive, string>({
      query: (filePath) => ({
        url: `/resource/archive?file_path=${encodeURIComponent(filePath)}`
      }),
      async onQueryStarted(filePath, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertArchiveMessage({ filePath, data }));
        } catch (err) {
          console.log("get archive error", err);
        }
      }
    }),
    pinMessage: builder.mutation<void, { gid: number; mid: number }>({
      query: ({ gid, mid }) => ({
        url: `/group/${gid}/pin`,
        method: "POST",
        body: { mid }
      })
    }),
    unpinMessage: builder.mutation<void, { gid: number; mid: number }>({
      query: ({ gid, mid }) => ({
        url: `/group/${gid}/unpin`,
        method: "POST",
        body: { mid }
      })
    }),
    favoriteMessage: builder.mutation<FavoriteArchive, number[]>({
      query: (mids) => ({
        url: `/favorite`,
        method: "POST",
        body: { mid_list: mids }
      }),
      async onQueryStarted(mids, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { created_at, id } = data;
          dispatch(addFavorite({ id, created_at }));
          dispatch(messageApi.endpoints.getFavoriteDetails.initiate(id));
        } catch (err) {
          console.log("get favorite list error", err);
        }
      }
    }),
    removeFavorite: builder.query<void, string>({
      query: (id) => ({
        url: `/favorite/${id}`,
        method: "DELETE"
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(deleteFavorite(id));
        } catch (err) {
          console.log("get favorite list error", err);
        }
      }
    }),
    getFavoriteDetails: builder.query<Archive, string>({
      query: (id) => ({
        url: `/favorite/${id}`
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const loginUid = (getState() as RootState).authData.user?.uid;
          const messages = normalizeArchiveData(data, id, loginUid);
          dispatch(populateFavorite({ id, messages }));
        } catch (err) {
          console.log("get favorite list error", err);
        }
      }
    }),
    getFavorites: builder.query<FavoriteArchive[], void>({
      query: () => ({
        url: `/favorite`
      }),
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        try {
          const { data: favorites } = await queryFulfilled;
          dispatch(fillFavorites(favorites));
          for (const fav of favorites) {
            const { id } = fav;
            dispatch(messageApi.endpoints.getFavoriteDetails.initiate(id));
          }
        } catch (err) {
          console.log("get favorite list error", err);
        }
      }
    }),
    loadMoreMessages: builder.query<
      ChatMessage[],
      { context?: ChatContext; id: number; mid?: number; limit?: number }
    >({
      query: ({ context = "channel", id, mid = "", limit = 100 }) => {
        const url =
          context == "channel"
            ? `/group/${id}/history?limit=${limit}${mid ? `&before=${mid}` : ""}`
            : `/user/${id}/history?limit=${limit}${mid ? `&before=${mid}` : ""}`;
        return {
          url
        };
      },
      async onQueryStarted(params, { dispatch, getState, queryFulfilled }) {
        const { data: messages } = await queryFulfilled;
        const fromHistory = true;
        if (messages?.length) {
          messages.forEach((msg) => {
            handleChatMessage(msg, dispatch, getState() as RootState, fromHistory);
          });
        }
      }
    }),
    replyMessage: builder.mutation<
      number,
      {
        from_uid: number;
        reply_mid: number;
        content: string | { path: string };
        type: ContentTypeKey;
        properties?: {};
      }
    >({
      query: ({ reply_mid, content, type = "text", properties }) => ({
        headers: {
          "content-type": ContentTypes[type],
          "X-Properties": properties ? encodeBase64(JSON.stringify(properties)) : ""
        },
        url: `/message/${reply_mid}/reply`,
        method: "POST",
        body: content
      }),
      async onQueryStarted(param1, param2) {
        await onMessageSendStarted.call(this, param1, param2, param1.context);
      }
    }),
    readMessage: builder.mutation<
      void,
      { users?: { uid: number; mid: number }[]; groups?: { gid: number; mid: number }[] }
    >({
      query: (data) => ({
        url: `/user/read-index`,
        method: "POST",
        body: data
      }),
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        const { users = null, groups = null } = data;
        if (users) {
          dispatch(updateReadUsers(users));
        }
        if (groups) {
          dispatch(updateReadChannels(groups));
        }
        try {
          await queryFulfilled;
        } catch {
          // todo
        }
      }
    }),
    preCheckFileFromUrl: builder.query<void, string>({
      query: (url) => ({
        url,
        method: "HEAD",
        responseHandler: "text"
      })
    })
  })
});

export const {
  useLazyPreCheckFileFromUrlQuery,
  useLazyRemoveFavoriteQuery,
  useUnpinMessageMutation,
  useLazyGetFavoritesQuery,
  useFavoriteMessageMutation,
  usePinMessageMutation,
  useLazyGetArchiveMessageQuery,
  useGetArchiveMessageQuery,
  useLazyGetOGInfoQuery,
  usePrepareUploadFileMutation,
  useUploadFileMutation,
  useEditMessageMutation,
  useReactMessageMutation,
  useReplyMessageMutation,
  useLazyDeleteMessageQuery,
  useLazyDeleteMessagesQuery,
  useReadMessageMutation,
  useCreateArchiveMutation,
  useLazyLoadMoreMessagesQuery
} = messageApi;
