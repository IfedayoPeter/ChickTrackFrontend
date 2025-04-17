import React from "react";
import { useNavigate } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";

const Footer = () => {
  const navigate = useNavigate();

  const pages = [
    { name: "Home", path: "/home" },
    { name: "Feed", path: "/feed" },
    { name: "Bird", path: "/bird" },
    { name: "Drug", path: "/drug" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer className="bg-gray-800 text-white py-6 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm">© 2023 ChickTrack. All rights reserved.</p>
          <p className="text-sm">123 Poultry Lane, Farmville, USA</p>
        </div>
        <div className="flex gap-4 mb-4 md:mb-0">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FiFacebook className="text-xl hover:text-blue-500" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FiTwitter className="text-xl hover:text-blue-400" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FiInstagram className="text-xl hover:text-pink-500" />
          </a>
        </div>
        <nav className="flex gap-4">
          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() => navigate(page.path)}
              className="text-sm hover:underline"
            >
              {page.name}
            </button>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
