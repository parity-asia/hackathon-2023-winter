import { FC, useState } from "react";
import toast from "react-hot-toast";
import { useKey } from "rooks";

import { updateSelectMessages } from "@/app/slices/ui";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { ChatContext } from "@/types/common";
import DeleteMessageConfirmModal from "@/components/DeleteMessageConfirm";
import ForwardModal from "@/components/ForwardModal";
import useDeleteMessage from "@/hooks/useDeleteMessage";
import useFavMessage from "@/hooks/useFavMessage";
import IconBookmark from "@/assets/icons/bookmark.svg";
import IconClose from "@/assets/icons/close.circle.svg";
import IconDelete from "@/assets/icons/delete.svg";
import IconForward from "@/assets/icons/forward.svg";
import { shallowEqual } from "react-redux";

type Props = {
  context: ChatContext;
  id: number;
};
const Operations: FC<Props> = ({ context, id }) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { canDelete } = useDeleteMessage();
  const { addFavorite } = useFavMessage({});
  const mids = useAppSelector((store) => store.ui.selectMessages[`${context}_${id}`], shallowEqual);
  const [forwardModalVisible, setForwardModalVisible] = useState(false);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(updateSelectMessages({ context, id, operation: "reset" }));
  };

  const handleFav = async () => {
    const added = await addFavorite(mids);
    if (added) {
      dispatch(updateSelectMessages({ context, id, operation: "reset" }));
      toast.success("Messages Saved!");
    } else {
      toast.error("Operation Failed!");
    }
  };

  const toggleDeleteModal = (isSuccess = false) => {
    setDeleteModalVisible((prev) => !prev);
    if (isSuccess) {
      dispatch(updateSelectMessages({ context, id, operation: "reset" }));
      toast.success("Messages Deleted!");
    }
  };

  const toggleForwardModal = () => {
    setForwardModalVisible((prev) => !prev);
  };

  useKey("Escape", () => {
    dispatch(updateSelectMessages({ context, id, operation: "reset" }));
  });
  const canDel = canDelete(mids);

  const optClass = `p-2 bg-slate-100 dark:bg-slate-800 rounded md:hover:bg-slate-300 dark:md:hover:bg-slate-900`;
  return (
    <>
      <div className="relative p-4 flex-center gap-8 shadow-md">
        <button className={optClass} onClick={toggleForwardModal}>
          <IconForward />
        </button>
        <button className={optClass} onClick={handleFav}>
          <IconBookmark />
        </button>
        <button
          className={`${optClass} disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={!canDel}
          onClick={toggleDeleteModal.bind(null, false)}
        >
          <IconDelete />
        </button>
        <IconClose
          className="cursor-pointer absolute right-5 top-1/2 -translate-y-1/2"
          onClick={handleClose}
        />
      </div>
      {forwardModalVisible && <ForwardModal mids={mids} closeModal={toggleForwardModal} />}
      {deleteModalVisible && (
        <DeleteMessageConfirmModal mids={mids} closeModal={toggleDeleteModal} />
      )}
    </>
  );
};
export default Operations;
