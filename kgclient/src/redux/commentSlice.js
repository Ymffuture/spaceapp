import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
    name:"comment",
    initialState:{
        loading:false,
        comment:[],
    },
    reducers:{
        //actions
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setComment:(state, action) => {
            state.comment = Array.isArray(action.payload) ? action.payload : [];
        },
        // Appends a single comment (e.g. from a live socket event) instead of
        // requiring the caller to pass a whole new array/function.
        addComment:(state, action) => {
            if (!Array.isArray(state.comment)) state.comment = [];
            state.comment.push(action.payload);
        }
    }
});
export const {setLoading, setComment, addComment} = commentSlice.actions;
export default commentSlice.reducer;
