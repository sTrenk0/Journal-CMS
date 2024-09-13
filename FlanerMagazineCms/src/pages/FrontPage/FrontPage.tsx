import "./frontpage.css";
import IMAGES from "../../assets/images";
import { MdArrowForward } from "react-icons/md";
import { Outlet, Link } from "react-router-dom";

function FrontPage() {
  return (
    <div className="textBlock font-palatino">
      <div className="textHold font-normal text-xl leading-[27px] text-left">
        <span>
          <p className="font-bold text-xl">Любі читачі й читачки!</p>
          <p className="text-xl">Я — К. Фланер.</p>
          <p className="text-xl">
            Маю звичку починати свій ранок з гімнастики на балконі моєї
            квартири. Поки роблю вправи, дивлюся, як між щільної забудови й
            пишної крони каштанів сходить сонце, як двірники замітають тротуари,
            відчиняються двері крамниць, а голуби балансують на електричних
            дротах. Чую, як під вікнами гуркоче трамвай. Усе це відбувається в
            Києві, у місті, яке я з теплом називаю своїм. Потім годинами блукаю
            вулицями. Придивляюся до фасадів, вдихаю запахи, вловлюю моменти й
            намагаюся не впустити жодної дрібниці, хоч й перечіпляюсь через це
            на кожному кроці Так я постійно натрапляю на щось нове, несподіване,
            зазвичай приховане в буденних речах.
          </p>
          <p className="text-xl">
            Ввечері, після того, як погодую свою домашню черепашку Трухашку, я
            люблю обмірковувати побачене, почуте і відчуте. Що я відкрила для
            себе сьогодні? Які емоції подарував мені Київ? І що я можу зробити
            для того, аби зберегти це місто від деструкції? У часописі
            «К.Фланер» я нарешті матиму можливість ділитися своїми
            спостереженнями. Разом з небайдужою спільнотою ми зусібіч
            відкриватимемо справжній дух Києва. Познайомимо вас з тим, що його
            підтримує, а що руйнує.
          </p>
          <p className="text-xl">
            Зустрінемося на сторінках часопису, у цьому блозі, а, можливо, й
            десь у київському метро;
          </p>
          <p className="text-xl"> Ваша закохана у Київ</p>
          <p className="text-xl">К. Фланер</p>
        </span>
        <div>
          <div className="mt-10 flex justify-end">
            <img src={IMAGES.logo} alt="logo" />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="mt-7 bg-black text-white p-5 px-12 rounded-[84px]">
            <a href="#" className="flex items-center">
              <Link to="/">Головна</Link>
              <MdArrowForward className="ml-2" />
            </a>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default FrontPage;
