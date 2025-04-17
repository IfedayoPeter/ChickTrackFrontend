import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FiMenu, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaKiwiBird, FaEgg, FaMoneyBillWave, FaSeedling } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { calculateTotalProfit } from "../Feed/TotalSalesPage"; // Import calculateTotalProfit

const AdminHomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [feedAccordionOpen, setFeedAccordionOpen] = useState(false);
  const [feedSalesProfit, setFeedSalesProfit] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedSalesProfit = async () => {
      try {
        const response = await fetch("https://chicktrack.runasp.net/api/TotalSales");
        const data = await response.json();
        setFeedSalesProfit(calculateTotalProfit(data.content || [])); // Use calculateTotalProfit
      } catch (error) {
        console.error("Error fetching feed sales profit:", error);
      }
    };

    fetchFeedSalesProfit();
  }, []);

  const overviewCards = [
    { icon: <FaKiwiBird className="text-2xl text-blue-600" />, label: "Available birds", value: "200" },
    { icon: <FaEgg className="text-2xl text-blue-600" />, label: "Available eggs", value: "200" },
    { icon: <FaMoneyBillWave className="text-2xl text-blue-600" />, label: "Total Investment", value: "#200,000,000" },
    { icon: <FaSeedling className="text-2xl text-blue-600" />, label: "Feed sales profit", value: `₦${feedSalesProfit.toLocaleString()}` }, // Updated to use feedSalesProfit
  ];

  const feedPages = [
    { name: "Feed Inventory", action: () => navigate("/feedInventory") },
    { name: "Feed Log", action: () => navigate("/feedLog") },
    { name: "Sales Record", action: () => navigate("/feedSalesRecord") },
    { name: "Total Sales", action: () => navigate("/totalSales") },
  ];

  const navigationButtons = [
    "Birds",
    "Investments",
    "Eggs",
    "Feed",
    "Sales Record",
    "Investment",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <header className="block lg:hidden bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu */}
            <button className="text-gray-500" onClick={() => setSidebarOpen(true)}>
              <FiMenu size={24} />
            </button>
            {/* Title */}
            <h1 className="text-xl font-bold text-gray-800">Home</h1>
          </div>
          {/* Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>Monthly</span>
              <FiChevronDown />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-md">
                <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Weekly
                </button>
                <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Monthly
                </button>
                <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Yearly
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Overview Section */}
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {overviewCards.map((card, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4 text-center">
              <div className="mb-2">{card.icon}</div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-lg font-bold text-blue-600">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Feed Accordion */}
        <div className="bg-gray-200 rounded-md mb-4">
          <div
            className="flex justify-between items-center px-4 py-3 cursor-pointer"
            onClick={() => setFeedAccordionOpen(!feedAccordionOpen)}
          >
            <span className="text-gray-800 font-medium">Feed</span>
            {feedAccordionOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {feedAccordionOpen && (
            <ul className="space-y-2 px-4 pb-4">
              {feedPages.map((page, index) => (
                <li
                  key={index}
                  className="cursor-pointer text-gray-700 hover:text-gray-900"
                  onClick={page.action}
                >
                  {page.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          {navigationButtons.map((button, index) => (
            <button
              key={index}
              className="w-full bg-gray-200 text-gray-800 px-4 py-3 rounded-md text-left hover:bg-gray-300"
            >
              {button}
            </button>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminHomePage;
