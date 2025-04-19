import React, { useState, useEffect } from "react";
import { createUser, getAllUsers, deleteUserById } from "./UserService"; // Added deleteUserById
import { LoadingAnimation, Notification, PageHeader } from "../../components/CommonComponents";
import Header from "../../components/Header"; // Updated import for Header

const UserPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    userName: "",
    phoneNumber: "",
    password: "",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false); // Separate loading state for list
  const [notification, setNotification] = useState(null);

  const fetchUsers = async () => {
    setListLoading(true);
    try {
      const data = await getAllUsers();
      console.log("API Response:", data); // Add this to debug
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setListLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      await createUser(formData);
      setNotification({ type: "success", message: "User created successfully!" });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      setFormData({
        fullName: "",
        email: "",
        userName: "",
        phoneNumber: "",
        password: "",
      });
      await fetchUsers(); // Wait for refresh
    } catch (error) {
      setNotification({
        type: "error",
        message: error.response?.data?.message || "Failed to create user.",
      });
      setTimeout(() => {
        setNotification(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserById(userId);
        setNotification({ type: "success", message: "User deleted successfully!" });
        setTimeout(() => {
            setNotification(null);
        }, 2000);
        await fetchUsers(); // Refresh the user list
      } catch (error) {
        setNotification({
          type: "error",
          message: error.response?.data?.message || "Failed to delete user.",
        });
        setTimeout(() => {
          setNotification(null);
        }, 2000);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <PageHeader title="User Management" />
      <div className="p-6">
        {/* Notification */}
        {notification && <Notification notification={notification} />}

        {/* User Creation Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Create User</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Username"
              required
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="border border-gray-300 p-2 rounded"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 bg-blue-600 text-white px-4 py-2 rounded ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>

        {/* User List */}
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">User List</h2>
          {listLoading ? (
            <LoadingAnimation />
          ) : (
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Full Name</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Phone Number</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th> {/* Added Actions column */}
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">{user.fullName}</td>
                      <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                      <td className="border border-gray-300 px-4 py-2">{user.phoneNumber}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4"> {/* Updated colspan */}
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;