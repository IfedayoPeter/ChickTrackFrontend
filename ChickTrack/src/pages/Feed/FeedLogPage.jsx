import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { LoadingAnimation, Notification } from "../../components/CommonComponents";
import { FiMenu, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { calculateTotalProfit } from "./TotalSalesPage"; // Import calculateTotalProfit

const API_URL = "https://chicktrack.runasp.net/api/FeedLog?page=1&pageSize=100";

const FeedLogPage = () => {
  const [feedLogs, setFeedLogs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const navigate = useNavigate();

  const fetchFeedLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setFeedLogs(data.content || []);
    } catch (error) {
      console.error("Error fetching feed logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotals = async () => {
    try {
      const response = await fetch("https://chicktrack.runasp.net/api/TotalSales");
      const data = await response.json();
      const sales = data.content?.reduce((total, record) => total + record.amount, 0) || 0;
      const profit = calculateTotalProfit(data.content || []); // Use calculateTotalProfit
      setTotalSales(sales);
      setTotalProfit(profit);
    } catch (error) {
      console.error("Error fetching totals:", error);
    }
  };

  const handleDeleteRow = async () => {
    setLoading(true);
    setNotification(null);
    try {
      const response = await fetch(`https://chicktrack.runasp.net/api/FeedLog?id=${deleteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotification({ type: "success", message: "Feed log deleted successfully!" });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setNotification({ type: "error", message: "Failed to delete feed log. Please try again." });
      }
    } catch (error) {
      setNotification({ type: "error", message: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchFeedLogs();
    fetchTotals();
  }, []);

  const currentSalesBalance = totalSales - totalProfit;

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
            <h1 className="text-xl font-bold text-gray-800">Feed Log</h1>
          </div>
        </div>
      </header>

      {/* Feed Log Section */}
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">Feeds Log Table</h2>

        {/* Notification */}
        {notification && <Notification notification={notification} />}

        {/* Delete Confirmation */}
        {deleteId && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="text-lg font-bold mb-4">Are you sure you want to delete this log?</p>
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

        {/* Feed Log Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-500">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">Brands</th>
                <th className="px-4 py-2">Bags Bought</th>
                <th className="px-4 py-2">Bags Sold</th>
                <th className="px-4 py-2">Available Bags</th>
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
                feedLogs.map((record) => (
                  <tr key={record.id} className="border-b border-gray-400">
                    <td className="px-4 py-2">{record.feedBrandName || "N/A"}</td>
                    <td className="px-4 py-2">{record.bagsBought}</td>
                    <td className="px-4 py-2">{record.bagsSold}</td>
                    <td className="px-4 py-2">{record.availableBags}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => setDeleteId(record.id)}
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div
            className="bg-white shadow-md rounded-lg p-4 text-center cursor-pointer"
            onClick={() => navigate("/totalSales")}
          >
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-lg font-bold text-gray-800">₦{totalSales.toLocaleString()}</p>
          </div>
          <div
            className="bg-white shadow-md rounded-lg p-4 text-center cursor-pointer"
            onClick={() => navigate("/totalSales")}
          >
            <p className="text-sm text-gray-500">Current Sales Balance</p>
            <p className="text-lg font-bold text-gray-800">₦{currentSalesBalance.toLocaleString()}</p>
          </div>
          <div
            className="bg-white shadow-md rounded-lg p-4 text-center cursor-pointer"
            onClick={() => navigate("/totalSales")}
          >
            <p className="text-sm text-gray-500">Profit</p>
            <p className="text-lg font-bold text-gray-800">₦{totalProfit.toLocaleString()}</p>
          </div>
          <div
            className="bg-white shadow-md rounded-lg p-4 text-center cursor-pointer"
            onClick={() => navigate("/feedInventory")}
          >
            <p className="text-sm text-gray-500">Feed Inventory</p>
            <p className="text-lg font-bold text-gray-800">₦{(totalSales - totalProfit).toLocaleString()}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeedLogPage;
