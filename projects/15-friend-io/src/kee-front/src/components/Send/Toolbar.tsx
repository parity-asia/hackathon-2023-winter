import { ChangeEvent, FC, useRef } from "react";
import { useTranslation } from "react-i18next";

import { ChatContext } from "@/types/common";
import useUploadFile from "@/hooks/useUploadFile";
import AddIcon from "@/assets/icons/add.solid.svg";
import ExitFullscreenIcon from "@/assets/icons/fullscreen.exit.svg";
import FullscreenIcon from "@/assets/icons/fullscreen.svg";
import MarkdownIcon from "@/assets/icons/markdown.svg";
import SendIcon from "@/assets/icons/send.svg";
import Tooltip from "../Tooltip";

type Props = {
  sendMessages: () => void;
  toggleMarkdownFullscreen: () => void;
  fullscreen: boolean;
  toggleMode: () => void;
  mode: "markdown" | "text";
  to: number;
  context: ChatContext;
  sendVisible: boolean;
};
const Toolbar: FC<Props> = ({
  sendMessages,
  sendVisible,
  toggleMarkdownFullscreen,
  fullscreen,
  toggleMode,
  mode,
  to,
  context
}) => {
  const { t } = useTranslation();
  const { addStageFile } = useUploadFile({ context, id: to });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files) return;
    const files = Array.from(evt.target.files);
    const filesData = files.map((file) => {
      const { size, type, name } = file;
      const url = URL.createObjectURL(file);
      return { size, type, name, url };
    });
    addStageFile(filesData);
    // todo: check code logic
    // @ts-ignore
    fileInputRef.current.value = null;
    // @ts-ignore
    fileInputRef.current.value = "";
    // setFiles([...evt.target.files]);
  };

  const isMarkdown = mode == "markdown";
  return (
    <div className={`hidden md:flex flex-col md:flex-row items-center justify-end gap-2.5`}>
      <div className="flex cursor-pointer gap-3.5">
        <Tooltip placement="top" tip="Markdown">
          <MarkdownIcon
            className={isMarkdown ? "fill-primary-400" : "dark:fill-gray-300"}
            onClick={toggleMode}
          />
        </Tooltip>
        {isMarkdown &&
          (fullscreen ? (
            <Tooltip placement="top" tip="Exit Fullscreen">
              <ExitFullscreenIcon
                onClick={toggleMarkdownFullscreen}
                className="dark:fill-gray-300"
              />
            </Tooltip>
          ) : (
            <Tooltip placement="top" tip="Fullscreen">
              <FullscreenIcon onClick={toggleMarkdownFullscreen} className="dark:fill-gray-300" />
            </Tooltip>
          ))}
      </div>
      {!isMarkdown && (
        <>
          <Tooltip placement="top" tip={t("action.upload")}>
            <div className="cursor-pointer relative w-6 h-6">
              <AddIcon className="dark:fill-gray-300" />
              <label
                htmlFor="file"
                className=" cursor-pointer absolute left-0 top-0 w-full h-full opacity-0"
              >
                <input
                  className="hidden"
                  size={24}
                  ref={fileInputRef}
                  multiple={true}
                  onChange={handleUpload}
                  type="file"
                  name="file"
                  id="file"
                />
              </label>
            </div>
          </Tooltip>
          {sendVisible && (
            <Tooltip placement="top" tip="Send">
              <SendIcon
                className={"w-6 h-6 cursor-pointer animate-zoomIn dark:fill-gray-300"}
                onClick={sendMessages.bind(null, undefined)}
              />
            </Tooltip>
          )}
        </>
      )}
    </div>
  );
};
export default Toolbar;
