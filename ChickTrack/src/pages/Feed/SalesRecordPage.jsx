import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { LoadingAnimation, Notification, Filter } from "../../components/CommonComponents"; // Added Filter import
import { FiMenu, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { FEED_BRANDS, FEED_UNITS } from "../../constants";
import recordsIcon from "../../images/records.svg";

const API_URL = "https://chicktrack.runasp.net/api/SaleRecord"; // Updated to HTTPS

const SalesRecordPage = () => {
  const [salesRecords, setSalesRecords] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchSalesRecords = async (queryString = "") => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}${queryString ? `?${queryString}` : ""}`);
      const data = await response.json();
      setSalesRecords(data.content || []);
    } catch (error) {
      console.error("Error fetching sales records:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRow = async () => {
    setLoading(true);
    setNotification(null);
    try {
      const response = await fetch(`https://chicktrack.runasp.net/api/SaleRecord?id=${deleteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotification({ type: "success", message: "Sales record deleted successfully!" });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setNotification({ type: "error", message: "Failed to delete sales record. Please try again." });
      }
    } catch (error) {
      setNotification({ type: "error", message: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchSalesRecords();
  }, []);

  const calculateTotalAmount = () => {
    return salesRecords.reduce((total, record) => total + record.price * record.quantity, 0);
  };

  const filterFields = [
    { name: "feedBrandName", label: "Brand", type: "dropdown", options: FEED_BRANDS },
    { name: "unit", label: "Unit", type: "dropdown", options: FEED_UNITS },
    { name: "buyerName", label: "Buyer", placeholder: "Enter buyer name" },
    { name: "date", label: "Date", type: "date" },
  ];

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
            <h1 className="text-xl font-bold text-gray-800">Sales Record</h1>
          </div>
        </div>
      </header>

      {/* Sales Record Section */}
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">Sales Record</h2>

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

        {/* Filter Component */}
        <Filter fields={filterFields} onFilter={fetchSalesRecords} />

        {/* Sales Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-500">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">Brands</th>
                <th className="px-4 py-2">Unit</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Buyer</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-2 text-center" colSpan="7">
                    <LoadingAnimation />
                  </td>
                </tr>
              ) : (
                salesRecords.map((record) => (
                  <tr key={record.id} className="border-b border-gray-400">
                    <td className="px-4 py-2">{record.feedBrandName || "N/A"}</td>
                    <td className="px-4 py-2">{record.feedSalesUnit?.unitName || "N/A"}</td>
                    <td className="px-4 py-2">{record.quantity}</td>
                    <td className="px-4 py-2">{record.price.toLocaleString()}</td>
                    <td className="px-4 py-2">{record.buyerName}</td>
                    <td className="px-4 py-2">{record.date}</td>
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
                  <td className="px-4 py-2" colSpan="4">Total</td>
                  <td className="px-4 py-2" colSpan="3">
                    ₦{calculateTotalAmount().toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Record Sales Button */}
        {!loading && (
          <div className="flex justify-center mt-6">
            <button
              className="bg-blue-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600"
              onClick={() => window.location.href = "/recordsales"}
            >
              Record sales <img src={recordsIcon} alt="Record Sales" className="inline-block ml-2 w-5 h-5" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default SalesRecordPage;
