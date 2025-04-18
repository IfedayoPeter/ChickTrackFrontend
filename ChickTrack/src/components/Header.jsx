import React, { useState, useEffect, useRef } from "react";
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
  const feedRef = useRef(null);
  const profileRef = useRef(null);

  const sidebarLinks = [
    { 
      name: "Home", 
      icon: <img src={Home} alt="Home" className="w-6 h-6" />, 
      action: () => navigate("/admin/home") 
    },
    {
      name: "Feed",
      icon: <img src={Feed} alt="Feed" className="w-6 h-6 lg:mr-4 md:mr-4" />,
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

  // Close accordions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (feedRef.current && !feedRef.current.contains(event.target)) {
        setFeedAccordionOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileAccordionOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close the other accordion when one opens
  useEffect(() => {
    if (feedAccordionOpen) {
      setProfileAccordionOpen(false);
    }
  }, [feedAccordionOpen]);

  useEffect(() => {
    if (profileAccordionOpen) {
      setFeedAccordionOpen(false);
    }
  }, [profileAccordionOpen]);

  return (
    <header className="bg-gray-800 shadow-sm py-4 px-6 flex flex-col fixed bottom-0 w-full lg:sticky lg:top-0 z-50">
      <div className="flex justify-between items-center">
        {/* ChickTrack Branding - hidden on small/medium screens */}
        <div className="hidden lg:block text-white font-bold text-xl cursor-pointer" onClick={() => navigate("/")}>
          ChickTrack
        </div>

        {/* Main Navigation */}
        <nav className="flex justify-center items-center gap-4 sm:gap-6 w-full lg:w-auto">
          {sidebarLinks.map((link, index) => (
            <div key={index} className="relative" ref={link.isAccordion ? feedRef : null}>
              {link.isAccordion ? (
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setFeedAccordionOpen(!feedAccordionOpen)}
                    className="flex flex-col items-center text-white hover:text-gray-400"
                  >
                    <div className="text-2xl md:text-base">{link.icon}</div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs hidden sm:block">{link.name}</span>
                      {feedAccordionOpen ? (
                        <FiChevronUp className="text-xs" />
                      ) : (
                        <FiChevronDown className="text-xs" />
                      )}
                    </div>
                  </button>
                  {feedAccordionOpen && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-5 bg-gray-600 text-white rounded shadow-lg w-32 z-10 lg:top-full lg:bottom-auto lg:mt-5 lg:ml-6">
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
                  <span className="text-xs hidden sm:block">{link.name}</span>
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Profile Accordion - positioned differently on small/medium vs large screens */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileAccordionOpen(!profileAccordionOpen)}
            className="flex flex-col items-center text-white hover:text-gray-400"
          >
            <div className="text-2xl md:text-base">
              <img src={Profile} alt="Profile" className="w-6 h-6 lg:mr-4" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs hidden sm:block">Profile</span>
              {profileAccordionOpen ? (
                <FiChevronUp className="text-xs" />
              ) : (
                <FiChevronDown className="text-xs" />
              )}
            </div>
          </button>
          {profileAccordionOpen && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-28 mb-5 bg-gray-600 text-white rounded shadow-lg w-32 z-10 lg:top-full lg:bottom-auto lg:right-0 lg:left-auto lg:transform-none lg:ml-10 lg:mt-5">
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