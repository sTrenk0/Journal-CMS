import { CircleCheck } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";

const sanitizeInput = (input: string): string => {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
};

const isValidAmount = (value: string): boolean => {
  return /^\d+(\.\d{1,2})?$/.test(value);
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidTime = (time: string): boolean => {
  return !isNaN(Date.parse(time));
};

function PaymentSuccess() {
  const [queryParameters] = useSearchParams();

  const rawAmount = queryParameters.get("amount");
  const rawEmail = queryParameters.get("email");
  const rawTime = queryParameters.get("time");

  const amount = rawAmount ? sanitizeInput(rawAmount) : null;
  const email = rawEmail ? sanitizeInput(rawEmail) : null;
  const time = rawTime ? sanitizeInput(rawTime) : null;

  const validAmount = amount && isValidAmount(amount);
  const validEmail = email && isValidEmail(email);
  const validTime = time && isValidTime(time);

  console.log(validAmount);

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-6 p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <div className="flex flex-col items-center">
            <CircleCheck className="text-green-500 h-16 w-16" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mt-4">
              Платіж надіслано
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Після перевірки статусу оплати продукт буде надіслано вам на
              пошту.
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Сумма:</span>
              <span className="font-medium text-gray-900 dark:text-gray-50">
                ₴ {validAmount ? `${amount}` : "Invalid amount"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">E-Mail:</span>
              <span className="font-medium text-gray-900 dark:text-gray-50">
                {validEmail ? email : "Invalid email"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Дата &amp; Час:
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-50">
                {validTime ? new Date(time!).toLocaleString() : "Invalid time"}
              </span>
            </div>
          </div>
          <div className="flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-300"
            >
              {" "}
              Назад На Головну{" "}
            </Link>
          </div>
        </div>
      </div>
      <style>{`body {
  font-family: var(--font-ibm_plex_sans), sans-serif;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-arimo), sans-serif;
} `}</style>
    </div>
  );
}

export default PaymentSuccess;
