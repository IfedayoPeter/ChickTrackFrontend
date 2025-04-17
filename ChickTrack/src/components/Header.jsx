import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import Bird from "../images/bird.svg";
import Egg from "../images/egg.svg";
import Investment from "../images/investment.svg";
import Feed from "../images/feed.svg";
import Bell from "../images/bell.svg";
import Home from "../images/home.svg";
import Profile from "../images/profile.svg";

const Header = () => {
  const navigate = useNavigate();
  const [feedAccordionOpen, setFeedAccordionOpen] = useState(false);
  const [profileAccordionOpen, setProfileAccordionOpen] = useState(false);

  const sidebarLinks = [
    { 
      name: "Home", 
      icon: <img src={Home} alt="Home" className="w-6 h-6" />, 
      action: () => navigate("/admin/home") 
    },
    {
      name: "Feed",
      icon: <img src={Feed} alt="Feed" className="w-6 h-6 lg:mr-4" />,
      isAccordion: true,
      subLinks: [
        { name: "Feed Inventory", action: () => navigate("/feedInventory") },
        { name: "Feed Log", action: () => navigate("/feedLog") },
        { name: "Sales Record", action: () => navigate("/feedSalesRecord") },
        { name: "Total Sales", action: () => navigate("/totalSales") },
      ],
    },
    { 
      name: "Bird", 
      icon: <img src={Bird} alt="Bird" className="w-6 h-6" />, 
      action: () => navigate("/bird") 
    },
    { 
      name: "Egg", 
      icon: <img src={Egg} alt="Egg" className="w-6 h-6" />, 
      action: () => navigate("/egg") 
    },
    { 
      name: "Investment", 
      icon: <img src={Investment} alt="Investment" className="w-6 h-6" />, 
      action: () => navigate("/investment") 
    },
    { 
      name: "Notifications", 
      icon: <img src={Bell} alt="Notification" className="w-6 h-6" />, 
      action: () => navigate("/notification") 
    },
  ];

  const profileLinks = [
    { name: "Profile", action: () => navigate("/profile") },
    { name: "Investors", action: () => navigate("/investors") },
    { name: "Setup", action: () => navigate("/setup") },
    { name: "Logout", action: () => navigate("/logout") },
  ];

  return (
    <header className="bg-gray-800 shadow-sm py-4 px-6 flex flex-col">
      <div className="flex justify-between items-center">
        {/* ChickTrack Branding on the left */}
        <div className="hidden sm:block text-white font-bold text-xl cursor-pointer" onClick={() => navigate("/")}>
  ChickTrack
</div>


        {/* Main Navigation */}
        <nav className="flex justify-center items-center gap-6">
          {sidebarLinks.map((link, index) => (
            <div key={index} className="relative">
              {link.isAccordion ? (
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setFeedAccordionOpen(!feedAccordionOpen)}
                    className="flex flex-col items-center text-white hover:text-gray-400"
                  >
                    <div className="text-2xl md:text-base">{link.icon}</div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs md:block hidden">{link.name}</span>
                      {feedAccordionOpen ? (
                        <FiChevronUp className="text-xs" />
                      ) : (
                        <FiChevronDown className="text-xs" />
                      )}
                    </div>
                  </button>
                  {feedAccordionOpen && (
                    <div className="absolute top-full left-0 bg-gray-600 text-white rounded shadow-lg mt-5 ml-6 w-48 z-10">
                      {link.subLinks.map((subLink, subIndex) => (
                        <button
                          key={subIndex}
                          onClick={subLink.action}
                          className="block px-4 py-2 text-sm hover:bg-gray-500 w-full text-left"
                        >
                          {subLink.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={link.action}
                  className="flex flex-col items-center text-white hover:text-gray-400"
                >
                  <div className="text-2xl md:text-base">{link.icon}</div>
                  <span className="text-xs md:block hidden">{link.name}</span>
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Profile Accordion on the right */}
        <div className="relative">
          <button
            onClick={() => setProfileAccordionOpen(!profileAccordionOpen)}
            className="flex flex-col items-center text-white hover:text-gray-400"
          >
            <div className="text-2xl md:text-base">
              <img src={Profile} alt="Profile" className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs md:block hidden">Profile</span>
              {profileAccordionOpen ? (
                <FiChevronUp className="text-xs" />
              ) : (
                <FiChevronDown className="text-xs" />
              )}
            </div>
          </button>
          {profileAccordionOpen && (
            <div className="absolute top-full right-0 bg-gray-600 text-white rounded shadow-lg mt-2 w-48 z-10">
              {profileLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={link.action}
                  className="block px-4 py-2 text-sm hover:bg-gray-500 w-full text-left"
                >
                  {link.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;