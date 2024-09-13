import "./contribute.css";
import { useState } from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import IMAGES from "../../assets/images";
import { Outlet, Link } from "react-router-dom";

const Contribute = () => {
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
        <nav className="flex-1 flex flex-col p-5 text-lg font-medium" style={{backgroundColor: "#FDF7E1"}}>
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
      <div className="flex-1 flex flex-col" >
        {/* Adjust header to align logo and burger icon */}
        <header
          className="flex items-center p-4 font-semibold text-black border-b border-black sticky top-0 z-10"
          style={{backgroundColor: "#FDF7E1"}}
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
          <div className="content">
            <p className="text-center mt-7 text-black font-bold text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-snug">
              Як долучитися
            </p>
          </div>
          <div className="mainContent text-right pr-4 lg:pr-20 xl:pr-32 mt-11">
            <div className="contenConteiner">
              <p className="mt-6 font-normal text-lg md:text-xl lg:text-2xl">
                Наш проєкт — це про міське багатоголосся й переплетіння <br />
                перспектив, тож ми запрошуємо вас до співтворення та відкриті до{" "}
                <br />
                різноманітних форматів. <br />
              </p>
            </div>
            <div className="content">
              <div
                className="text-center mt-7 font-bold text-xl md:text-3xl lg:text-4xl xl:text-5xl leading-snug"
                style={{ color: "#D1AD66" }}
              >
                Якщо ви студент/ка
              </div>
            </div>
            <div className="contenConteiner">
              <p className="mt-10 font-normal text-lg md:text-xl lg:text-2xl">
                Ви можете долучитися до нашої студентського об’єднання, яке{" "}
                <br />
                містить такі відділи:
              </p>
            </div>
            <div className="contenConteiner">
              <p className="mt-10 font-normal text-lg md:text-xl lg:text-2xl">
                • СММ-відділ (ведення соцмереж) <br />• Комунікаційний відділ
                (пошук партнерів, запрошених гостей, поширення оголошень тощо){" "}
                <br />
                •Редакційний відділ (редагування матеріалів й дописів) <br />•
                Відділ організації івентів (планування наших офлайн-заходів та
                участі у фестивалях) <br /> • Дизайнерський відділ (дизайн
                соцмереж, афіш і безпосередньо сторінок часопису)
              </p>
            </div>
            <div className="contenConteiner">
              <p className="mt-10 font-normal text-lg md:text-xl lg:text-2xl">
                Також ви можете взяти участь у творенні часопису без входження
                до <br /> складу команди, надавши матеріал/и. Напишіть нам, і ми
                надішлемо всі <br /> вимоги.
              </p>
            </div>
            <div className="content">
              <div
                className="text-center mt-7 font-bold text-xl md:text-3xl lg:text-4xl xl:text-5xl leading-snug"
                style={{ color: "#D1AD66" }}
              >
                Якщо ви не студент/ка, втім <br /> хочете підтримати нашу <br />{" "}
                ініціативу
              </div>
            </div>
            <div className="contenConteiner">
              <p className="mt-10 font-normal text-lg md:text-xl lg:text-2xl">
                • Ми хочемо взяти у вас інтерв’ю. Віримо, що кожному є що
                розказати про місто, навіть якщо ви не киянин/ка, чи галузь
                вашої діяльності не стосується безпосередньо міста.
              </p>
            </div>
            <div className="contenConteiner">
              <p className="mt-10 font-normal text-lg md:text-xl lg:text-2xl">
                • Можливо спільний захід? Якщо ви є громадською чи будь-якою
                іншою організацією, ми можемо робити як спільний контент для
                часопису й соцмереж, так і офлайн-заходи. Будемо дуже раді, якщо
                ви напишете нам про вашу зацікавленість.
              </p>
            </div>
            <div className="contenConteiner mb-8">
              <p className="mt-10 font-normal text-lg md:text-xl lg:text-2xl">
                • Як щодо надання матеріалу/ів? Якщо вам є що сказати, але
                формат інтерв‘ю не до душі, надсилайте ваші статті,
                фоторепортажі, ілюстрації — і вони стануть цінним доповненням
                часопису.
              </p>
            </div>
          </div>
        </main>
        <Outlet />
      </div>
    </div>
  );
};

export default Contribute;
