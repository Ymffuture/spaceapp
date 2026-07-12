// Is my blogslice good

import {createSlice} from "@reduxjs/toolkit"

const blogSlice = createSlice({
    name:"blog",
    initialState:{
        blog:null,
        yourBlog:null
    },
    reducers:{
        //actions
        setBlog:(state, action) => {
            state.blog = action.payload;
            
        },
        setYourBlog:(state, action) => {
            state.yourBlog = action.payload;
        },
        // Merge a single blog (e.g. fetched directly via getBlogById) into the
        // existing list instead of replacing it wholesale. Used by BlogView when
        // landing on a blog URL directly (fresh load / refresh / shared link) so
        // the cached blogs list from the /blogs page isn't clobbered.
        upsertBlog:(state, action) => {
            const incoming = action.payload;
            if (!Array.isArray(state.blog)) {
                state.blog = [incoming];
                return;
            }
            const idx = state.blog.findIndex((b) => b._id === incoming._id);
            if (idx === -1) {
                state.blog.push(incoming);
            } else {
                state.blog[idx] = incoming;
            }
        }

    }
});

export const {setBlog, setYourBlog, upsertBlog} = blogSlice.actions;
export default blogSlice.reducer;
