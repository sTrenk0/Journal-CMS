import axios from "axios";
import { FC, useState } from "react";
import { toast } from "react-toastify";

const NewPost: FC = () => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([""]);
  const [name, setName] = useState<string>("");
  const [downloadurl, setDownloadurl] = useState<string>("");
  const [isactive, setIsactive] = useState<boolean>(true);
  const [description, setDescription] = useState<string>("");

  const handleAddUrl = () => {
    setPreviewUrls([...previewUrls, ""]);
  };

  const handleUrlChange = (index: number, value: string) => {
    const updatedUrls = [...previewUrls];
    updatedUrls[index] = value;
    setPreviewUrls(updatedUrls);
  };

  const handleSubmit = async () => {
    console.log("Name:", name);
    console.log("Download url:", downloadurl);
    console.log("Preview URLs:", previewUrls);
    console.log("Is active:", isactive);
    console.log("Description:", description);

    const postData = {
      name: name,
      source_product_url: downloadurl,
      preview_urls: previewUrls,
      is_active: isactive,
      description: description,
    };

    try {
      console.log(postData);
      await axios.post(
        `${import.meta.env.VITE_DOMAIN_NAME}api/v1/admin/products/`,
        postData,
        {
          withCredentials: true,
        }
      );
      toast.success("Post created successfully");
    } catch (error: unknown) {
      console.error("Error creating post:", error);

      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 422) {
          toast.error("Validation error. Not all fields filled are in.");
        } else {
          toast.error("Failed to create Post.");
        }
      }
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center mt-40">
        <div className="flex flex-col w-1/3">
          <label className="block mb-2 text-xl font-medium text-gray-900 text-left">
            Назва
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block p-4 h-12 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 ring-blue-500"
            placeholder="Випуск..."
          />

          <label className="block mb-2 text-xl font-medium text-gray-900 mt-4 text-left">
            URL Для скачування
          </label>
          <input
            type="text"
            value={downloadurl}
            onChange={(e) => setDownloadurl(e.target.value)}
            className="block p-4 h-12 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 ring-blue-500"
            placeholder="https://drive.google.com/file/d/1FVCvCw1"
          />

          <label className="block text-xl font-medium text-gray-900 mt-4 text-left">
            URL Preview
          </label>

          {previewUrls.map((url, index) => (
            <input
              key={index}
              type="text"
              className="block mt-3 p-4 h-12 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 ring-blue-500"
              placeholder="Enter preview URL"
              value={url}
              onChange={(e) => handleUrlChange(index, e.target.value)}
            />
          ))}

          <button
            type="button"
            onClick={handleAddUrl}
            className="mt-2 text-blue-500 hover:underline text-left"
          >
            + Add another URL
          </button>

          <label className="block mb-2 text-xl font-medium text-gray-900 mt-4 text-left">
            Активний на страті
          </label>

          <select
            className="block p-4 h-14 w-full text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 ring-blue-500"
            value={isactive ? "active" : "inactive"}
            onChange={(e) => setIsactive(e.target.value === "active")}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <label className="block mb-2 text-xl font-medium text-gray-900 mt-4 text-left">
            Опис
          </label>
          <textarea
            id="message"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block p-4 w-full h-44 text-base text-gray-900 bg-gray-50 rounded-lg border border-gray-300 ring-blue-500"
            placeholder="Write your message here..."
          ></textarea>

          <div className="flex justify-center mt-5">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white text-2xl font-bold w-2/3 h-14 py-2 px-6 rounded-lg"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPost;
