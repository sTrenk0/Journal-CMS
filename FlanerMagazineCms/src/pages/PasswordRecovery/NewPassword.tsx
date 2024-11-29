import "./passwordrecovery.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function NewPassword() {
  const [OPT, setOPT] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [email, setEmail] = useState<string>();

  const navigate = useNavigate();

  const sendRequest = async () => {
    const data = new FormData();

    if (!email || !OPT || !password) {
      console.error("Email, recovery code, or password is missing!");
      toast.error("Email, recovery code, or password is missing!");
      return;
    }

    data.append("email", email);
    data.append("recovery_code", OPT);
    data.append("new_password", password);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/recovery-password",
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.status === 204) {
        navigate("/panel/admin/login");
        toast.success("Password recovered successfuly");
      }
    } catch (error: unknown) {
      console.log(error);
      toast.error("An unknown error had occured");
    }
  };

  return (
    <div>
      <div className="password-recovery-page w-full min-h-screen flex items-center justify-center font-sans">
        <div className="max-w-xl w-full bg-white p-10 rounded-xl shadow shadow-slate-300">
          <h1 className="text-5xl font-medium mb-6">Set the password</h1>
          <form className="mt-8">
            <div className="flex flex-col space-y-6">
              <label>
                <p className="font-medium text-slate-700 pb-2 text-lg">Email</p>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full py-4 border border-slate-200 rounded-lg px-4 focus:outline-none focus:border-slate-500 hover:shadow text-lg"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                <p className="font-medium text-slate-700 pb-2 text-lg">
                  OPT from email
                </p>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  className="w-full py-4 border border-slate-200 rounded-lg px-4 focus:outline-none focus:border-slate-500 hover:shadow text-lg"
                  placeholder="Code from email"
                  onChange={(e) => setOPT(e.target.value)}
                />
              </label>
              <label>
                <p className="font-medium text-slate-700 pb-2 text-lg">
                  New password
                </p>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full py-4 border border-slate-200 rounded-lg px-4 focus:outline-none focus:border-slate-500 hover:shadow text-lg"
                  placeholder="New password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
          </form>
          <button
            className="w-full py-4 mt-4 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center text-lg"
            onClick={sendRequest}
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
    </div>
  );
}

export default NewPassword;
