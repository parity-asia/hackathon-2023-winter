// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { useVoice } from "../../../components/Voice";
import { ChatContext } from "../../../types/common";
import VoiceManagement from "./VoiceManagement";

type Props = {
  visible: boolean;
  context?: ChatContext;
  id: number;
};

const Dashboard = ({ context = "channel", id, visible }: Props) => {
  const { voicingInfo } = useVoice({ id, context });
  return (
    <div
      className={`h-full flex-col gap-1 w-[226px] overflow-y-scroll overflow-x-hidden p-2 border border-black/10 md:border-none md:shadow-[inset_1px_0px_0px_rgba(0,_0,_0,_0.1)] ${
        visible ? "flex" : "hidden"
      }`}
    >
      <VoiceManagement id={id} context={context} info={voicingInfo} />
    </div>
  );
};

export default Dashboard;
