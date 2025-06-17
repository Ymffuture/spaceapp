// src/redux/commentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  comment: [],
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setComment: (state, action) => {
      state.comment = Array.isArray(action.payload) ? action.payload : [];
    },
    addComment: (state, action) => {
      if (!Array.isArray(state.comment)) {
        state.comment = [];
      }
      state.comment.push(action.payload);
    },
  },
});

export const { setLoading, setComment, addComment } = commentSlice.actions;
export default commentSlice.reducer;

