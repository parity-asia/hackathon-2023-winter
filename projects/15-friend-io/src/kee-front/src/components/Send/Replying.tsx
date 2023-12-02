import { ContentTypes } from "@/app/config";
import { MessagePayload } from "@/app/slices/message";
import { useAppSelector } from "@/app/store";
import { ChatContext } from "@/types/common";
import useSendMessage from "@/hooks/useSendMessage";
import { getFileIcon, isImage } from "@/utils";
import IconClose from "@/assets/icons/close.circle.svg";
import pictureIcon from "@/assets/icons/picture.svg?url";
import LinkifyText from "../LinkifyText";
import MarkdownRender from "../MarkdownRender";
import { shallowEqual } from "react-redux";

const renderContent = (data: MessagePayload) => {
  const { content_type, content, thumbnail = "", properties } = data;
  let res = null;
  switch (content_type) {
    case ContentTypes.text:
      res = <LinkifyText text={content as string} url={false} mentionTextOnly={true} />;
      // res = reactStringReplace(content, /(\s{1}@[0-9]+\s{1})/g, (match, idx) => {
      //   const uid = match.trim().slice(1);
      //   return <Mention popover={false} key={idx} uid={+uid} />;
      // });
      break;

    case ContentTypes.audio:
      res = (
        <div className="text-sm">
          <span className="text-gray-400 italic">[Voice Message]</span>
        </div>
      );
      break;
    case ContentTypes.markdown:
      res = (
        <div className="max-h-[100px] overflow-auto">
          <MarkdownRender content={content as string} />
        </div>
      );
      break;
    case ContentTypes.file:
      {
        const { content_type = "", name, size } = properties || {};
        const image = isImage(content_type, size);
        // console.log("replying data", content_type, size, image);
        if (image) {
          res = <img className="w-10 h-10 object-cover" src={thumbnail || pictureIcon} />;
        } else {
          const icon = getFileIcon(content_type, name, "icon w-4 h-5");
          res = (
            <div className="flex items-center gap-1">
              {icon}
              <span className="ml-1 text-[10px] text-gray-400">{name}</span>
            </div>
          );
        }
      }
      break;
    default:
      break;
  }
  // console.log("replying data", data);
  return res;
};
export default function Replying({
  context,
  id,
  mid
}: {
  context: ChatContext;
  id: number;
  mid: number;
}) {
  const { removeReplying } = useSendMessage({ to: id, context });
  const usersData = useAppSelector((store) => store.users.byId, shallowEqual);
  const msg = useAppSelector((store) => store.message[mid], shallowEqual);
  const removeReply = () => {
    removeReplying();
  };
  if (!msg) return null;
  const { from_uid = 0 } = msg;
  const user = usersData[from_uid];

  return (
    <div className="reply bg-gray-100 dark:bg-gray-900 z-[999] flex flex-col md:flex-row items-start justify-start gap-4 rounded-t-lg w-full px-4 py-3 text-sm">
      <div className="whitespace-nowrap text-gray-400 ">
        Replying to <span className="font-bold text-gray-600 dark:text-gray-400">{user?.name}</span>
      </div>
      <div className="text-gray-500 overflow-hidden pr-7 ">{renderContent(msg)}</div>
      <button className="absolute top-4 right-4 cursor-pointer" onClick={removeReply}>
        <IconClose className="dark:fill-gray-400" />
      </button>
    </div>
  );
}
