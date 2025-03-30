import React, { useState } from "react";

const API_URL = "http://chicktrack.runasp.net/api/SaleRecord";

const SalesRecordPage = () => {
  const [formData, setFormData] = useState({
    code: "",
    salesType: "1", // Default to Feed
    quantity: "",
    price: "",
    date: "",
    buyerName: "",
    description: "",
    feedBrand: "",
    feedSalesUnitId: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newSale = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      salesType: parseInt(formData.salesType),
      feedBrand: formData.feedBrand ? parseInt(formData.feedBrand) : null,
      feedSalesUnitId: formData.feedSalesUnitId ? parseInt(formData.feedSalesUnitId) : null,
      date: new Date(formData.date).toISOString().split("T")[0], // Convert to YYYY-MM-DD
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSale),
      });

      if (response.ok) {
        alert("Sale record added successfully!");
        setFormData({
          salesType: "1",
          quantity: "",
          price: "",
          date: "",
          buyerName: "",
          description: "",
          feedBrand: "",
          feedSalesUnitId: "",
        });
      } else {
        alert("Failed to add sale record.");
      }
    } catch (error) {
      console.error("Error adding sale record:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Record Sales</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Buyer Name */}
          <div>
            <label className="block text-sm font-semibold">Buyer Name</label>
            <input type="text" name="buyerName" value={formData.buyerName} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>

          {/* Sales Type */}
          <div>
            <label className="block text-sm font-semibold">Sales Type</label>
            <select name="salesType" value={formData.salesType} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="1">Feed</option>
              <option value="2">Eggs</option>
              <option value="3">Drugs</option>
              <option value="4">Chicks</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold">Quantity</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold">Price</label>
            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>

          {/* Feed Brand (If applicable) */}
          {formData.salesType === "1" && (
            <div>
              <label className="block text-sm font-semibold">Feed Brand</label>
              <select name="feedBrand" value={formData.feedBrand} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="">Select Feed Brand</option>
                <option value="1">TopFeed Starter</option>
                <option value="2">TopFeed Grower</option>
                <option value="3">TopFeed Finisher</option>
                <option value="4">TopFeed Layer</option>
                <option value="5">NewHope Starter</option>
                <option value="6">NewHope Grower</option>
                <option value="7">NewHope Finisher</option>
                <option value="8">NewHope Layer</option>
              </select>
            </div>
          )}

          {/* Feed Sales Unit (If applicable) */}
          {formData.salesType === "1" && (
            <div>
              <label className="block text-sm font-semibold">Feed Sales Unit</label>
              <select name="feedSalesUnitId" value={formData.feedSalesUnitId} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="">Select Sales Unit</option>
                <option value="1">Bag</option>
                <option value="2">Paint</option>
                <option value="3">Half Paint</option>
                <option value="4">Derica</option>
                <option value="5">Half Derica</option>
                <option value="6">Cup</option>
              </select>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold">Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Add Sale</button>
        </form>
      </div>
    </div>
  );
};

export default SalesRecordPage;
