import { createSlice } from "@reduxjs/toolkit";

const initialUser = JSON.parse(localStorage.getItem("user")) || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: initialUser,
    userProfile: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.userProfile = null;
      state.loading = false;
      localStorage.removeItem("user");
    }
  },
});

export const { setLoading, setUser, setUserProfile, logout } = authSlice.actions;
export default authSlice.reducer;

