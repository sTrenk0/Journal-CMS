import "./post.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import IMAGES from "../../assets/images.ts";
import { MdOutlineArrowBack } from "react-icons/md";
import { useState, useEffect } from "react";
import { useIsMobile } from "../../helpers/useIsMobile.ts";
import { useParams } from "react-router-dom";
import axios from "axios";

function Post() {
  interface Discount {
    type: string;
    mode: string;
    value: number;
  }

  interface BasketOrder {
    name: string;
    qty: number;
    sum: number;
    total: number;
    icon: string;
    unit: string;
    code: string;
    barcode: string;
    header: string;
    footer: string;
    tax: unknown[]; // Assuming tax is an array of unknown items
    uktzed: string;
    discounts: Discount[];
  }

  interface MerchantPaymInfo {
    reference: string;
    destination: string;
    comment: string;
    customerEmails: string[];
    basketOrder: BasketOrder[];
  }

  interface PaymentRequestBody {
    amount: number;
    ccy: number;
    merchantPaymInfo: MerchantPaymInfo;
    redirectUrl: string;
    webHookUrl: string;
    validity: number;
    paymentType: string;
    agentFeePercent: number;
  }

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // Use the useNavigate hook

  interface ProductInfo {
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
  const [data, setData] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [donationAmmount, setDonationAmmount] = useState<number>(0);
  const [clientEmail, setClientEmail] = useState<string>("");
  const webHookUrl: string = import.meta.env.VITE_WEB_HOOK_URL;
  const monoXToken: string = import.meta.env.VITE_TOKEN;
  const domainName: string = import.meta.env.VITE_DOMAIN_NAME;

  function removeLastTwoZeros(num: number) {
    return parseInt(num.toString().replace(/00$/, ""), 10);
  }

  const timestamp = new Date().toISOString();

  const requestBody: PaymentRequestBody = {
    amount: donationAmmount,
    ccy: 980,
    merchantPaymInfo: {
      reference: "84d0070ee4e44667b31371d8f8813941237",
      destination: "Покупка щастя",
      comment: "Покупка щастя",
      customerEmails: [],
      basketOrder: [
        {
          name: "К. Фланер",
          qty: 1,
          sum: donationAmmount,
          total: donationAmmount,
          icon: "string",
          unit: "шт.",
          code: "d21da1c47f3c45fca10a10c32518bdeb",
          barcode: "string",
          header: "string",
          footer: "string",
          tax: [],
          uktzed: "string",
          discounts: [
            {
              type: "DISCOUNT",
              mode: "PERCENT",
              value: 0.01,
            },
          ],
        },
      ],
    },
    redirectUrl: `${domainName}paymentsuccess?amount=${removeLastTwoZeros(
      donationAmmount
    )}&email=${clientEmail}&time=${timestamp}`,
    webHookUrl: `${webHookUrl}/api/v1/payments/hook?product_id=${id}&customer_email=${clientEmail}`,
    validity: 3600,
    paymentType: "debit",
    agentFeePercent: 1.42,
  };

  const makePaymentRequest = async (): Promise<void> => {
    console.log("URL:", webHookUrl);
    console.log("Request Body:", requestBody);
    try {
      const response = await axios.post(
        "https://api.monobank.ua/api/merchant/invoice/create",
        requestBody,
        {
          headers: {
            "X-Token": monoXToken,
            "Content-Type": "application/json",
          },
        }
      );
      const pageUrl = response.data.pageUrl;
      if (pageUrl) {
        window.location.href = pageUrl;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };
  const getButtonClass = (value: number) => {
    return donationAmmount === value
      ? "border-2 border-gray-500 shadow-lg shadow-gray-500/50 rounded-full"
      : "rounded-full";
  };

  useEffect(() => {
    // Fetching data from API using axios
    axios
      .get<ProductInfo>(`http://localhost:8000/api/v1/products/id/${id}/`)
      .then((response) => {
        setData(response.data); // Store API data in state
        setLoading(false); // Stop loading
        setMainImage(response.data.preview_urls[0]); // Set the first image as the main image
      })
      .catch((error) => {
        setError("Failed to fetch data");
        console.log(error);
        setLoading(false);
        navigate("/404");
      });
  }, [id, navigate]);

  const changeImage = (src: string) => {
    setMainImage(src);
  };

  //* Screen size check
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or loading indicator
  }

  if (error) {
    return <div>{error}</div>;
  }

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
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-wrap -mx-4">
                {/* Product Images */}
                <div className="w-full md:w-1/2 px-4 mb-8">
                  {mainImage && (
                    <img
                      src={mainImage}
                      alt="Product"
                      className="w-full h-auto rounded-lg shadow-md mb-4"
                      id="mainImage"
                    />
                  )}
                  <div className="flex gap-4 py-4 justify-center overflow-x-auto">
                    {data?.preview_urls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Thumbnail ${index + 1}`}
                        className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                        onClick={() => changeImage(url)}
                      />
                    ))}
                  </div>
                </div>

                {/* Product Details */}
                <div className="w-full md:w-1/2 px-4 text-lg font-medium">
                  <h2 className="not-italic font-bold mb-2  text-[64px] leading-[86px] text-center">
                    {data?.name || "Loading product details..."}
                  </h2>
                  <div className="text-left">
                    <p className="text-[#8AA3B6] mb-3 text-xl">Опис</p>
                    <div className="description_container">
                      <p className="break-words">
                        {data?.description || "Failed to retrieve description"}
                      </p>
                    </div>
                    <div className="text-right description_container">
                      <p className="text-[#8AA3B6] mb-3 text-xl mt-5">
                        Як завантажити випуск?
                      </p>
                      <div className="description_container">
                        <p className="break-words">
                          Отримати файл з вмістом цього випуску можна, зробивши
                          внесок від 70 грн на рахунок благодійного фонду{" "}
                          <span>
                            <Link
                              className="underline voli-link text-[#98ADBB]"
                              to="https://www.instagram.com/vilni_volunteers?igsh=NWMxZ281Y21xeDho"
                            >
                              «Волонтерський рух «Вільні»
                            </Link>
                          </span>
                          , що опікується збором коштів на потреби, пов‘язані з
                          війною. Після оплати ви зможете завантажити файл на
                          свій девайс, а також отримаєте його на вашу поштову
                          скриньку (не забудьте перевірити «спам»). З будь-якими
                          питаннями звертайтеся до нашої редакції.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-16">
                    <div className="text-center mt-16">
                      <p className="not-italic font-bold text-[36px] leading-[49px] text-[#8AA3B6]">
                        Оберіть суму внеску
                      </p>
                      <div className="mt-6 flex justify-center gap-14">
                        <button
                          onClick={() => setDonationAmmount(7000)}
                          className={getButtonClass(7000)}
                        >
                          <img
                            src={IMAGES.seventy_uah}
                            alt="70 UAH"
                            className="rounded-full"
                          />
                        </button>
                        <button
                          onClick={() => setDonationAmmount(10000)}
                          className={getButtonClass(10000)}
                        >
                          <img
                            src={IMAGES.hundered_uah}
                            alt="100 UAH"
                            className="rounded-full"
                          />
                        </button>
                        <button
                          onClick={() => setDonationAmmount(15000)}
                          className={getButtonClass(15000)}
                        >
                          <img
                            src={IMAGES.hundered_fifity_uah}
                            alt="150 UAH"
                            className="rounded-full"
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-center mt-7">
                      <div className="relative w-3/5">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none"></div>
                        <input
                          type="email"
                          id="email"
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-5 p-2.5"
                          placeholder="mail@gmail.com"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                        />
                        <button
                          className=" mt-8 rounded-lg bg-slate-800 py-3 px-6 border border-transparent text-center text-pretty text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                          type="button"
                          onClick={() => makePaymentRequest()}
                        >
                          До оплати
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default Post;
