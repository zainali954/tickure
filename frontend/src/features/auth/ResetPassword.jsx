import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../app/slices/authSlice";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(60);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = localStorage.getItem("user-email");

  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }

    if (!email) {
      toast.error("Email is required to change the password.");
      return;
    }

    dispatch(resetPassword({ token, password, email }));
  };

  const handleResend = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-xl border border-zinc-200 dark:border-zinc-700 w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 text-center">
          Reset Password
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-center mt-2">
          Enter and confirm your new password
        </p>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white dark:bg-zinc-700 dark:border-zinc-600 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          {timer > 0 ? (
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              Resend password reset link in{" "}
              <span className="font-bold">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="w-full py-3 bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-white font-medium rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
            >
              Resend Password Reset Link
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
