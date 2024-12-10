import "./passwordrecovery.css";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function PasswordRecovery() {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  const recoveryRequest = async () => {
    // Validate email before making the API call
    if (!email) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await axios.post(
        `https://f02c-159-100-101-189.ngrok-free.app/api/v1/auth/forgot-password?email=${email}`
      );
      toast.success("Recovery email sent successfully");
      navigate("/verifypasswordrecovery");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error occurred:", error.message);
        toast.error("Error, user not found");
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="password-recovery-page w-full min-h-screen flex items-center justify-center font-sans">
      <div className="max-w-xl w-full bg-white p-10 rounded-xl shadow shadow-slate-300">
        <h1 className="text-5xl font-medium mb-6">Reset password</h1>
        <form className="mt-8" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col space-y-6">
            <label>
              <p className="font-medium text-slate-700 pb-2 text-lg">
                Email address
              </p>
              <input
                type="email"
                className="w-full py-4 border border-slate-200 rounded-lg px-4 focus:outline-none focus:border-slate-500 hover:shadow text-lg"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>
        </form>
        <button
          className="w-full py-4 mt-4 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center text-lg"
          onClick={recoveryRequest}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
            />
          </svg>
          <span>Reset password</span>
        </button>
      </div>
    </div>
  );
}

export default PasswordRecovery;
