import React, { useEffect, useState } from "react";
import { Sidebar, LoadingAnimation, Filter } from "../../components/CommonComponents";
import { FiMenu } from "react-icons/fi";

const API_URL = "http://chicktrack.runasp.net/api/SaleRecord";

const SalesRecordPage = () => {
  const [salesRecords, setSalesRecords] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSalesRecords = async (queryString = "") => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?${queryString}`);
      const data = await response.json();
      setSalesRecords(data.content || []);
    } catch (error) {
      console.error("Error fetching sales records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesRecords();
  }, []);

  const calculateTotalAmount = () => {
    return salesRecords.reduce((total, record) => total + record.price * record.quantity, 0);
  };

  const filterFields = [
    { name: "brand", label: "Brand", placeholder: "Enter brand name" },
    { name: "unit", label: "Unit", placeholder: "Enter unit name" },
    { name: "quantity", label: "Quantity", placeholder: "Enter quantity" },
    { name: "amount", label: "Amount", placeholder: "Enter amount" },
    { name: "buyer", label: "Buyer", placeholder: "Enter buyer name" },
    { name: "date", label: "Date", placeholder: "Enter date (YYYY-MM-DD)" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu */}
            <button className="text-gray-500" onClick={() => setSidebarOpen(true)}>
              <FiMenu size={24} />
            </button>
            {/* Title */}
            <h1 className="text-xl font-bold text-gray-800">Total Sales</h1>
          </div>
        </div>
      </header>

      {/* Sales Record Section */}
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Sales Record</h2>

        {/* Filter Component */}
        <Filter fields={filterFields} onFilter={fetchSalesRecords} />

        {/* Loading Animation */}
        {loading && <LoadingAnimation />}

        {/* Sales Table */}
        {!loading && (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-500">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Brands</th>
                  <th className="px-4 py-2">Unit</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Buyer</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {salesRecords.map((record) => (
                  <tr key={record.id} className="border-b">
                    <td className="px-4 py-2">{record.feedBrandName || "N/A"}</td>
                    <td className="px-4 py-2">{record.feedSalesUnit?.unitName || "N/A"}</td>
                    <td className="px-4 py-2">{record.quantity}</td>
                    <td className="px-4 py-2">{record.price.toLocaleString()}</td>
                    <td className="px-4 py-2">{record.buyerName}</td>
                    <td className="px-4 py-2">{record.date}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td className="px-4 py-2" colSpan="3">Total</td>
                  <td className="px-4 py-2" colSpan="3">
                    ₦{calculateTotalAmount().toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Record Sales Button */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700"
            onClick={() => window.location.href = "/recordsales"}
          >
            Record sales <span className="ml-2">📋</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default SalesRecordPage;
