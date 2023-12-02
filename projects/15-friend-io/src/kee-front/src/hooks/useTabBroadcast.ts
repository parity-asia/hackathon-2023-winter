import { useEffect, useState } from "react";
import { BroadcastChannel } from "broadcast-channel";

// import useStreaming from './useStreaming';

type ChannelData = {
  type: "NEW_TAB";
  message: string;
};
const useTabBroadcast = () => {
  const [tabActive, setTabActive] = useState(true);
  useEffect(() => {
    const channel = new BroadcastChannel("VOCECHAT_CHANNEL");
    channel.postMessage({ type: "NEW_TAB", message: "new tab opened" } as ChannelData);
    const handler = (data: ChannelData) => {
      console.log("channel data", data);
      if (data.type == "NEW_TAB") {
        setTabActive(false);
      }
    };
    channel.addEventListener("message", handler);
    return () => {
      channel.removeEventListener("message", handler);
      channel.close();
    };
  }, []);

  return {
    tabActive
  };
};

export default useTabBroadcast;
