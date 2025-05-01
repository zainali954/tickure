import { createAsyncThunk } from "@reduxjs/toolkit";
import { setError, setSuccess } from "../app/slices/notificationSlice";

const createThunk = (type, apiCall, skipSuccess = false) => {
    return createAsyncThunk(type, async (payload, { dispatch, rejectWithValue }) => {
        try {
            const response = await apiCall(payload);
            
            // Only dispatch success message if skipSuccess is false
            if (!skipSuccess) {
                dispatch(setSuccess(response.data.message));
            }

            return response.data.data;
        } catch (error) {
            console.error(`${type} Error:`, error);
            const errorMessage = error.response?.data?.message || "Operation Failed";
            dispatch(setError(errorMessage));
            return rejectWithValue(errorMessage);
        }
    });
};


export default createThunk