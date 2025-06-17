import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blog: null,           // A single blog being viewed
  yourBlogs: [],        // All blogs by the current user
  allBlogs: [],         // (Optional) All blogs for listing
  loading: false,
  error: null,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlog: (state, action) => {
      state.blog = action.payload;
    },
    setYourBlogs: (state, action) => {
      state.yourBlogs = action.payload;
    },
    setAllBlogs: (state, action) => {
      state.allBlogs = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearBlog: (state) => {
      state.blog = null;
    },
    clearAll: () => initialState,
  },
});

export const {
  setBlog,
  setYourBlogs,
  setAllBlogs,
  setLoading,
  setError,
  clearBlog,
  clearAll,
} = blogSlice.actions;

export default blogSlice.reducer;

