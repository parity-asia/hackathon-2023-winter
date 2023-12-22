import { useState } from "react";
import { useDispatch } from "react-redux";

import { fillChannels } from "../slices/channels";
import { fillFootprint } from "../slices/footprint";
import { fillMessage } from "../slices/message";
import { fillChannelMsg } from "../slices/message.channel";
import { fillFileMessage } from "../slices/message.file";
import { fillReactionMessage } from "../slices/message.reaction";
import { fillUserMsg } from "../slices/message.user";
import { fillServer } from "../slices/server";
import { fillUI } from "../slices/ui";
import { fillUsers } from "../slices/users";

const useRehydrate = () => {
  const [iterated, setIterated] = useState(false);
  const dispatch = useDispatch();
  const rehydrate = async () => {
    const rehydrateData = {
      channels: [],
      users: [],
      fileMessage: {},
      channelMessage: {},
      userMessage: {},
      reactionMessage: {},
      message: { replying: {} },
      footprint: {},
      ui: {},
      server: {}
    };
    if (!window.CACHE) {
      setIterated(true);
      return;
    }
    const tables = Object.keys(window.CACHE);
    await Promise.all(
      tables.map((_key) => {
        return window.CACHE[_key]?.iterate((data: any, key) => {
          // console.log("iterated", key);
          switch (_key) {
            case "channels":
              if (data) {
                rehydrateData.channels.push(data);
              }
              break;
            case "users":
              if (data) {
                rehydrateData.users.push(data);
              }
              break;
            case "footprint":
              rehydrateData.footprint[key] = data;
              break;
            case "ui":
              rehydrateData.ui[key] = data;
              break;
            case "messageChannel":
              rehydrateData.channelMessage[key] = data;
              break;
            case "messageFile":
              rehydrateData.fileMessage[key] = data || [];
              break;
            case "messageDM":
              rehydrateData.userMessage[key] = data;
              break;
            case "messageReaction":
              rehydrateData.reactionMessage[key] = data;
              break;
            case "message":
              rehydrateData.message[key] = data;
              break;
            case "server":
              rehydrateData.server[key] = data;
              break;

            default:
              break;
          }
        });
      })
    );
    dispatch(fillUsers(rehydrateData.users));
    dispatch(fillServer(rehydrateData.server));
    dispatch(fillChannels(rehydrateData.channels));
    // file message
    dispatch(fillFileMessage(rehydrateData.fileMessage.list));
    dispatch(fillChannelMsg(rehydrateData.channelMessage));
    dispatch(fillUserMsg(rehydrateData.userMessage));
    dispatch(fillMessage(rehydrateData.message));
    dispatch(fillFootprint(rehydrateData.footprint));
    dispatch(fillUI(rehydrateData.ui));
    dispatch(fillReactionMessage(rehydrateData.reactionMessage));

    setIterated(true);
  };
  return { rehydrate, rehydrated: iterated };
};

export default useRehydrate;
