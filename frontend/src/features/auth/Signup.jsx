import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../../app/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import useGoogleAuth from '../../hooks/useGoogleAuth';
import { v4 as uuidv4 } from 'uuid';

const Signup = () => {
  const { loginWithGoogle } = useGoogleAuth();
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isLoading, user } = useSelector((state) => state.auth);
  const navigate = useNavigate()

  useEffect(() => {
      if (user && user.isVerified) {
        navigate('/admin/dashboard');
      }
    }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = deviceId = uuidv4();
      localStorage.setItem('deviceId', deviceId);
    }
    dispatch(signup({ name, email, password, deviceId }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 transition-colors">
      <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-xl border border-zinc-200 dark:border-zinc-700 w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-purple-700 text-center dark:text-purple-400">Create an Account</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-center mt-2">Sign up to get started</p>

        {/* Continue with Google Button */}
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 py-3 mt-6 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-600 transition"
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Full Name"
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Email Address"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Password"
            />
          </div>
          <div className="flex justify-between items-center mb-8">
            <button
              type="submit"
              className={`w-full py-3 rounded-md transition ${
                isLoading
                  ? 'bg-purple-500 cursor-not-allowed'
                  : 'bg-purple-700 hover:bg-purple-800 text-white'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <p className="text-center text-zinc-500 dark:text-zinc-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-700 dark:text-purple-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
