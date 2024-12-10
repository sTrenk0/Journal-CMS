import { FC, useState, useEffect } from "react";
import axios from "axios";
import { Trash } from "lucide-react";
import Modal from "./Popup";
import { toast } from "react-toastify";

const PostList: FC = () => {
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  interface Posts {
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

  const [postData, setPostData] = useState<Posts[] | undefined>();
  const [editingProduct, setEditingProduct] = useState<Posts | null>(null);

  // Form field states
  const [name, setName] = useState<string>("");
  const [sourceProductUrl, setSourceProductUrl] = useState<string>("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    axios
      .get<Posts[]>(
        `https://5230-159-100-101-189.ngrok-free.app/api/v1/admin/products/`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setPostData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleEditClick = async (productId: string) => {
    try {
      const response = await axios.get<Posts>(
        `https://5230-159-100-101-189.ngrok-free.app/v1/admin/products/id/${productId}`,
        { withCredentials: true }
      );
      const productData = response.data;

      setEditingProduct(productData);
      setName(productData.name);
      setSourceProductUrl(productData.source_product_url);
      setPreviewUrls(productData.preview_urls);
      setIsActive(productData.is_active);
      setDescription(productData.description);

      setEditOpen(true);
    } catch (error) {
      toast.error("Failed to fetch product data for editing.");
      console.error(error);
    }
  };

  const handleUpdateProduct = async () => {
    if (editingProduct) {
      try {
        await axios.patch(
          `https://5230-159-100-101-189.ngrok-free.app/v1/admin/products/${editingProduct.id}`,
          {
            name,
            source_product_url: sourceProductUrl,
            preview_urls: previewUrls,
            is_active: isActive,
            description,
          },
          { withCredentials: true }
        );

        // Update state and close modal
        setPostData((prevData) =>
          prevData?.map((post) =>
            post.id === editingProduct.id
              ? {
                  ...post,
                  name,
                  source_product_url: sourceProductUrl,
                  preview_urls: previewUrls,
                  is_active: isActive,
                  description,
                }
              : post
          )
        );

        toast.success("Product updated successfully");
        setEditOpen(false);
        setEditingProduct(null);
      } catch (error) {
        toast.error("Failed to update the product.");
        console.error(error);
      }
    }
  };

  const deletePots = async () => {
    if (deleteUserId) {
      try {
        await axios.delete(
          `https://5230-159-100-101-189.ngrok-free.app/api/v1/admin/products/${deleteUserId}`,
          { withCredentials: true }
        );

        toast.success("Post deleted successfully");

        setPostData((prevData) =>
          prevData?.filter((post) => post.id !== deleteUserId)
        );
      } catch {
        toast.error("Failed to delete the post");
      } finally {
        setOpen(false);
        setDeleteUserId(null);
      }
    }
  };

  return (
    <>
      <div className="text-gray-900">
        <div className="p-4 flex">
          <h1 className="text-3xl font-bold">Posts</h1>
        </div>
        <div className="px-3 flex justify-center">
          <table className="w-full text-md bg-gray-50 shadow-md rounded mb-4">
            <tbody>
              <tr className="border-b">
                <th className="text-left p-3 px-5">Name</th>
                <th className="text-left p-3 px-5">Status</th>
                <th className="text-left p-3 px-5">Created At</th>
                <th className="text-left p-3 px-5">Download URL</th>
                <th></th>
              </tr>

              {postData ? (
                postData.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b hover:bg-slate-200 bg-gray-100"
                  >
                    <td className="p-3 px-5">{post.name}</td>
                    <td className="p-3 px-5">
                      {post.is_active ? (
                        <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                      ) : (
                        <div className="w-3 h-3 bg-red-300 rounded-full"></div>
                      )}
                    </td>
                    <td className="p-3 px-5">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 px-5">
                      <a
                        href={post.source_product_url}
                        className="text-blue-500 hover:underline"
                      >
                        {post.source_product_url.substring(0, 20) + "..."}
                      </a>
                    </td>
                    <td className="p-3 px-5 flex justify-end">
                      <button
                        type="button"
                        className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none"
                        onClick={() => {
                          setDeleteUserId(post.id);
                          setOpen(true);
                        }}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        className="text-sm bg-blue-500 ml-3 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none"
                        onClick={() => handleEditClick(post.id)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <p>Loading...</p>
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {open && (
          <Modal open={open} onClose={() => setOpen(false)}>
            <div className="text-center w-56">
              <Trash size={56} className="mx-auto text-red-500" />
              <div className="mx-auto my-4 w-48">
                <h3 className="text-lg font-black text-gray-800">
                  Confirm Delete
                </h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this post?
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-red-500 hover:bg-red-700 text-gray-50 py-1 px-2 rounded text-lg font-semibold"
                  onClick={deletePots}
                >
                  Delete
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-lg font-semibold text-gray-50 py-1 px-2 rounded"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}

        {editOpen && (
          <Modal open={editOpen} onClose={() => setEditOpen(false)}>
            <div className="w-[500px] p-4">
              <h2 className="text-lg font-bold mb-4">Edit Product</h2>

              <label className="block mb-2 text-sm font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block p-2 w-full mb-3 border rounded"
              />

              <label className="block mb-2 text-sm font-medium">
                Source Product URL
              </label>
              <input
                type="text"
                value={sourceProductUrl}
                onChange={(e) => setSourceProductUrl(e.target.value)}
                className="block p-2 w-full mb-3 border rounded"
              />

              <label className="block mb-2 text-sm font-medium">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block p-2 w-full h-48 mb-3 border rounded"
              />

              <label className="block mb-2 text-sm font-medium">
                Active Status
              </label>
              <select
                value={isActive ? "active" : "inactive"}
                onChange={(e) => setIsActive(e.target.value === "active")}
                className="block p-2 w-full mb-3 border rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <button
                onClick={handleUpdateProduct}
                className="w-full bg-blue-500 text-white py-2 mt-4 rounded"
              >
                Save Changes
              </button>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default PostList;
