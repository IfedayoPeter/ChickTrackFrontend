import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { LoadingAnimation, Notification, Search, PageHeader } from "../../components/CommonComponents"; 
import { FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { FEED_BRANDS, FEED_UNITS } from "../../constants";
import recordsIcon from "../../images/records.svg";
import { sortByDate } from "../../utils/sortUtils";
import ascendingIcon from "../../images/sort-ascending.svg";
import descendingIcon from "../../images/sort-descending.svg";
import editIcon from "../../images/edit.svg";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FilterComponent from "../../components/FilterComponent";

const API_URL = "https://chicktrack.runasp.net/api/SaleRecord"; 

const SalesRecordPage = () => {
  const [allSalesRecords, setAllSalesRecords] = useState([]);
  const [displayedRecords, setDisplayedRecords] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [newSalesRecord, setNewSalesRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const recordsPerPage = 20;
  const apiPageSize = 20000;

  const totalPages = Math.ceil(allSalesRecords.length / recordsPerPage);

  const fetchSalesRecords = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?page=${page}&pageSize=${apiPageSize}`);
      const data = await response.json();
      
      if (data.content && data.content.length > 0) {
        // Use Set to ensure unique records by ID
        setAllSalesRecords(prev => {
          const newRecords = data.content.filter(
            newRecord => !prev.some(existingRecord => existingRecord.id === newRecord.id)
          );
          return [...prev, ...newRecords];
        });
        
        if (data.content.length < apiPageSize) {
          setHasMoreData(false);
        }
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error("Error fetching sales records:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSalesRecords(1); // Start with page 1
  }, []);

  // Load more data when needed
  useEffect(() => {
    if (hasMoreData && 
        currentPage * recordsPerPage > allSalesRecords.length && 
        allSalesRecords.length % apiPageSize === 0) {
      const nextApiPage = Math.floor(allSalesRecords.length / apiPageSize) + 1;
      fetchSalesRecords(nextApiPage);
    }
  }, [currentPage, allSalesRecords.length, hasMoreData]);

  // Update displayed records
  useEffect(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    setDisplayedRecords(allSalesRecords.slice(startIndex, endIndex));
  }, [currentPage, allSalesRecords]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filterColumns = [
    { title: 'Brands', dataIndex: 'feedBrandName', key: 'feedBrandName' },
    { title: 'Unit', dataIndex: 'feedSalesUnit.unitName', key: 'unit' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Buyer', dataIndex: 'buyerName', key: 'buyerName' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  const handleDeleteRow = async () => {
    setLoading(true);
    setNotification(null);
    try {
      const response = await fetch(`${API_URL}?id=${deleteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotification({ type: "success", message: "Sales record deleted successfully!" });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setNotification({ type: "error", message: "Failed to delete sales record. Please try again." });
      }
    } catch (error) {
      setNotification({ type: "error", message: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  const handleEditSalesRecord = (record) => {
    setEditingRecordId(record.id);
    setNewSalesRecord({
      code: record.code,
      salesType: record.salesType,
      quantity: record.quantity,
      price: record.price,
      date: record.date,
      buyerName: record.buyerName,
      description: record.description,
      feedBrand: record.feedBrand,
      feedSalesUnitId: record.feedSalesUnit?.id,
      id: record.id,
    });
  };

  const handleSaveSalesRecord = async () => {
    const updatedSalesRecord = {
      ...newSalesRecord,
      feedBrand: parseInt(newSalesRecord.feedBrand, 10),
      feedSalesUnitId: parseInt(newSalesRecord.feedSalesUnitId, 10),
    };

    if (updatedSalesRecord.quantity < 0 || updatedSalesRecord.price < 0) {
      setNotification({
        type: "error",
        message: "Quantity and price cannot be negative.",
      });
      return;
    }

    const method = updatedSalesRecord.id ? "PUT" : "POST";
    const url = updatedSalesRecord.id ? `${API_URL}?id=${updatedSalesRecord.id}` : API_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSalesRecord),
      });

      if (response.ok) {
        setNotification({
          type: "success",
          message: updatedSalesRecord.id
            ? "Sales record updated successfully!"
            : "Sales record added successfully!",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setNotification({
          type: "error",
          message: updatedSalesRecord.id
            ? "Failed to update sales record. Please try again."
            : "Failed to add sales record. Please try again.",
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "An error occurred. Please try again.",
      });
    }
  };

  const calculateTotalAmount = () => {
    return allSalesRecords.reduce((total, record) => total + record.price, 0);
  };

  const handleSort = (order) => {
    const sortedRecords = sortByDate([...allSalesRecords], order);
    setAllSalesRecords(sortedRecords);
  };

  const handleSortButton = (order) => {
    const sortedRecords = sortByDate([...allSalesRecords], order);
    setAllSalesRecords(sortedRecords);
    setDisplayedRecords(sortedRecords.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage));
  };

  // Ensure sorting is applied on initial load
  useEffect(() => {
    handleSort("desc");
  }, [allSalesRecords]);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          } hover:bg-gray-300`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto lg:px-4 lg:py-6">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <PageHeader title="Sales Record" onMenuClick={() => setSidebarOpen(true)} />

        <FilterComponent 
          columns={filterColumns} 
          onFilter={fetchSalesRecords} 
          initialData={allSalesRecords}
        />

        <section className="container mx-auto px-4 py-6">
          {notification && <Notification notification={notification} />}

          {deleteId && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <p className="text-lg font-bold mb-4">Are you sure you want to delete this record?</p>
                <div className="flex justify-center gap-4">
                  <button
                    className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700"
                    onClick={handleDeleteRow}
                  >
                    <FiCheck size={20} />
                  </button>
                  <button
                    className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700"
                    onClick={() => setDeleteId(null)}
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <Search onSearch={fetchSalesRecords} />
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => handleSortButton("asc")}
                className="flex items-center gap-2 bg- text-gray-800 px-4 py-2 rounded-l-md hover:bg-gray-300"
              >
                <img src={ascendingIcon} alt="Ascending" className="w-6 h-6" />
              </button>
              <button
                onClick={() => handleSortButton("desc")}
                className="flex items-center gap-2 bg-transparent text-gray-800 px-4 py-2 rounded-r-md hover:bg-gray-300"
              >
                <img src={descendingIcon} alt="Descending" className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-500">
              <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Brands</th>
                  <th className="px-4 py-2">Unit</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Buyer</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-2 text-center">
                      <LoadingAnimation />
                    </td>
                  </tr>
                ) : (
                  displayedRecords.map((record) => (
                    <tr key={record.id} className="border-b border-gray-400">
                      {editingRecordId === record.id ? (
                        <>
                          <td className="px-4 py-2">
                            <select
                              value={newSalesRecord.feedBrand}
                              onChange={(e) =>
                                setNewSalesRecord({ ...newSalesRecord, feedBrand: e.target.value })
                              }
                              className="border border-gray-300 rounded-md px-2 py-1"
                            >
                              <option value="" disabled hidden>Select Brand</option>
                              {FEED_BRANDS.map((brand) => (
                                <option key={brand.value} value={brand.value}>
                                  {brand.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <select
                              value={newSalesRecord.feedSalesUnitId}
                              onChange={(e) =>
                                setNewSalesRecord({ ...newSalesRecord, feedSalesUnitId: e.target.value })
                              }
                              className="border border-gray-300 rounded-md px-2 py-1"
                            >
                              <option value="" disabled hidden>Select unit</option>
                              {FEED_UNITS.map((unit) => (
                                <option key={unit.value} value={unit.value}>
                                  {unit.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={newSalesRecord.quantity}
                              onChange={(e) => {
                                const value = Math.max(0, e.target.value); // Prevent negative values
                                setNewSalesRecord({ ...newSalesRecord, quantity: value });
                              }}
                              className="border border-gray-300 rounded-md px-2 py-1"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              value={newSalesRecord.price}
                              onChange={(e) => {
                                const value = Math.max(0, e.target.value); // Prevent negative values
                                setNewSalesRecord({ ...newSalesRecord, price: value });
                              }}
                              className="border border-gray-300 rounded-md px-2 py-1"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={newSalesRecord.buyerName}
                              onChange={(e) =>
                                setNewSalesRecord({ ...newSalesRecord, buyerName: e.target.value })
                              }
                              className="border border-gray-300 rounded-md px-2 py-1"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="date"
                              value={newSalesRecord.date}
                              onChange={(e) =>
                                setNewSalesRecord({ ...newSalesRecord, date: e.target.value })
                              }
                              className="border border-gray-300 rounded-md px-2 py-1"
                            />
                          </td>
                          <td className="px-4 py-2 flex gap-2">
                            <button
                              onClick={handleSaveSalesRecord}
                              className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700"
                            >
                              <FiCheck />
                            </button>
                            <button
                              onClick={() => {
                                setEditingRecordId(null);
                                setNewSalesRecord(null);
                              }}
                              className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
                            >
                              <FiX />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2">{record.feedBrandName || "N/A"}</td>
                          <td className="px-4 py-2">{record.feedSalesUnit?.unitName || "N/A"}</td>
                          <td className="px-4 py-2">{record.quantity}</td>
                          <td className="px-4 py-2">{record.price.toLocaleString()}</td>
                          <td className="px-4 py-2">{record.buyerName}</td>
                          <td className="px-4 py-2">{record.date}</td>
                          <td className="px-4 py-2 flex gap-2">
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => handleEditSalesRecord(record)}
                            >
                              <img src={editIcon} alt="Edit" className="w-5 h-5" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => setDeleteId(record.id)}
                            >
                              <FiTrash2 size={20} />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
              {!loading && (
                <tfoot>
                  <tr className="bg-gray-200 font-bold border-t border-gray-400">
                    <td className="px-4 py-2" colSpan="3">Total</td>
                    <td className="px-4 py-2 text-left">₦{calculateTotalAmount().toLocaleString()}</td>
                    <td className="px-4 py-2" colSpan="3"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                &lt;
              </button>
              {renderPageNumbers()}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
            <div className="text-gray-700">
              Results: {(currentPage - 1) * recordsPerPage + 1} -{" "}
              {Math.min(currentPage * recordsPerPage, allSalesRecords.length)} of {allSalesRecords.length}
            </div>
          </div>

          {!loading && (
            <div className="flex justify-center mt-6">
              <button
                className="bg-blue-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600"
                onClick={() => window.location.href = "/recordsales"}
              >
                Record sales <img src={recordsIcon} alt="Record Sales" className="inline-block ml-2 w-5 h-5" />
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SalesRecordPage;