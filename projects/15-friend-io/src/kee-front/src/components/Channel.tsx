import { FC } from "react";
import clsx from "clsx";

import { useAppSelector } from "@/app/store";
import Avatar from "./Avatar";
import { shallowEqual } from "react-redux";

interface Props {
  interactive?: boolean;
  id: number;
  compact?: boolean;
  avatarSize?: number;
}

const Channel: FC<Props> = ({ interactive = true, id, compact = false, avatarSize = 32 }) => {
  const channel = useAppSelector((store) => store.channels.byId[id], shallowEqual);
  const totalMemberCount = useAppSelector((store) => store.users.ids.length, shallowEqual);

  if (!channel) return null;
  const { name, members = [], is_public, icon } = channel;

  return (
    <div
      className={clsx(
        `flex items-center justify-start gap-2 p-2 rounded-lg select-none`,
        compact && "p-0",
        interactive && "md:hover:bg-gray-500/10"
      )}
    >
      <div
        className={`cursor-pointer relative`}
        style={{ width: `${avatarSize}px`, height: `${avatarSize}px` }}
      >
        <Avatar
          width={avatarSize}
          height={avatarSize}
          type="channel"
          src={icon}
          name={"#"}
          alt="avatar"
          className="!w-full !h-full rounded-full"
        />
      </div>
      {!compact && (
        <div className="flex text-sm text-gray-500 font-semibold">
          <span className="max-w-[140px] truncate">{name}</span> (
          {is_public ? totalMemberCount : members.length})
        </div>
      )}
    </div>
  );
};

export default Channel;
