import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../app/slices/authSlice';
import useGoogleAuth from '../../hooks/useGoogleAuth';
import { v4 as uuidv4 } from 'uuid';

const Login = () => {
  const { loginWithGoogle } = useGoogleAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      if (user.isVerified) {
        navigate('/admin/dashboard');
      } else {
        navigate('/verify')
        setLocalError('Please verify your email before logging in.');
      }
    }
  }, [user, navigate]);
  
  const handleLogin = async (e) => {
    e.preventDefault();

    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = deviceId = uuidv4();
      localStorage.setItem('deviceId', deviceId);
    }
    if (!email || !password) {
      setLocalError('Both fields are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    setLocalError('');
    dispatch(login({ email, password, deviceId }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-xl border border-zinc-200 dark:border-zinc-700 w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 text-center">
          Welcome Back
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-center mt-2">
          Login to continue
        </p>

        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-200 text-zinc-700 py-3 mt-6 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-600 transition"
        >
          <img
            src="../google-logo-search-new-svgrepo-com.svg"
            alt="Google logo"
            className="w-6 h-6 mr-3"
          />
          Continue with Google
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-zinc-300 dark:border-zinc-600"></div>
          <span className="px-3 text-zinc-500 dark:text-zinc-400 text-sm">or</span>
          <div className="flex-grow border-t border-zinc-300 dark:border-zinc-600"></div>
        </div>

        {(localError || error) && (
          <p className="text-red-600 dark:text-red-400 text-sm text-center mb-4">
            {localError || error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
              placeholder="Email Address"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
              placeholder="Password"
            />
          </div>
          <div className="text-right mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-purple-700 dark:text-purple-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-md flex justify-center items-center transition ${
              isLoading
                ? 'bg-purple-500 cursor-not-allowed text-white'
                : 'bg-purple-700 hover:bg-purple-800 text-white'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loader border-2 border-white border-t-transparent w-5 h-5 rounded-full animate-spin"></span>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <p className="text-center text-zinc-500 dark:text-zinc-400 mt-4">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-purple-700 dark:text-purple-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
