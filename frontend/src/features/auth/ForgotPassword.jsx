import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../app/slices/authSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-xl border border-zinc-200 dark:border-zinc-700 w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 text-center">
          Forgot Password
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-center mt-2">
          Enter your email to reset your password
        </p>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-md transition text-white font-medium ${
              isLoading
                ? "bg-purple-500 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-800"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
