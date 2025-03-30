import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMenu } from "react-icons/fi";
import { FaEgg, FaKiwiBird, FaPills, FaSeedling } from "react-icons/fa";
import { Sidebar } from "../../components/CommonComponents";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { name: "Bird", icon: <FaKiwiBird className="text-4xl text-blue-600" /> },
    { name: "Eggs", icon: <FaEgg className="text-4xl text-blue-600" /> },
    { name: "Drug", icon: <FaPills className="text-4xl text-blue-600" /> },
    { name: "Feed", icon: <FaSeedling className="text-4xl text-blue-600" /> },
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
            {/* Logo */}
            <h1 className="text-xl font-bold text-blue-800">ChickTrack</h1>
          </div>

          {/* Login */}
          <button
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-100"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          {/* Search Bar */}
          <div className="relative mb-6">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to ChickTrack!</h2>
          <p className="text-sm text-gray-600 mb-6">
            Eggs, Birds & Feeds - We've got you all covered
          </p>

          {/* Category Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center"
              >
                <div className="mb-2">{category.icon}</div>
                <h3 className="font-medium text-gray-800">{category.name}</h3>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <div className="mb-6">
            <p className="text-gray-500 italic mb-1">From farm to table</p>
            <p className="font-medium text-gray-700">Quality you can count on</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700"
              onClick={() => navigate("/recordsales")}
            >
              Record sales <span className="ml-2">📋</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;