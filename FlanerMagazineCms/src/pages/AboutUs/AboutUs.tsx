import "./aboutsus.css";
import { useState, useEffect } from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import IMAGES from "../../assets/images";
import { Outlet, Link } from "react-router-dom";
import { useIsMobile } from "../../helpers/useIsMobile";

const AboutUs = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

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
          {/* Move logo to left next to burger */}
          <div className="flex items-center">
            <img src={IMAGES.logo} alt="logo" className="h-8 w-auto" />
          </div>
        </header>
        <main className="p-4 flex-1 overflow-auto">
          <div className="content">
            <p className="text-center mt-7 text-black font-bold text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-snug">
              Про нас
            </p>
          </div>
          <div className="mainContent text-right pr-4 lg:pr-20 xl:pr-32 mt-8">
            <div className="contenConteiner">
              <p className="text-green-600 font-extrabold text-xl md:text-2xl">
                Хто ми й чому ми це робимо?
              </p>
              <p className="mt-3 font-normal text-lg md:text-xl lg:text-2xl">
                Ми команда студентів і студенток, які об’єднані спільною метою –
                краще зрозуміти середовище навколо нас, покращити його та
                спонукати до дій інших. Рутина, поспіх і відчуття
                відстороненості заважають нам помічати красу міста, чути голоси
                тих, хто потребує допомоги, та усвідомлювати себе частиною
                цілого. Ми хочемо це змінити. Пізнаючи місто, ми пізнаємо себе,
                дивимося глибше на буденні речі, знайомимося з новими <br />{" "}
                людьми й загалом розвиваємо небайдужість.
              </p>
            </div>
            <div className="mt-10 flex justify-end">
              <div>
                <img src={IMAGES.wide_placeholder} alt="wide_placeholder" />
              </div>
            </div>
            <br />
            <div className="contenConteiner mt-5">
              <p className="mt-3 font-normal text-lg md:text-xl lg:text-2xl">
                Наша ініціатива націлена на подолання як локальних проблем, так
                і більш глобальних. Найболючішою наразі є війна в нашій країні.
                Тому всі гроші з оплати доступу до матеріалів часопису, а також
                з продажів мерчу напряму переказуються на рахунок благодійного
                фонду{" "}
                <span className="text-green-600 underline">
                  «Волонтерський рух «Вільні»
                </span>
                . А на наших офлайн-заходах ви неодноразово побачите
                представників спільноти волонтерів{" "}
                <span className="text-green-600 underline">«Толока»</span>, з
                яким ми об’єдналися для створення спільного контенту та
                взаємодії з аудиторією. Так ми сподіваємося зробити наш внесок у
                наближення перемоги.
              </p>
            </div>
            <div className="contenConteiner mt-10">
              <p className="text-green-600 font-extrabold text-xl md:text-2xl">
                Чому «К. Фланер»?
              </p>
              <p className="mt-3 font-normal text-lg md:text-xl lg:text-2xl">
                Назва часопису — не тільки ім’я персонажки, а ключ до розуміння
                нашої місії. «Київська фланер» – це людина, яка неспішно гуляє
                містом, спостерігає і відкриває для себе нове. Пані Фланер не
                просто проходить повз, а зупиняється, щоб роздивитись. Вона
                бачить поезію в графіті, історію в кожній цеглинці та натхнення
                в посмішці перехожого. Ми хотіли б, щоб наші читачі й читачки
                теж відкрили для себе ці принади фланерства.
              </p>
            </div>
            <div className="contenConteiner mt-10">
              <p className="text-green-600 font-extrabold text-xl md:text-2xl">
                Що таке часопис «К.Фланер»?{" "}
              </p>
              <p className="mt-3 font-normal text-lg md:text-xl lg:text-2xl mb-11">
                Віримо, що кожен і кожна бачать Київ по-своєму, тому сторінки
                цього часопису є майданчиком для висвітлення різних поглядів. У
                часописі ви натрапите як на статті членів/кинь нашої команди,
                так і на матеріали студентів і студенток, які виявили бажання
                підтримати нашу ініціативу, не долучаючись до «внутрішньої
                кухні» Крім того, ми працюємо над залученням найрізноманітніших
                людей, які не належать до категорії студентства. Участь
                запрошених гостей для нас є показником того, що будь-які прірви
                в суспільстві можна здолати, якщо знайти бодай одну точку
                дотику, якою ми й хочемо зробити діяльність нашого часопису.
                Якщо ви бажаєте долучитися, то прямуйте до розділу{" "}
                <span className="text-green-600 underline">
                  «Як долучитися»
                </span>
                , або одразу пишіть чи телефонуйте в{" "}
                <span className="text-green-600 underline">редакцію</span>.
              </p>
            </div>
          </div>
        </main>
      </div>
      <Outlet />
    </div>
  );
};

export default AboutUs;
