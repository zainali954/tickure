// features/confirmationModalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const confirmationModalSlice = createSlice({
  name: 'deleteModal',
  initialState: {
    isOpen: false,
    title:null,
    message: null,
    action: null,
    payload:null,
    categoryId:null // for redirecting
  },
  reducers: {
    showConfirmModal: (state, action) => {
      state.isOpen = true;
      state.title = action.payload.title ||  "Are you sure ?"
      state.message = action.payload.message;
      state.action = action.payload.action;
      state.payload = action.payload.payload;
      state.categoryId = action.payload.categoryId;
    },
    hideConfirmModal: (state) => {
      state.isOpen = false;
      state.message = '';
      state.onConfirm = null;
    },
  },
});

export const { showConfirmModal, hideConfirmModal } = confirmationModalSlice.actions;
export default confirmationModalSlice.reducer;
