import "./merch.css";
import { useState } from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import IMAGES from "../../assets/images";
import { Outlet, Link } from "react-router-dom";

const Merch = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  return (
    <div className="flex overflow-hidden h-screen">
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
          {/* Move logo to left next to burger */}
          <div className="flex items-center">
            <img src={IMAGES.logo} alt="logo" className="h-8 w-auto" />
          </div>
        </header>
        <main className="p-4 flex-1 overflow-auto">
          <div className="content">
            <p className="text-center mt-7 text-black font-bold text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-snug">
              Мерч
            </p>
          </div>
          <div className="mainContent text-right pr-4 lg:pr-20 xl:pr-32 mt-8">
            <div className="contenConteiner">
              <p className="mt-6 font-normal text-lg md:text-xl lg:text-2xl">
                Кажуть, що пані Фланер ніколи не виходить на вулицю без шалика.
                Отож ми вирішили запропонувати нашим читачам доповнити свої
                урбаністичні луки саме цим аксесуаром.
              </p>
            </div>
            <div className="contenConteiner">
              <p className="mt-3 font-normal text-lg md:text-xl lg:text-2xl">
                У збірці закріплених сториз із назвою «Мерч» у нашому{" "}
                <span style={{ color: "#8E3A21" }} className="underline">
                  <a
                    href="https://www.instagram.com/kflaner?igsh=MXBwYmZyamc1bTdjcA%3D%3D&utm_source=qr"
                    target="_blank"
                  >
                    інстаграмі
                  </a>
                </span>{" "}
                будуть з’являтися шалики на будь-який смак: такі, які будуть
                розвіювати стрімкі потоки протягу між будівлями, або ж такі, що
                вірно грітимуть в найхолодніші зимові морози. Деякі моделі можна
                використовувати як пов’язки на голову, зав'язувати на сумку чи
                носити як пояс.
              </p>
            </div>
            <div className="contenConteiner">
              <p className="mt-6 font-normal text-lg md:text-xl lg:text-2xl">
                До речі, шалик – чудовий аксесуар не лише для пані та панянок! У
                наших соцмережах ми викладатимемо ідеї образів, аби кожен і
                кожна змогли відшукати свій стиль. А з нашими шаликами це буде
                геть не складно, адже кожен дбайливо виготовлений руками, а отже
                – унікальний.
              </p>
            </div>
            <div className="contenConteiner">
              <p className="mt-6 font-normal text-lg md:text-xl lg:text-2xl">
                Ми дотримуємося концепції відповідального споживання, тому й
                наша продукція виготовлена з розпущених секонд-хенд светрів та
                тканин, що вже були в ужитку! І ні, вони не смердять))
              </p>
            </div>
            <div className="mt-10 flex justify-end gap-10">
              <div>
                <img
                  src={IMAGES.horizontal_placeholder}
                  alt="wide_placeholder"
                />
              </div>
              <div>
                <img
                  src={IMAGES.horizontal_placeholder}
                  alt="wide_placeholder"
                />
              </div>
              <div>
                <img
                  src={IMAGES.horizontal_placeholder}
                  alt="wide_placeholder"
                />
              </div>
            </div>
            <br />
            <div className="contenConteiner">
              <p className="mt-6 font-normal text-lg md:text-xl lg:text-2xl">
                І наостанок найважливіше — усі гроші з ваших покупок йдуть на
                рахунок нашого партнерського фонду «Вільні», який опікується
                зборами, пов’язаними з війною. Тому кожна ваша покупка наближає
                перемогу!
              </p>
            </div>
            <div className="contenConteiner">
              <p className="mt-6 font-normal text-lg md:text-xl lg:text-2xl">
                Ми сподіваємося, що ошалешили вас достатньо, аби ви обрали собі
                свій неповторний шалик!
              </p>
            </div>
          </div>
          <div className="content">
            <p
              className="text-center mt-7 font-bold text-xl md:text-4xl lg:text-5xl xl:text-6xl leading-snug"
              style={{ color: "#8E3A21" }}
            >
              Як замовити:
            </p>
          </div>
          <div className="flex justify-center text-center align-text-center">
            <div className="mt-10">
              <div>
                <span
                  style={{ color: "#8E3A21" }}
                  className="font-normal text-3xl"
                >
                  Спосіб 1:
                </span>
                <div className="font-normal text-2xl">
                  <br /> Перейдіть в наш профіль в{" "}
                  <span style={{ color: "#8E3A21" }} className="underline">
                    <a
                      href="https://www.instagram.com/kflaner?igsh=MXBwYmZyamc1bTdjcA%3D%3D&utm_source=qr"
                      target="_blank"
                    >
                      інстаграмі
                    </a>
                  </span>
                  <br />
                  та знайдіть виділену сториз "Мерч". <br /> Ознайомтеся з
                  моделями та <br /> виберіть свій ідеальний шалик. <br />{" "}
                  Напишіть нам в директ, і ми <br /> залюбки оформимо <br />{" "}
                  замовлення.
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center text-center align-text-center">
            <div className="mt-10">
              <div>
                <span
                  style={{ color: "#8E3A21" }}
                  className="font-normal text-3xl"
                >
                  Спосіб 2:
                </span>
                <div className="font-normal text-2xl">
                  <br /> Якщо ви не користуєтесь соціальними мережами, <br />
                  переходьте за цим{" "}
                  <span style={{ color: "#8E3A21" }} className="underline">
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLScFuHgeFaCuxmrZhZfllU4fMRFbdkr7eegbltBu4KX7kAeGVQ/viewform"
                      target="_blank"
                    >
                      посиланням
                    </a>
                  </span>
                  <br /> та залиште свої дані. <br /> Не забудьте вказати номер
                  шалика!
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center text-center align-text-center">
            <div className="mt-10">
              <div>
                <span
                  style={{ color: "#8E3A21" }}
                  className="font-normal text-3xl"
                >
                  Спосіб 3:
                </span>
                <div className="font-normal text-2xl">
                  <br /> Напишіть нам на{" "}
                  <span style={{ color: "#8E3A21" }} className="underline">
                    <a href="mailto:kflanerkyiv@gmail.com" target="_blank">
                      пошту
                    </a>
                  </span>{" "}
                  з темою <br />
                  «замовлення мерчу» і ми <br />
                  підкажемо, що робити далі!
                </div>
              </div>
            </div>
          </div>
          <div className="mainContent text-right pr-4 lg:pr-20 xl:pr-32 mt-12">
            <p className="font-normal text-xl">
              От і все, чекаємо на ваші замовлення!
            </p>
            <p className="italic mt-5 font-normal text-xl">
              Нотатка: вдягнувши шалик, не забудьте прогулятися Києвом!{" "}
            </p>
          </div>
        </main>
        <Outlet />
      </div>
    </div>
  );
};

export default Merch;
