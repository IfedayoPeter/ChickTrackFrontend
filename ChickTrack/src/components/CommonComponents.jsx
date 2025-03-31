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
    const filterString = Object.entries(filters)
      .filter(([_, value]) => value) // Exclude empty values
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
    const queryString = filterString ? `filter=${filterString}` : "";
    onFilter(queryString);
  };

  return (
    <div className="flex flex-wrap sm:flex-nowrap gap-4 mb-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col w-32 sm:w-auto">
          <label className="text-sm font-medium text-gray-700">{field.label}</label>
          {field.type === "dropdown" ? (
            <select
              name={field.name}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select {field.label}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === "date" ? (
            <input
              type="date"
              name={field.name}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <input
              type="text"
              name={field.name}
              placeholder={field.placeholder || ""}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      ))}
      <div className="w-full sm:w-auto flex justify-center sm:justify-start">
        <button
          onClick={handleApplyFilter}
          className="h-15 mt-4 bg-blue-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600"
        >
          Apply Filter
        </button>
      </div>
    </div>
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
