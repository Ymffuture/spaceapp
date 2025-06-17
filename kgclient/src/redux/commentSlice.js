// src/redux/commentSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  comment: "",
  error: null,         // Optional: useful for displaying error messages
  success: false,      // Optional: to track if comment was successfully posted
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setComment: (state, action) => {
      state.comment = action.payload;
      state.success = false;  // Reset success on new input
    },

    clearComment: (state) => {
      state.comment = "";
      state.success = false;
      state.error = null;
    },

    setCommentError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    addCommentSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
  },
});

export const {
  setLoading,
  setComment,
  clearComment,
  setCommentError,
  addCommentSuccess,
} = commentSlice.actions;

export default commentSlice.reducer;

