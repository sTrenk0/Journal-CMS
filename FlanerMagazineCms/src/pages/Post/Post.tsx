import "./post.css";
import { Link, Outlet } from "react-router-dom";
import IMAGES from "../../assets/images.ts";
import { MdOutlineArrowBack } from "react-icons/md";
import { useState, useEffect } from "react";
import { useIsMobile } from "../../helpers/useIsMobile.ts";

function Post() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  const [mainImage, setMainImage] = useState(
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmV8ZW58MHwwfHx8MTcyMTMwMzY5MHww&ixlib=rb-4.0.3&q=80&w=1080"
  );

  const changeImage = (src: string) => {
    setMainImage(src);
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
          <main className="p-4 flex-1 overflow-auto">
            <div>
              <div className="container mx-auto px-4 py-8">
                <div className="flex flex-wrap -mx-4">
                  {/* Product Images */}
                  <div className="w-full md:w-1/2 px-4 mb-8">
                    <img
                      src={mainImage}
                      alt="Product"
                      className="w-full h-auto rounded-lg shadow-md mb-4"
                      id="mainImage"
                    />
                    <div className="flex gap-4 py-4 justify-center overflow-x-auto">
                      <img
                        src="https://images.unsplash.com/photo-1505751171710-1f6d0ace5a85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxMnx8aGVhZHBob25lfGVufDB8MHx8fDE3MjEzMDM2OTB8MA&ixlib=rb-4.0.3&q=80&w=1080"
                        alt="Thumbnail 1"
                        className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                        onClick={() =>
                          changeImage(
                            "https://images.unsplash.com/photo-1505751171710-1f6d0ace5a85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxMnx8aGVhZHBob25lfGVufDB8MHx8fDE3MjEzMDM2OTB8MA&ixlib=rb-4.0.3&q=80&w=1080"
                          )
                        }
                      />
                      <img
                        src="https://images.unsplash.com/photo-1484704849700-f032a568e944?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw0fHxoZWFkcGhvbmV8ZW58MHwwfHx8MTcyMTMwMzY5MHww&ixlib=rb-4.0.3&q=80&w=1080"
                        alt="Thumbnail 2"
                        className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                        onClick={() =>
                          changeImage(
                            "https://images.unsplash.com/photo-1484704849700-f032a568e944?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw0fHxoZWFkcGhvbmV8ZW58MHwwfHx8MTcyMTMwMzY5MHww&ixlib=rb-4.0.3&q=80&w=1080"
                          )
                        }
                      />
                      <img
                        src="https://images.unsplash.com/photo-1496957961599-e35b69ef5d7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw4fHxoZWFkcGhvbmV8ZW58MHwwfHx8MTcyMTMwMzY5MHww&ixlib=rb-4.0.3&q=80&w=1080"
                        alt="Thumbnail 3"
                        className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                        onClick={() =>
                          changeImage(
                            "https://images.unsplash.com/photo-1496957961599-e35b69ef5d7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw4fHxoZWFkcGhvbmV8ZW58MHwwfHx8MTcyMTMwMzY5MHww&ixlib=rb-4.0.3&q=80&w=1080"
                          )
                        }
                      />
                      <img
                        src="https://images.unsplash.com/photo-1528148343865-51218c4a13e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwzfHxoZWFkcGhvbmV8ZW58MHwwfHx8MTcyMTMwMzY5MHww&ixlib=rb-4.0.3&q=80&w=1080"
                        alt="Thumbnail 4"
                        className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                        onClick={() =>
                          changeImage(
                            "https://images.unsplash.com/photo-1528148343865-51218c4a13e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwzfHxoZWFkcGhvbmV8ZW58MHwwfHx8MTcyMTMwMzY5MHww&ixlib=rb-4.0.3&q=80&w=1080"
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="w-full md:w-1/2 px-4 ">
                    <h2 className="not-italic font-bold mb-2  text-[64px] leading-[86px] text-center ">
                      К. Фланер №1 2024{" "}
                    </h2>
                    <div className="tetx-center ">
                      <p className=" text-[#8AA3B6] mb-3 text-xl">Опис</p>
                      <div className="description_container">
                        <p className="break-words">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Iusto exercitationem, molestias id, esse, error
                          aspernatur fugiat qui tenetur soluta blanditiis
                          officiis expedita voluptate ex? Tempore accusamus
                          voluptatum beatae labore, earum quibusda!
                        </p>
                      </div>
                      <div className="text-right description_container">
                        <p className=" text-[#8AA3B6] mb-3 text-xl mt-5">
                          Як завантажити випуск?
                        </p>
                        <div className="description_container">
                          <p className="break-words">
                            Отримати файл з вмістом цього випуску можна,
                            зробивши внесок від 70 грн на рахунок благодійного
                            фонду{" "}
                            <span>
                              <Link
                                className="underline voli-link text-[#98ADBB]"
                                to={
                                  "https://www.instagram.com/vilni_volunteers?igsh=NWMxZ281Y21xeDho"
                                }
                              >
                                «Волонтерський рух «Вільні»
                              </Link>
                            </span>
                            , що опікується збором коштів на потреби, пов‘язані
                            з війною. Після оплати ви зможете завантажити файл
                            на свій девайс, а також отримаєте його на вашу
                            поштову скриньку (не забудьте перевірити «спам»). З
                            будь-якими питаннями звертайтеся до нашої редакції.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-16">
                      <p className="not-italic font-bold text-[36px] leading-[49px] text-[#8AA3B6]">
                        Оберіть суму внеску
                      </p>
                      <div className="mt-6 flex justify-center gap-14">
                        <button>
                          <img src={IMAGES.seventy_uah} alt="" />
                        </button>
                        <button>
                          <img src={IMAGES.hundered_uah} alt="" />
                        </button>
                        <button>
                          <img src={IMAGES.hundered_fifity_uah} alt="" />
                        </button>
                      </div>

                      <div className="flex justify-center mt-6">
                        <div className="relative w-3/5">
                          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <svg
                              className="w-4 h-4 text-gray-500"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 16"
                            >
                              <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                              <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                            placeholder="name@yourmail.com"
                          ></input>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="mt-7 bg-[#8AA3B6]  text-black font-bold px-6 py-2 rounded-3xl hover:bg-[#65717a] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Оплатити
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default Post;
