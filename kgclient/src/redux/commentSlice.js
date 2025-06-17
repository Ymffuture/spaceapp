import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comment",
  initialState: {
    loading: false,
    error: null,
    commentText: "",       // for input box
    comments: [],          // all comments for a post
    replyingTo: null,      // comment ID being replied to
    editingId: null,       // comment ID being edited
    successMessage: "",    // feedback toast
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCommentText: (state, action) => {
      state.commentText = action.payload;
    },
    setComment: (state, action) => {
      state.comments = action.payload;
    },
    addComment: (state, action) => {
      state.comments.unshift(action.payload); // new comment at top
    },
    updateComment: (state, action) => {
      const updated = action.payload;
      state.comments = state.comments.map(c =>
        c._id === updated._id ? updated : c
      );
    },
    deleteComment: (state, action) => {
      const commentId = action.payload;
      state.comments = state.comments.filter(c => c._id !== commentId);
    },
    setReplyingTo: (state, action) => {
      state.replyingTo = action.payload;
    },
    setEditingId: (state, action) => {
      state.editingId = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    clearState: (state) => {
      state.loading = false;
      state.error = null;
      state.commentText = "";
      state.replyingTo = null;
      state.editingId = null;
      state.successMessage = "";
    },
  },
});

export const {
  setLoading,
  setError,
  setCommentText,
  setComment,
  addComment,
  updateComment,
  deleteComment,
  setReplyingTo,
  setEditingId,
  setSuccessMessage,
  clearState,
} = commentSlice.actions;

export default commentSlice.reducer;

