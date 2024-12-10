import { Bell } from "lucide-react";
import Tooltip from "./Tooltip";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { MeUser } from "../Dashboard";

interface NavbarProps {
  user: MeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const navigate = useNavigate();

  const login = async () => {
    try {
      await axios.post(
        `https://f02c-159-100-101-189.ngrok-free.app/api/v1/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      navigate("/panel/admin/login/");
    } catch {
      toast.error("Ooops! Something went wrong on logout.");
    }
  };

  return (
    <nav
      className="bg-white  font-sans text-black"
      style={{ borderBottom: "2px solid #f0f2f5" }}
    >
      <div className="max-w-screen-2xl flex flex-wrap justify-end text-right mx-auto p-4">
        <div className="block w-full md:block md:w-auto">
          <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            <li>
              <a
                href="#"
                className="block py-2 px-3 md:p-0 text-slate-950 rounded md:bg-transparent"
              >
                <button
                  className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 px-2 border border-red-500 hover:border-transparent rounded"
                  onClick={login}
                >
                  Logout
                </button>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 mt-1 md:p-0 text-slate-950 rounded md:bg-transparent"
              >
                <Tooltip content="No messages yet">
                  <Bell />
                </Tooltip>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 md:p-0 text-slate-950 rounded md:bg-transparent"
              >
                <img
                  alt=""
                  src={`https://ui-avatars.com/api/?name=${user?.email}&background=ad3a48&color=fff`}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                />{" "}
                <span className="ml-2 font-bold">{user?.email}</span>
                <span className="ml-2 font-bold">
                  {user?.is_superuser === true && <span>(admin)</span>}
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
