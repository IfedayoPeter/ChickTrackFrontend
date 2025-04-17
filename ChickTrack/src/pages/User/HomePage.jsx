import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMenu } from "react-icons/fi";
import { FaEgg, FaKiwiBird, FaPills, FaSeedling } from "react-icons/fa";
import { Sidebar } from "../../components/CommonComponents";
import Footer from "../../components/Footer";
import recordsIcon from "../../images/records1.svg";

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
    <div className="min-h-screen flex flex-col bg-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <header className="bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu */}
            <button className="text-gray-500" onClick={() => setSidebarOpen(true)}>
              <FiMenu size={24} />
            </button>
            {/* Logo */}
            <h1 className="text-xl font-bold text-white">ChickTrack</h1>
          </div>

          {/* Login */}
          <button
            className="px-4 py-2 border border-white text-white rounded-md hover:bg-indigo-600 hover:text-white hover:bg-indigo-500"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
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
                  className="bg-indigo-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center"
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
                className="bg-white text-blue-800 border-2 border-indigo-500 px-6 py-3 rounded-xl font-medium
                 hover:bg-indigo-600 hover:text-white transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 "
                onClick={() => navigate("/recordsales")}
              >
                Record sales <img src={recordsIcon} alt="Record Sales" className="inline-block ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;