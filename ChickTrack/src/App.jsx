import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RecordSalePage from "./pages/Feed/RecordSalePage";
import LoginPage from "./pages/User/LoginPage";
import HomePage from "./pages/User/HomePage";
import SalesRecordPage from "./pages/Feed/SalesRecordPage";
import FeedInventoryPage from "./pages/Feed/FeedInventoryPage";
import TotalSalesPage from "./pages/Feed/TotalSalesPage";
import FeedLogPage from "./pages/Feed/FeedLogPage";
import AdminHomePage from "./pages/Admin/AdminHomePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/recordsales" element={<RecordSalePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/feedSalesRecord" element={<SalesRecordPage />} />
        <Route path="/feedInventory" element={<FeedInventoryPage />} />
        <Route path="/totalSales" element={<TotalSalesPage />} />
        <Route path="/feedLog" element={<FeedLogPage />} />
        <Route path="/admin/home" element={<AdminHomePage />} />
      </Routes>
    </Router>
  );
};

export default App;