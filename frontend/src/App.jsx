import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Login from './features/auth/Login';
import Dashboard from './features/user/Dasboard';
import Signup from './features/auth/Signup';
import VerifyEmail from './features/auth/VerifyEmail';
import ForgotPassword from './features/auth/ForgotPassword';
import ResetPassword from './features/auth/ResetPassword';
import PrivateRoute from './features/auth/PrivateRoutes';
import Loader from './components/UniversalLoader';
import Home from './pages/Home';
import NotFound from './pages/404';
import AdminPanel from './features/admin/AdminDashboard';
import { setNavigate } from './utils/NavigationService';
import { clearNotification } from './app/slices/notificationSlice';

import './app.css'
import { AnimatePresence } from 'motion/react';
import ConfirmationModal from './components/ConfirmationModal';


const App = () => {
  const isLoading = useSelector((state) =>
    state.auth.isLoading || state.task.isLoading || state.category.isLoading || state.labels.isLoading || state.users.isLoading || state.stats.isLoading
  );
  const { isOpen } = useSelector((state) => state.confirmationModal);


  const { error, message } = useSelector(state => state.notification)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setNavigate(navigate); // Pass the navigate function to the middleware
  }, [navigate]);

  useEffect(() => {
    if (message) {
      toast.success(message);
    }

    if (error) {
      toast.error(error);
    }
    if (message || error) {
      const timeout = setTimeout(() => {
        dispatch(clearNotification());
      }, 5000); // 5 seconds

      return () => clearTimeout(timeout); // cleanup
    }
  }, [message, error, dispatch]);

  useEffect(() => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, []);


  return (
    <>
      <Toaster />
      <AnimatePresence>
        {isOpen && <ConfirmationModal />}
      </AnimatePresence>
      {isLoading && <Loader />}
      <Routes>

        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Route */}
        <Route
          path="/verify"
          element={
            <PrivateRoute requireVerification>
              <VerifyEmail />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/dashboard/*"
          element={
            <PrivateRoute allowedRoles={['user']}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard/*"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminPanel />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
