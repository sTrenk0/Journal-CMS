import { FC, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const UpdateUser: FC = () => {
  const [Id, setId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    let isValid = true;
    //*
    if (!Id || Id.length < 36) {
      toast.error("Please enter a valid ID");
      isValid = false;
    }

    //* Email validation
    if (!email || !emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      isValid = false;
    }

    //* Password validation (minimum 8 characters)
    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      isValid = false;
    }
    return isValid;
  };

  const handleCreateUser = () => {
    if (!validateForm()) {
      return;
    }

    const userData = {
      email,
      password,
      is_active: isActive,
    };

    console.log("User Data:", userData);

    try {
      axios.patch(
        `${import.meta.env.VITE_DOMAIN_NAME}api/v1/admin/users/${Id}`,
        userData,
        {
          withCredentials: true,
        }
      );
      toast.success("User updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update the User.");
    }
  };

  return (
    <div className="flex justify-center items-center mt-60">
      <div className="flex flex-col w-1/3">
        <label className="block mb-2 text-xl font-medium text-gray-900 text-left">
          User-ID
        </label>
        <input
          type="id"
          value={Id}
          onChange={(e) => setId(e.target.value)}
          className="block p-4 h-12 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 ring-blue-500"
          placeholder="b1c17fa0-0ed0-4f80-b898-e9d82a5......."
        />
        {/* Email field */}
        <label className="block mb-2 text-xl font-medium text-gray-900 text-left mt-4">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block p-4 h-12 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 ring-blue-500"
          placeholder="user@example.com"
        />

        {/* Password field */}
        <label className="block mb-2 text-xl font-medium text-gray-900 mt-4 text-left">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block p-4 h-12 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 ring-blue-500"
          placeholder="••••••••"
        />

        {/* Active/Inactive dropdown */}
        <label className="block mb-2 text-xl font-medium text-gray-900 mt-4 text-left">
          Is User Active
        </label>
        <select
          className="block p-4 h-14 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 ring-blue-500"
          value={isActive ? "active" : "inactive"}
          onChange={(e) => setIsActive(e.target.value === "active")}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Submit button */}
        <div className="flex justify-center mt-5">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white text-2xl font-bold w-2/3 h-14 py-2 px-6 rounded-lg"
            onClick={handleCreateUser}
          >
            Update User
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
