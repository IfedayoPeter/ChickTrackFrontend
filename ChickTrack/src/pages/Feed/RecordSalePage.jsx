import React, { useState } from "react";
import { SALES_TYPES, FEED_BRANDS, FEED_UNITS } from "../../constants";
import { LoadingAnimation, Notification } from "../../components/CommonComponents";

const API_URL = "https://chicktrack.runasp.net/api/SaleRecord"; // Updated to HTTPS

const RecordSalePage = () => {
  const [formData, setFormData] = useState({
    salesType: "1", // Default to Feed
    feedBrand: "",
    feedSalesUnitId: "",
    quantity: "",
    price: "",
    date: "",
    buyerName: "",
    description: "",
  });

  const [notification, setNotification] = useState(null); // State for notification
  const [loading, setLoading] = useState(false); // State for loading animation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading animation

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
        setNotification({ type: "success", message: "Sale record added successfully!" });
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
        setNotification({ type: "error", message: "Failed to add sale record." });
      }
    } catch (error) {
      console.error("Error adding sale record:", error);
      setNotification({ type: "error", message: "An error occurred while saving the record." });
    } finally {
      setLoading(false); // Stop loading animation
    }

    // Clear the notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="h-screen w-screen bg-gray-100">
      <div className="bg-white h-full w-full p-6">
        {/* Loading Animation */}
        {loading && <LoadingAnimation />}

        {/* Notification */}
        {!loading && notification && <Notification notification={notification} />}

        {/* Form */}
        {!loading && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sales Type and Date */}
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-normal mb-2">Sales Type</label>
                <select name="salesType" value={formData.salesType} onChange={handleChange} className="w-full text-sm border-2 border-gray-300 p-2 rounded-xl">
                  {SALES_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-normal mb-2">Enter Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full text-sm border-2 border-gray-300 p-2 rounded-xl" required />
              </div>
            </div>

            {/* Feed Brand and Unit (If applicable) */}
            {formData.salesType === "1" && (
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-normal mb-2">Brand</label>
                  <select name="feedBrand" value={formData.feedBrand} onChange={handleChange} className="w-full text-sm border-2 border-gray-300 p-2 rounded-xl">
                    <option value="" disabled hidden>Select Brand</option>
                    {FEED_BRANDS.map((brand) => (
                      <option key={brand.value} value={brand.value}>
                        {brand.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-normal mb-2">Unit</label>
                  <select name="feedSalesUnitId" value={formData.feedSalesUnitId} onChange={handleChange} className="w-full text-sm border-2 border-gray-300 p-2 rounded-xl">
                    <option value="" disabled hidden>Select unit</option>
                    {FEED_UNITS.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Quantity and Buyer Name */}
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-normal mb-2">Quantity</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full text-sm border-2 border-gray-300 p-2 rounded-xl" required />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-normal mb-2">Buyer</label>
                <input type="text" name="buyerName" value={formData.buyerName} onChange={handleChange} className="w-full text-sm border-2 border-gray-300 p-2 rounded-xl" required />
              </div>
            </div>

            {/* Price and Description */}
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-normal mb-2">Price</label>
                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full text-sm border-2 border-gray-300 p-2 rounded-xl" required />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-normal mb-2">Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full text-sm border-2 border-gray-300 p-2 rounded-xl" />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center">
              <button type="submit" className="w-20 bg-blue-700 text-white py-2 rounded-xl hover:bg-blue-600">Save</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RecordSalePage;
