import { Bell } from "lucide-react";
import Tooltip from "./Tooltip";

const Navbar: React.FC = () => {
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
                <button className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 px-2 border border-red-500 hover:border-transparent rounded">
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
                  src="https://botanica.gallery/wp/wp-content/plugins/buddypress-first-letter-avatar/images/roboto/512/cyrillic_1072.png"
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                />{" "}
                <span className="ml-2 font-bold">Admin</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
