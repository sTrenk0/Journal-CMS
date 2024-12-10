import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ManualProduct() {
  const [prodictId, setProductId] = useState<string>();
  const [customerEmail, setCustomerEmail] = useState<string>();

  const handleSubmit = async () => {
    try {
      await axios.post(
        `https://f02c-159-100-101-189.ngrok-free.app/api/v1/admin/products/send?product_id=${prodictId}&email_to=${customerEmail}`,
        {},
        { withCredentials: true }
      );
      toast.success("Message sent successfully");
    } catch (error) {
      toast.error("An unknown error occurred");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center mt-60">
      <div className="flex flex-col w-1/3">
        <label className="block mb-2 text-xl font-medium text-gray-900 text-left">
          Product ID
        </label>
        <input
          type="text"
          className="block p-4 h-12 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 ring-blue-500"
          placeholder="5b46ead9 - 1e72 - . . . . . . . . . ."
          onChange={(e) => setProductId(e.target.value)}
        />

        <label className="block mb-2 text-xl font-medium text-gray-900 mt-4 text-left">
          Customer E-Mail
        </label>
        <input
          type="text"
          className="block p-4 h-12 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 ring-blue-500"
          placeholder="mail@mailprovider.com"
          onChange={(e) => setCustomerEmail(e.target.value)}
        />

        <label className="block mb-2 text-xl font-medium text-gray-900 mt-4 text-left">
          Your message
        </label>
        <textarea
          id="message"
          className="block p-4 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 ring-blue-500"
          placeholder="Write your message here..."
        ></textarea>

        <div className="flex justify-center mt-5">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white text-2xl font-bold w-2/3 h-14 py-2 px-6 rounded-lg"
            onClick={handleSubmit}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManualProduct;
