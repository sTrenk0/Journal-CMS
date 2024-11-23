import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { Link } from "react-router-dom";

// Define the expected structure of the payment info response
interface PaymentInfo {
  product_id: string;
  customer_email: string;
  invoice: string;
  status: string;
  failureReason: string | null;
  errorCode: string | null;
  amount: number;
  ccy: number;
  finalAmount: number;
  createdDate: string;
  modifiedDate: string;
  reference: string;
  destination: string;
  cancelList: string[] | null; // Assuming cancelList is an array of strings or null
  paymentInfo: {
    maskedPan: string;
    approvalCode: string;
    rrn: string;
    trainId: string | null;
    terminal: string;
    bank: string;
    paymentSystem: string;
    paymentMethod: string;
    fee: number;
    country: string;
    agentFee: number | null; // Assuming agentFee is a number or null
  };
  walletData: Record<string, unknown> | null; // Using Record to represent a key-value object structure
  tipsInfo: Record<string, unknown> | null; // Assuming tipsInfo follows a similar structure
}

const PaymentHistory: React.FC = () => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo[] | null>(null); // State for an array of objects

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      const apiUrl = "http://localhost:8000/api/v1/admin/payments/";
      try {
        const response: AxiosResponse<PaymentInfo[]> = await axios.get(apiUrl, {
          withCredentials: true,
        });
        setPaymentInfo(response.data); // Assign the array directly
        console.log("Payment Info:", response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error occurred:", error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };

    fetchPaymentInfo();
  }, []);

  function removeLastTwoZeros(num: number) {
    return parseInt(num.toString().replace(/00$/, ""), 10);
  }

  return (
    <div className="text-gray-900">
      <div className="p-4 flex">
        <h1 className="text-3xl font-bold">Payment History</h1>
      </div>

      <div className="px-3 flex justify-center">
        <table className="w-full text-md bg-gray-50 shadow-md rounded mb-4">
          <tbody>
            <tr className="border-b">
              <th className="text-left p-3 px-5">Amount</th>
              <th className="text-left p-3 px-5">Created Date</th>
              <th className="text-left p-3 px-5">Customer Email</th>
              <th className="text-left p-3 px-5">Invoice ID</th>
              <th className="text-left p-3 px-5">Status</th>
              <th className="text-left p-3 px-5 flex justify-end">Product</th>
              <th></th>
            </tr>
            {paymentInfo ? (
              paymentInfo.map((info, index) => (
                <tr
                  className="border-b hover:bg-slate-200 bg-gray-100"
                  key={`${info.product_id}-${index}`}
                >
                  <td className="p-3 px-5">
                    <input
                      type="text"
                      className="bg-transparent text-slate-900 w-full"
                      readOnly
                      value={`${removeLastTwoZeros(info.amount)} ₴`}
                    />
                  </td>
                  <td className="p-3 px-5">
                    {new Date(info.createdDate!).toLocaleString()}
                  </td>
                  <td className="p-3 px-5">
                    <div className="flex items-center cursor-pointer">
                      <span>{info.customer_email}</span>
                    </div>
                  </td>
                  <td className="p-3 px-5">{info.invoice}</td>
                  <td className="p-3 px-5">{info.status.toUpperCase()}</td>
                  <td className="p-3 px-5 flex justify-end">
                    <Link
                      to={`http://localhost:5173/post/${info.product_id}`}
                      className="text-sky-700 hover:text-sky-500"
                    >
                      http://localhost:5173/post/{info.product_id.slice(0, 6)}
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
