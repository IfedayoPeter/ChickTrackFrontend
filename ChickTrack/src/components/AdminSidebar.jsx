import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const AdminSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [feedAccordionOpen, setFeedAccordionOpen] = useState(false);

  const sidebarLinks = [
    { name: "Home", action: () => navigate("/admin/home") },
    {
      name: "Feed",
      isAccordion: true,
      subLinks: [
        { name: "Feed Inventory", action: () => navigate("/feedInventory") },
        { name: "Feed Log", action: () => navigate("/feedLog") },
        { name: "Sales Record", action: () => navigate("/feedSalesRecord") },
        { name: "Total Sales", action: () => navigate("/totalSales") },
      ],
    },
    { name: "Bird", action: () => navigate("/bird") },
    { name: "Egg", action: () => navigate("/egg") },
    { name: "Investment", action: () => navigate("/investment") },
    { name: "Payment Method", action: () => navigate("/payment-method") },
    { name: "Logout", action: () => navigate("/logout") },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 h-full text-white p-6 shadow-lg">
        <button className="text-white text-2xl mb-6" onClick={onClose}>
          ✕
        </button>
        <ul className="space-y-4">
          {sidebarLinks.map((link, index) => (
            <li key={index}>
              {link.isAccordion ? (
                <div>
                  <div
                    className="flex justify-between items-center cursor-pointer border-b border-gray-600 pb-2"
                    onClick={() => setFeedAccordionOpen(!feedAccordionOpen)}
                  >
                    <span>{link.name}</span>
                    {feedAccordionOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                  {feedAccordionOpen && (
                    <ul className="mt-2 space-y-2 pl-4">
                      {link.subLinks.map((subLink, subIndex) => (
                        <li
                          key={subIndex}
                          className="cursor-pointer text-sm border-b border-gray-600 pb-2"
                          onClick={subLink.action}
                        >
                          {subLink.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div
                  className="border-b border-gray-600 pb-2 cursor-pointer"
                  onClick={link.action}
                >
                  {link.name}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay */}
      <div
        className="flex-1 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
    </div>
  );
};

export default AdminSidebar;
