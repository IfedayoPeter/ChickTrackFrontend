import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SalesRecordPage from "./pages/SalesRecordPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/sales" />} />
        <Route path="/sales" element={<SalesRecordPage />} />
      </Routes>
    </Router>
  );
};

export default App;