import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { LoadingAnimation, Notification, PageHeader } from "../../components/CommonComponents";

const SetupPage = () => {
    const navigate = useNavigate();

    const menuItems = [
        { label: 'User Management', icon: '👤', onClick: () => navigate('/users') },
        { label: 'Poultry', icon: '🐔' },
        { label: 'Import', icon: '📥', onClick: () => navigate('/import') },
        { label: 'Export', icon: '📤' },
        { label: 'Settings', icon: '⚙️' },
    ];

    return (
        <>
            <Header />
            <div className="p-5 font-sans bg-gray-100 min-h-[calc(100vh-120px)]">
                <PageHeader title="Setup" />
                <ul className="list-none p-0 max-w-xl mx-auto mt-10">
                    {menuItems.map((item, index) => (
                        <li
                            key={index}
                            className="flex items-center p-4 mb-4 bg-white rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white"
                            onClick={item.onClick}
                        >
                            <span className="mr-4 text-2xl">{item.icon}</span>
                            <span className="text-lg font-medium">{item.label}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <Footer />
        </>
    );
};

export default SetupPage;
