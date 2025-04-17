import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { LoadingAnimation, Notification } from "../../components/CommonComponents";
import { FiMenu, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const API_URL = "https://chicktrack.runasp.net/api/TotalSales"; 

export const calculateTotalProfit = (totalSales) => {
  return totalSales.reduce((total, record) => total + record.profit, 0);
};

const TotalSalesPage = () => {
  const [totalSales, setTotalSales] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchTotalSales = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTotalSales(data.content || []);
    } catch (error) {
      console.error("Error fetching total sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRow = async () => {
    setLoading(true);
    setNotification(null);
    try {
      const response = await fetch(`${API_URL}?id=${deleteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotification({ type: "success", message: "Total sales record deleted successfully!" });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setNotification({ type: "error", message: "Failed to delete total sales record. Please try again." });
      }
    } catch (error) {
      setNotification({ type: "error", message: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchTotalSales();
  }, []);

  const calculateTotalAmount = () => {
    return totalSales.reduce((total, record) => total + record.amount, 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-grow container mx-auto px-4 py-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">Total Sales</h2>

        {/* Notification */}
        {notification && <Notification notification={notification} />}

        {/* Delete Confirmation */}
        {deleteId && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="text-lg font-bold mb-4">Are you sure you want to delete this record?</p>
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

        {/* Total Sales Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-500">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">Brands</th>
                <th className="px-4 py-2">Bags Sold</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Profit</th>
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
                totalSales.map((record) => (
                  <tr key={record.id} className="border-b border-gray-400">
                    <td className="px-4 py-2">{record.feedBrandName || "N/A"}</td>
                    <td className="px-4 py-2">{record.bagsSold}</td>
                    <td className="px-4 py-2">₦{record.amount.toLocaleString()}</td>
                    <td className="px-4 py-2">₦{record.profit.toLocaleString()}</td>
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
            {!loading && (
              <tfoot>
                <tr className="bg-gray-200 font-bold border-t border-gray-400">
                  <td className="px-4 py-2">Total</td>
                  <td className="px-4 py-2"></td>
                  <td className="px-4 py-2">₦{calculateTotalAmount().toLocaleString()}</td>
                  <td className="px-4 py-2">₦{calculateTotalProfit(totalSales).toLocaleString()}</td>
                  <td className="px-4 py-2"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TotalSalesPage;
