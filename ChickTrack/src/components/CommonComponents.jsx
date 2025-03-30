import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

export const Filter = ({ fields, onFilter }) => {
  const [filters, setFilters] = useState({});

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyFilter = () => {
    const queryString = Object.entries(filters)
      .filter(([_, value]) => value) // Exclude empty values
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
    onFilter(queryString);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">{field.label}</label>
          <input
            type="text"
            name={field.name}
            placeholder={field.placeholder || ""}
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
      <button
        onClick={handleApplyFilter}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Apply Filter
      </button>
    </div>
  );
};
