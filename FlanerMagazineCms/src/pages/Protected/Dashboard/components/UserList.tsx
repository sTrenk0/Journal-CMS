import { ClipboardList, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Popup";
import { toast } from "react-toastify";

const UsersTable = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null); // Store the ID of the user to delete

  interface UserModel {
    id: string;
    is_active: boolean;
    email: string;
    is_superuser: boolean;
  }

  const [userData, setUserData] = useState<UserModel[] | undefined>();

  useEffect(() => {
    axios
      .get<UserModel[]>("http://localhost:8000/api/admin/users/", {
        withCredentials: true,
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const deleteUser = async () => {
    if (deleteUserId) {
      try {
        console.log("Deleting user with ID:", deleteUserId);
        await axios.delete(
          `http://localhost:8000/api/admin/users/${deleteUserId}`,
          { withCredentials: true }
        );

        toast.success("User deleted successfully");

        setUserData((prevData) =>
          prevData?.filter((user) => user.id !== deleteUserId)
        );
      } catch {
        toast.error("Failed to delete user");
      } finally {
        setOpen(false);
        setDeleteUserId(null);
      }
    }
  };

  return (
    <div className="text-gray-900">
      <div className="p-4 flex">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>
      <div className="px-3 flex justify-center">
        <table className="w-full text-md bg-gray-50 shadow-md rounded mb-4">
          <tbody>
            <tr className="border-b">
              <th className="text-left p-3 px-5">Email</th>
              <th className="text-left p-3 px-5">Status</th>
              <th className="text-left p-3 px-5">ID</th>
              <th className="text-left p-3 px-5">Is Superuser</th>
              <th className="text-left p-3 px-5 flex justify-end">Options</th>
              <th></th>
            </tr>

            {userData ? (
              userData.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-slate-200 bg-gray-100"
                >
                  <td className="p-3 px-5">
                    <input
                      type="text"
                      value={user.email}
                      className="bg-transparent w-full"
                      readOnly
                    />
                  </td>
                  <td className="p-3 px-5">
                    {user.is_active ? (
                      <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                    ) : (
                      <div className="w-3 h-3 bg-red-300 rounded-full"></div>
                    )}
                  </td>
                  <td className="p-3 px-5">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => navigator.clipboard.writeText(user.id)}
                    >
                      <ClipboardList size={15} className="mr-2" />
                      <span>{user.id.substring(0, 18) + "..."}</span>
                    </div>
                  </td>

                  <td className="p-3 px-5">
                    <p>{user.is_superuser ? "Yes" : "No"}</p>
                  </td>

                  <td className="p-3 px-5 flex justify-end">
                    <button
                      type="button"
                      className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none"
                      onClick={() => {
                        setDeleteUserId(user.id); // Set ID of the user to delete
                        setOpen(true); // Open the modal
                      }}
                    >
                      Delete
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

      {/* Modal component, rendered only when `open` is true */}
      {open && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <div className="text-center w-56">
            <Trash size={56} className="mx-auto text-red-500" />
            <div className="mx-auto my-4 w-48">
              <h3 className="text-lg font-black text-gray-800">
                Confirm Delete
              </h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this user?
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 hover:bg-red-700 text-gray-50 py-1 px-2 rounded text-lg font-semibold"
                onClick={deleteUser} // Use deleteUser function
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
    </div>
  );
};

export default UsersTable;
