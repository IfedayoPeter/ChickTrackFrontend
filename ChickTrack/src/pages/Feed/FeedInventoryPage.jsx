import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { LoadingAnimation, Notification } from "../../components/CommonComponents";
import { FiMenu, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { FEED_BRANDS } from "../../constants";

const API_URL = "https://chicktrack.runasp.net/api/FeedInventory?page=1&pageSize=100"; // Updated to HTTPS

const FeedInventoryPage = () => {
  const [feedInventory, setFeedInventory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newRow, setNewRow] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [totalProfit, setTotalProfit] = useState(0);

  const fetchFeedInventory = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setFeedInventory(data.content || []);
    } catch (error) {
      console.error("Error fetching feed inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = () => {
    setNewRow({
      code: "",
      feedBrand: "",
      bagsBought: 0,
      amount: 0,
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleSaveRow = async () => {
    setSaving(true);
    setNotification(null);
    try {
      const response = await fetch("http://chicktrack.runasp.net/api/FeedInventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRow),
      });

      if (response.ok) {
        setNotification({ type: "success", message: "Feed inventory added successfully!" });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setNotification({ type: "error", message: "Failed to add feed inventory. Please try again." });
      }
    } catch (error) {
      setNotification({ type: "error", message: "An error occurred. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRow = async () => {
    setSaving(true);
    setNotification(null);
    try {
      const response = await fetch(`http://chicktrack.runasp.net/api/FeedInventory?id=${deleteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotification({ type: "success", message: "Feed inventory deleted successfully!" });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setNotification({ type: "error", message: "Failed to delete feed inventory. Please try again." });
      }
    } catch (error) {
      setNotification({ type: "error", message: "An error occurred. Please try again." });
    } finally {
      setSaving(false);
      setDeleteId(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({
      ...prev,
      [name]: name === "feedBrand" ? parseInt(value) : value,
    }));
  };

  useEffect(() => {
    fetchFeedInventory();
    const fetchTotalProfit = async () => {
      try {
        const response = await fetch("http://chicktrack.runasp.net/api/TotalSales");
        const data = await response.json();
        const profit = data.content?.reduce((total, record) => total + record.profit, 0) || 0;
        setTotalProfit(profit);
      } catch (error) {
        console.error("Error fetching total profit:", error);
      }
    };
    fetchTotalProfit();
  }, []);

  const calculateTotalBags = () => {
    return feedInventory.reduce((total, record) => total + record.bagsBought, 0);
  };

  const calculateTotalAmount = () => {
    return feedInventory.reduce((total, record) => total + record.amount, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu */}
            <button className="text-gray-500" onClick={() => setSidebarOpen(true)}>
              <FiMenu size={24} />
            </button>
            {/* Title */}
            <h1 className="text-xl font-bold text-gray-800">Feed Inventory</h1>
          </div>
        </div>
      </header>

      {/* Feed Inventory Section */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Feed Inventory</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={handleAddRow}
          >
            Add
          </button>
        </div>

        {/* Notification */}
        {notification && <Notification notification={notification} />}

        {/* Delete Confirmation */}
        {deleteId && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="text-lg font-bold mb-4">Are you sure you want to delete this inventory?</p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700"
                  onClick={handleDeleteRow}
                >
                  <FiCheck size={20} />
                </button>
                <button
                  className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700"
                  onClick={() => setDeleteId(null)}
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feed Inventory Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-500">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">Brands</th>
                <th className="px-4 py-2">Bags Bought</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-2 text-center" colSpan="5">
                    <LoadingAnimation />
                  </td>
                </tr>
              ) : (
                <>
                  {feedInventory.map((record) => (
                    <tr key={record.id} className="border-b border-gray-400">
                      <td className="px-4 py-2">{record.feedBrandName || "N/A"}</td>
                      <td className="px-4 py-2">{record.bagsBought}</td>
                      <td className="px-4 py-2">₦{record.amount.toLocaleString()}</td>
                      <td className="px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        <button
                          className="text-red-500 hover:text-red-800"
                          onClick={() => setDeleteId(record.id)}
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {newRow && (
                    <tr className="border-b border-gray-400">
                      <td className="px-4 py-2">
                        <select
                          name="feedBrand"
                          value={newRow.feedBrand}
                          onChange={handleInputChange}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Brand</option>
                          {FEED_BRANDS.map((brand) => (
                            <option key={brand.value} value={brand.value}>
                              {brand.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          name="bagsBought"
                          value={newRow.bagsBought}
                          onChange={handleInputChange}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          name="amount"
                          value={newRow.amount}
                          onChange={handleInputChange}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="date"
                          name="date"
                          value={newRow.date}
                          onChange={handleInputChange}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex justify-center gap-2 sm:gap-4">
                          <button
                            className="bg-transparent text-green-700 p-2 sm:p-3 rounded-full hover:bg-green-800"
                            onClick={handleSaveRow}
                            disabled={saving}
                          >
                            <FiCheck size={16} className="sm:size-30 bg" />
                          </button>
                          <button
                            className="bg-transparent text-red-700 p-2 sm:p-3 rounded-full hover:bg-red-800"
                            onClick={() => setNewRow(null)}
                          >
                            <FiX size={16} className="sm:size-30" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
            {!loading && (
              <tfoot>
                <tr className="bg-gray-200 font-bold border-t border-gray-400">
                  <td className="px-4 py-2">Total</td>
                  <td className="px-4 py-2">{calculateTotalBags()}</td>
                  <td className="px-4 py-2">₦{calculateTotalAmount().toLocaleString()}</td>
                  <td className="px-4 py-2"></td>
                  <td className="px-4 py-2"></td>
                </tr>
                <tr className="bg-gray-100 font-bold border-t border-gray-300">
                  <td className="px-4 py-2" colSpan="2">Total Profit</td>
                  <td className="px-4 py-2">₦{totalProfit.toLocaleString()}</td>
                  <td className="px-4 py-2"></td>
                  <td className="px-4 py-2"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </section>
    </div>
  );
};

export default FeedInventoryPage;
