import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message: null,
    error: null,
    isLoading: false,
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setSuccess: (state, action) => {
            state.message = action.payload;
            state.error = null
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.message = null
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        clearNotification: (state) => {
            state.message = null;
            state.error = null;
            // state.isLoading = false;
        },
    },
});

export const { setSuccess, setError, setLoading, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
