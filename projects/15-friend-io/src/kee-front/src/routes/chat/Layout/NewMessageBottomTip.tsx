// import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import clsx from "clsx";

import { useAppSelector } from "../../../app/store";
import { ChatContext } from "../../../types/common";
import getUnreadCount from "../utils";
import { memo } from "react";
import { shallowEqual } from "react-redux";

type Props = {
  context: ChatContext;
  id: number;
  scrollToBottom?: () => void;
};
// linear-gradient(135deg,_#3C8CE7_0%,_#00EAFF_100%)
const NewMessageBottomTip = ({ context, id, scrollToBottom }: Props) => {
  const { t } = useTranslation("chat");
  const readIndex = useAppSelector(
    (store) =>
      context == "channel" ? store.footprint.readChannels[id] : store.footprint.readUsers[id],
    shallowEqual
  );
  const mids = useAppSelector(
    (store) => (context == "dm" ? store.userMessage.byId[id] : store.channelMessage[id]),
    shallowEqual
  );
  const loginUid = useAppSelector((store) => store.authData.user?.uid ?? 0, shallowEqual);
  const messageData = useAppSelector((store) => store.message ?? {}, shallowEqual);
  const { unreads = 0 } = getUnreadCount({
    mids,
    readIndex,
    messageData,
    loginUid
  });
  console.log("unreads", unreads);

  return (
    <aside
      className={clsx(
        `z-[999] absolute bottom-20 right-4
                                justify-between text-xs
                                rounded-full py-1 px-3 text-white
                                bg-gradient-to-tl from-[#3C8CE7] to-[#00EAFF]`,
        unreads > 0 ? "flex" : "hidden"
      )}
    >
      <button onClick={scrollToBottom}>{t("new_msg", { num: unreads })}</button>
    </aside>
  );
};

export default memo(NewMessageBottomTip);
