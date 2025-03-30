import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RecordSalePage from "./pages/Feed/RecordSalePage";
import LoginPage from "./pages/User/LoginPage";
import HomePage from "./pages/User/HomePage";
import SalesRecordPage from "./pages/Feed/SalesRecordPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/recordsales" element={<RecordSalePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/feedSalesRecord" element={<SalesRecordPage />} />
      </Routes>
    </Router>
  );
};

export default App;