import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../images/search.svg";
import clearIcon from "../images/clear.svg";
import { FiMenu } from "react-icons/fi";
import Bell from "../images/bell.svg";

export const LoadingAnimation = () => (
  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
  </div>
);

export const Notification = ({ notification }) => (
  <div
    className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded shadow-lg ${
      notification.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}
  >
    {notification.message}
  </div>
);

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const sidebarLinks = [
    { name: "Home", action: () => navigate("/home") },
    { name: "Feed" },
    { name: "Bird" },
    { name: "Drug" },
    { name: "Logout" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50">
      <div className="w-64 bg-gray-800 h-full text-white p-6">
        <button className="text-white text-2xl mb-6" onClick={onClose}>
          ✕
        </button>
        <ul className="space-y-4">
          {sidebarLinks.map((link, index) => (
            <li
              key={index}
              className="border-b border-gray-600 pb-2 cursor-pointer"
              onClick={link.action || (() => {})}
            >
              {link.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);

  const handleSearch = async () => {
    const queryString = searchTerm ? `search=${encodeURIComponent(searchTerm)}` : "";
    try {
      const found = await onSearch(queryString); // Wait for the search to complete
      
      // if (searchTerm && !found) {
      //   setNotification({
      //     type: "error",
      //     message: `No results found for "${searchTerm}"`,
      //   });
      //   setTimeout(() => setNotification(null), 3000);
      // }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Search failed. Please try again.",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <>
      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by BrandName"
          className="w-60 px-4 py-2 border border-blue-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16"
        />
        <button
          onClick={handleSearch}
          className="absolute top-1/2 right-10 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <img src={searchIcon} alt="Search" className="w-5 h-5" />
        </button>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <img src={clearIcon} alt="Clear" className="w-5 h-5" />
          </button>
        )}
      </div>

      {notification && <Notification notification={notification} />}
    </>
  );
};

export const RecordSalesButton = ({ onClick }) => {
  return (
    <button
      className="bg-white text-blue-800 border-2 border-blue-800 px-6 py-3 rounded-xl font-medium hover:bg-indigo-600 hover:text-white transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
      onClick={onClick}
    >
      Record sales <img src={require("../../images/records1.svg")} alt="Record Sales" className="inline-block ml-2 w-5 h-5" />
    </button>
  );
};

export const PageHeader = ({ title, onMenuClick }) => (
  <header className="bg-gray-800 shadow-sm lg:hidden">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        {/* Hamburger Menu */}
        <button className="text-gray-300" onClick={onMenuClick}>
          <FiMenu size={24} />
        </button>
        {/* Title */}
        <h1 className="text-xl font-bold text-white">{title}</h1>
      </div>
      {/* Notification Icon */}
      <button
        className="text-gray-300"
        onClick={() => alert("Notifications clicked!")} // Replace with actual notification logic
      >
        <img src={Bell} alt="Notification" className="w-6 h-6" />
      </button>
    </div>
  </header>
);

