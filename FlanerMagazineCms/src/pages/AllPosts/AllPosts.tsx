import "./allposts.css";
import { Link, Outlet } from "react-router-dom";
import IMAGES from "../../assets/images.ts";
import { MdOutlineArrowBack } from "react-icons/md";
import { useState, useEffect } from "react";
import { useIsMobile } from "../../helpers/useIsMobile.ts";
import axios from "axios";

function AllPosts() {
  interface PreviewUrls {
    id: string;
    name: string;
    source_product_url: string;
    preview_urls: string[];
    is_active: boolean;
    description: string;
    price: number;
    created_at: string;
    updated_at: string;
  }

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const [data, setData] = useState<PreviewUrls[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetching data from API using axios
    axios
      .get<PreviewUrls[]>("http://localhost:8000/api/products")
      .then((response) => {
        setData(response.data); // Store API data in state
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        setError("Failed to fetch data"); // Handle error
        console.log(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    // return <div>Loading...</div>;
    console.log("loading");
  }

  if (error) {
    console.log(error);
    // return <div>{error}</div>;
  }

  console.log(data);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  //*screensize check
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <>
      <div className="flex overflow-hidden h-screen">
        <aside
          className={`flex-shrink-0 w-64 flex flex-col border-r transition-all duration-300 border-black sticky top-0 h-screen ${
            sidebarOpen ? "" : "-ml-64"
          }`}
        >
          <nav className="flex-1 flex flex-col p-5 text-lg font-medium">
            <Link to="/allposts" className="p-2 flex items-center">
              <img src={IMAGES.lightgrey} alt="grey" className="mr-2" />
              Читати
            </Link>
            <Link to="/merchandise" className="p-2 flex items-center">
              <img src={IMAGES.red} alt="grey" className="mr-2" />
              Мерч
            </Link>
            <Link to="/contribute" className="p-2 flex items-center">
              <img src={IMAGES.yellow} alt="grey" className="mr-2" />
              Як долучитися
            </Link>
            <Link to="/contact" className="p-2 flex items-center">
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
          {/* Adjust header to align logo and burger icon */}
          <header
            className="flex items-center p-4 font-semibold text-black border-b border-black sticky top-0 z-10"
            style={{ backgroundColor: "inherit" }}
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
          <main className="p-4 flex-1 overflow-auto ">
            <div className="content">
              <p className="text-center mt-7 text-black font-bold text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-snug">
                Читати
              </p>
            </div>
            <div className="mainContent pr-4 lg:pr-20 xl:pr-32 mt-10">
              <div className="articles flex justify-center items-center text-center flex-col">
                {data.map((item) => (
                  <div className="mt-8 flex">
                    <div className="image image_container">
                      <Link to={"/post/" + item.id}>
                        <img
                          className="title_img"
                          src={item.preview_urls[0]}
                          alt="reactangle_placeholder"
                        />
                      </Link>
                    </div>
                    <div
                      className="desktext text-center not-italic font-extrabold text-4xl leading-[43px] ml-6"
                      style={{ writingMode: "vertical-lr" }}
                    >
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default AllPosts;
