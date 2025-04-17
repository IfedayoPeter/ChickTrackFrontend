import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ExamplePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-6">
        <h1 className="text-2xl font-bold">Welcome to ChickTrack</h1>
        {/* Page content goes here */}
      </main>
      <Footer />
    </div>
  );
};

export default ExamplePage;
