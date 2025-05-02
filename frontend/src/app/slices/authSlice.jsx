import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import createThunk from '../../utils/createThunk';
import apiClient from '../../services/apiClient';
import handleAsyncCases from '../../utils/handleAsync';
import { v4 as uuidv4 } from 'uuid';

// Retrieve user from localStorage
const storedUser = localStorage.getItem('user');
const user = storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null;

// Initial state
const initialState = {
  user: user ? user : null,
  isLoading: false
};
export const signup = createThunk('auth/signup', (data) => apiClient.post('auth/signup', data))
export const login = createThunk('auth/login', (data) => apiClient.post('auth/login', data))
export const logout = createThunk('auth/logout', (deviceId) => apiClient.post('auth/logout', { deviceId }))
export const verifyEmail = createThunk('auth/verifyEmail', (token) => apiClient.post(`auth/verify?token=${token}`))
export const resendLink = createThunk('auth/resendLink', () => apiClient.post(`auth/resend-link`))

export const fetchUserDetails = createThunk('auth/fetchUserDetails', ()=>apiClient.get("/user"))

export const forgotPassword = createThunk('auth/forgotPassword', (email) => apiClient.post('auth/forgot-password', { email }))
export const resetPassword = createThunk('auth/resetPassword', (data) => {
  const email = JSON.parse(localStorage.getItem("user-email"))
  return apiClient.post(`auth/reset-password?token=${data.token}`, { email, password: data.password })
})

export const updateName = createThunk('auth/updateName', (name) => apiClient.put('auth/update-name', { name }))
export const updatePassword = createThunk('auth/updatePassword', ({ currentPassword, newPassword }) => apiClient.put('auth/update-password', { currentPassword, newPassword }))


export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (code, thunkAPI) => {
    try {
      let deviceId = localStorage.getItem('deviceId');
      if (!deviceId) {
        deviceId = deviceId = uuidv4();
        localStorage.setItem('deviceId', deviceId);
      }
      const response = await apiClient.post(`auth/google-login`, { code, deviceId });;
      if (response.data.success) {
        return response.data.data;
      } else {
        return thunkAPI.rejectWithValue(response.data.message);
      }
    } catch (error) {

      const message = errorMessageHandler(error)
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// Authentication slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncCases(builder, signup, (state, action) => {
      state.user = action.payload || null;
      localStorage.setItem('user', JSON.stringify(action.payload))
    })
    handleAsyncCases(builder, login, (state, action) => {
      state.user = action.payload || null;
      localStorage.setItem('user', JSON.stringify(action.payload))
    })
    handleAsyncCases(builder, logout, (state, action) => {
      state.user = null;
      localStorage.removeItem('user')
    })
    handleAsyncCases(builder, verifyEmail, (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload))
    })
    handleAsyncCases(builder, resendLink, (state, action) => { })
    handleAsyncCases(builder, forgotPassword, (state, action) => {
      localStorage.setItem('user-email', JSON.stringify(action.meta.arg))
    })
    handleAsyncCases(builder, resetPassword, (state, action) => { })
    handleAsyncCases(builder, updateName, (state, action) => {
      state.user = action.payload
    })
    handleAsyncCases(builder, updatePassword, (state, action) => { })
    handleAsyncCases(builder, googleLogin, (state, action) => {
      state.user = action.payload || null;
      localStorage.setItem('user', JSON.stringify(action.payload))
    })
    handleAsyncCases(builder, fetchUserDetails, (state, action) => {
      state.user = action.payload || null;
      localStorage.setItem('user', JSON.stringify(action.payload))
    })

  },
});


// Export actions
// export const { } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
