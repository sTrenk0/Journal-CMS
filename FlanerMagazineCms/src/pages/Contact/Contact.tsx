import "./contact.css";
import { useState } from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import IMAGES from "../../assets/images";
import { Outlet, Link } from "react-router-dom";
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import { LiaTelegramPlane } from "react-icons/lia";

const Contact = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  return (
      <div className="flex overflow-hidden min-h-screen" style={{ backgroundColor: "#FDF7E1" }}>
        <aside
            className={`flex-shrink-0 w-64 flex flex-col border-r transition-all duration-300 border-black sticky top-0 h-screen ${
                sidebarOpen ? "" : "-ml-64"
            }`}
        >
          <nav className="flex-1 flex flex-col p-5 text-lg font-medium">
            <Link to="/" className="p-2 flex items-center">
              <img src={IMAGES.lightgrey} alt="grey" className="mr-2" />
              Читати
            </Link>
            <Link to="/" className="p-2 flex items-center">
              <img src={IMAGES.red} alt="grey" className="mr-2" />
              Мерч
            </Link>
            <Link to="/" className="p-2 flex items-center">
              <img src={IMAGES.yellow} alt="grey" className="mr-2" />
              Як долучитися
            </Link>
            <Link to="/" className="p-2 flex items-center">
              <img src={IMAGES.grey} alt="grey" className="mr-2" />
              Контакти
            </Link>
            <Link to="/" className="p-2 flex items-center">
              <MdOutlineArrowBack />
              <p className="font-bold">Головна</p>
            </Link>
          </nav>
        </aside>
        <div className="flex-1 flex flex-col">
          <header
              className="flex items-center p-4 font-semibold text-black border-b border-black sticky top-0 z-10"
              style={{ backgroundColor: "#FDF7E1" }}
          >
            <button className="p-1 mr-4" onClick={toggleSidebar}>
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex items-center">
              <img src={IMAGES.logo} alt="logo" className="h-8 w-auto" />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-8">
            <div className="text-center mt-7">
              <p className="text-black font-bold text-3xl sm:text-5xl lg:text-6xl xl:text-7xl leading-snug">
                Контакти
              </p>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 py-8 lg:py-16 mt-12">
              <div className="shadowContainer  h-56 sm:w-56 sm:h-72 lg:h-80 lg:w-64 md:w-56" >
                <img src={IMAGES.author_photo} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="text-center lg:text-left">
                <div className="mt-8 text-xl lg:text-2xl font-semibold">
                <span className="font-bold">
                  Вероніка Мартинова —
                </span>{" "}
                  <br />
                  головна редакторка часопису
                </div>
                <div className="mt-3 text-xl lg:text-2xl text-gray-600">
                  k.flanerr@gmail.com <br />
                  +380639908149
                </div>
              </div>
            </div>
            <div className="mt-12">
              <p className="text-center text-black font-normal text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-snug">
                Наші соцмережі
              </p>
              <div className="flex items-center justify-center gap-12 md:gap-24 lg:gap-32 mt-10">
                <div className="text-4xl sm:text-5xl lg:text-6xl">
                  <a href="https://www.instagram.com/kflaner?igsh=MXBwYmZyamc1bTdjcA%3D%3D&utm_source=qr">
                    <AiFillInstagram />
                  </a>
                </div>
                <div className="text-4xl sm:text-5xl lg:text-6xl">
                  <a href="https://www.facebook.com/share/Lq62N2EeNLPT7o51/?mibextid=LQQJ4d">
                    <FaFacebook />
                  </a>
                </div>
                <div className="text-4xl sm:text-5xl lg:text-6xl">
                  <a href="https://t.me/kflaner">
                    <LiaTelegramPlane />
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
        <Outlet />
      </div>
  );
};

export default Contact;
