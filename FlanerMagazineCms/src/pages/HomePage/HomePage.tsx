import "./homepage.css";
import { Outlet, Link } from "react-router-dom";
import IMAGES from "../../assets/images";

function HomePage() {
  return (
    <>
      <div className="MainPage font-palatino">
        <div className="header-container flex justify-center  ">
          <div className={`header`}>
            <div
              className="HeaderElement px-20 p-5"
              style={{ backgroundColor: "#4A8D5C" }}
            >
              <Link to="/about">Про нас</Link>
            </div>
            <div
              className="HeaderElement px-20 p-5"
              style={{ backgroundColor: "#8AA3B6" }}
            >
              <Link to="/">Читати</Link>
            </div>
            <div
              className="HeaderElement px-20 p-5"
              style={{ backgroundColor: "#8E3A21" }}
            >
              <Link to="/merchandise">Мерч</Link>
            </div>
            <div
              className="HeaderElement px-20 p-5"
              style={{ backgroundColor: "#CAA150" }}
            >
              <Link to="/contribute">Як долучитися</Link>
            </div>
            <div
              className="HeaderElement px-20 p-5"
              style={{ backgroundColor: "#8E8E8E" }}
            >
              <Link to="/contact">Контакти</Link>
            </div>
          </div>
        </div>
        <div className="logo flex justify-center mt-28">
          <img src={IMAGES.logo_big} alt="logo" className="GemLogo" />
        </div>
        <div>
          <div className="text-center font-normal text-3xl mt-20">
            <p>
              Часопис про Київ: про любов, людей, тварин, будинки, <br />
              машини, цеглу, асфальт, скло, траву, дерева, зміни, розвиток,{" "}
              <br /> мрії та багато іншого. А ще ми творимо свідому спільноту.
            </p>
          </div>
        </div>
        <div>
          <div className="flex justify-center mt-16">
            <div className="mt-7 bg-black p-5 px-20 rounded-[84px] ">
              <a href="#" className="flex items-center">
                <Link to="/home">
                  <p className="BrButton">Новий випуск</p>{" "}
                </Link>
              </a>
            </div>
          </div>
        </div>
        <div className="OpenLogoContainer">
          <Link to="homepage">
            <img src={IMAGES.flaner} alt="flaner" className="OpenLogo" />
          </Link>
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default HomePage;
