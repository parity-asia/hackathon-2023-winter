import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface State {
  [gid: number]: number[] | undefined;
}

const initialState: State = {};

const channelMsgSlice = createSlice({
  name: "channelMessage",
  initialState,
  reducers: {
    resetChannelMsg() {
      return initialState;
    },
    clearChannelMessage(state, action: PayloadAction<number>) {
      const id = action.payload;
      state[id] = [];
    },
    fillChannelMsg(state, action: PayloadAction<State>) {
      return action.payload;
    },
    addChannelMsg(state, action: PayloadAction<{ id: number; mid: number; local_id?: any }>) {
      const { id, mid, local_id = null } = action.payload;
      if (state[id]) {
        const midExisted = state[id]!.findIndex((id) => id == mid) > -1;
        const localMsgExisted = state[id]!.findIndex((id) => id == local_id) > -1;
        if (midExisted || localMsgExisted) return;
        // 每次入库，都排序
        const newArr = [...(state[id] as number[]), +mid].sort((a, b) => a - b);
        state[id] = newArr;
      } else {
        state[id] = [+mid];
      }
    },
    removeChannelMsg(state, action: PayloadAction<{ id: number; mid: number }>) {
      const { id, mid } = action.payload;
      if (state[id]) {
        const idx = state[id]!.findIndex((i) => i == mid);
        if (idx > -1) {
          // 存在 则再删除
          state[id]!.splice(idx, 1);
        }
      }
    },
    replaceChannelMsg(
      state,
      action: PayloadAction<{ id: number; localMid: number; serverMid: number }>
    ) {
      const { id, localMid, serverMid } = action.payload;
      if (state[id]) {
        const localIdx = state[id]!.findIndex((i) => i == localMid);
        if (localIdx > -1 && serverMid) {
          // 存在 则再删除
          state[id]!.splice(localIdx, 1, serverMid);
        }
      }
    },
    removeChannelSession(state, action: PayloadAction<number | number[]>) {
      const ids = Array.isArray(action.payload) ? action.payload : [action.payload];
      ids.forEach((id) => {
        delete state[id];
      });
    }
  }
});

export const {
  removeChannelSession,
  resetChannelMsg,
  fillChannelMsg,
  addChannelMsg,
  removeChannelMsg,
  replaceChannelMsg,
  clearChannelMessage
} = channelMsgSlice.actions;

export default channelMsgSlice.reducer;
