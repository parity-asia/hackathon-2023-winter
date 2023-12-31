import { createSlice } from "@reduxjs/toolkit";
import { TOAST_TYPES } from "@/utils/constants";

const MAX_TOASTS = 6;
let count = 0;

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    toasts: [],
  },
  reducers: {
    addToast(state, { payload }) {
      const toastId = count++;
      if (state.toasts.length >= MAX_TOASTS) {
        const i = state.toasts.findIndex((item) => !item.sticky);
        state.toasts.splice(i, 1);
      }
      state.toasts.push({ id: toastId, ...payload });
    },
    removeToast(state, { payload }) {
      state.toasts = state.toasts.filter((item) => item.id !== payload);
    },
    clearToasts(state) {
      state.toasts = [];
    },
    updateToast(state, { payload }) {
      state.toasts = state.toasts.map((t) => {
        if (t.id === payload.id) {
          return { ...t, ...payload };
        }
        return t;
      });
    },
  },
});

export const toastsSelector = (state) => state.toast.toasts;

export const { addToast, removeToast, clearToasts, updateToast } =
  toastSlice.actions;

export const newToastId = () => count++;

export const newPendingToast = (id, message) =>
  addToast({
    id,
    type: TOAST_TYPES.PENDING,
    message,
    sticky: true,
  });

export const updatePendingToast = (id, message) =>
  updateToast({
    id,
    type: TOAST_TYPES.PENDING,
    message,
    sticky: true,
  });

export const newSuccessToast = (message) =>
  addToast({
    type: TOAST_TYPES.SUCCESS,
    message,
  });

export const newErrorToast = (message) =>
  addToast({
    type: TOAST_TYPES.ERROR,
    message,
  });

export default toastSlice.reducer;
