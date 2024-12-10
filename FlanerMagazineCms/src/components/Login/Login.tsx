import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForm: React.FC = () => {
  // State to store form values
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>();

  const navigate = useNavigate(); // Use the useNavigate hook

  // Handler for form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData();
    data.append("email", email);
    data.append("password", password);

    try {
      const response = await axios.post(
        `https://f02c-159-100-101-189.ngrok-free.app/api/v1/auth/login`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response.status === 204) {
        navigate("/panel/admin/");
      }
    } catch (error: unknown) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 400) {
          console.log("Bad credentials. Login Failed.");
          setMessage(
            error.response.data.detail || "Login failed, bad credentials."
          );

          // Logging the error response for debugging
          console.log("Error responce", error.response.data.detail);

          toast.error("Login or password are incorrect");
        } else if (error.response && error.response.status === 422) {
          console.log("Validation error. Login Failed.");

          // Assuming error.response.data contains the message
          setMessage(error.response.data.detail || "Validation error.");

          // Logging the error response for debugging
          console.log("Error responce", error.response.data.detail);
        }
      } else {
        setMessage("An unexpected error occurred."); // Fallback for non-Axios errors
        toast.error("Unknown error had occured");
      }
    }
  };

  useEffect(() => {
    if (message) {
      console.log("Updated message:", message);
    }
  }, [message]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 font-sans">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-wide text-gray-900 md:text-2xl dark:text-white">
              Howdy, admin!
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update email state on change
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Update password state on change
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-[#2563EB] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </section>
  );
};

export default LoginForm;
