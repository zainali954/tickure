import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import { setupInterceptors } from '../services/apiClient';
import taskReducer from './slices/taskSlice';
import notificationReducer from './slices/notificationSlice';
import uiReducer from './slices/uiSlice'
import categoryReducer from './slices/categorySlice'
import labelReducer from './slices/labelSlice'
import confirmationModalReducer from './slices/confirmationModalSlice'
import userReducer from "./slices/userSlice"
import statsReducer from "./slices/statsSlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    notification: notificationReducer,
    ui: uiReducer,
    category: categoryReducer,
    labels: labelReducer,
    confirmationModal : confirmationModalReducer,
    users: userReducer,
    stats: statsReducer
  },
})

setupInterceptors(store);

export default store