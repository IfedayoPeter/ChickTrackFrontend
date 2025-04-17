import React, { useEffect, useState } from "react";
import { getAllUsers } from "../User/UserService";
import { LoadingAnimation, Notification } from "../../components/CommonComponents";
import { FiTrash2, FiPlus, FiCheck, FiX } from "react-icons/fi";
import AdminSidebar from "../../components/AdminSidebar";
import edit from "../../images/edit.svg";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const API_INVESTMENT = "https://chicktrack.runasp.net/api/Investment";
const API_EXPENSES = "https://chicktrack.runasp.net/api/Expenses";

const InvestmentPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [investments, setInvestments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [newInvestment, setNewInvestment] = useState(null);
  const [newExpense, setNewExpense] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_INVESTMENT}?page=1&pageSize=100`);
      const data = await response.json();
      setInvestments(data.content || []);
    } catch (error) {
      console.error("Error fetching investments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_EXPENSES}?page=1&pageSize=100`);
      const data = await response.json();
      setExpenses(data.content || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.content?.data || []); // Access the nested `data` array
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]); // Fallback to an empty array on error
    }
  };

  const handleAddInvestment = () => {
    setNewInvestment({
      code: "",
      date: "",
      investorId: "",
      description: "",
      amount: "",
      receiptImageUrl: ""
    });
  };

  const handleAddExpense = () => {
    setNewExpense({
      code: "",
      date: "",
      investorId: "",
      description: "",
      amount: "",
    });
  };

  const handleSaveInvestment = async () => {
    const method = newInvestment.id ? "PUT" : "POST";
    const url = newInvestment.id
      ? `${API_INVESTMENT}?id=${newInvestment.id}`
      : API_INVESTMENT;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvestment),
      });

      if (response.ok) {
        setNotification({
          type: "success",
          message: newInvestment.id
            ? "Investment updated successfully!"
            : "Investment added successfully!",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setNotification({
          type: "error",
          message: newInvestment.id
            ? "Failed to update investment. Please try again."
            : "Failed to add investment. Please try again.",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "An error occurred. Please try again.",
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const handleSaveExpense = async () => {
    try {
      const response = await fetch(API_EXPENSES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      });

      if (response.ok) {
        setNotification({ type: "success", message: "Expense added successfully!" });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setNotification({ type: "error", message: "Failed to add expense. Please try again." });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setNotification({ type: "error", message: "An error occurred. Please try again." });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const handleSaveEditedExpense = async () => {
    const method = newExpense.id ? "PUT" : "POST";
    const url = newExpense.id
      ? `${API_EXPENSES}?id=${newExpense.id}`
      : API_EXPENSES;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      });

      if (response.ok) {
        setNotification({
          type: "success",
          message: newExpense.id
            ? "Expense updated successfully!"
            : "Expense added successfully!",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setNotification({
          type: "error",
          message: newExpense.id
            ? "Failed to update expense. Please try again."
            : "Failed to add expense. Please try again.",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "An error occurred. Please try again.",
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const handleDelete = async () => {
    const API_URL = deleteType === "investment" ? API_INVESTMENT : API_EXPENSES;

    setLoading(true);
    setNotification(null);

    try {
      const response = await fetch(`${API_URL}?id=${deleteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotification({ type: "success", message: `${deleteType.charAt(0).toUpperCase() + deleteType.slice(1)} deleted successfully!` });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        if (deleteType === "investment") {
          fetchInvestments();
        } else {
          fetchExpenses();
        }
      } else {
        setNotification({ type: "error", message: `Failed to delete ${deleteType}. Please try again.` });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
      setNotification({ type: "error", message: "An error occurred. Please try again." });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } finally {
      setLoading(false);
      setDeleteId(null);
      setDeleteType(null);
    }
  };

  const handleEditInvestment = (investment) => {
    setEditingId(investment.id);
    setNewInvestment({
      code: investment.code,
      date: investment.date,
      investorId: investment.investorId,
      description: investment.description,
      amount: investment.amount,
      receiptImageUrl: investment.receiptImageUrl,
      id: investment.id,
    });
  };

  const handleEditExpense = (expense) => {
    setEditingExpenseId(expense.id);
    setNewExpense({
      code: expense.code,
      date: expense.date,
      investorId: expense.investorId,
      description: expense.description,
      amount: expense.amount,
      id: expense.id,
    });
  };

  useEffect(() => {
    fetchInvestments();
    fetchExpenses();
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-grow container mx-auto px-4 py-6">
        {notification && <Notification notification={notification} />}

        {/* Investment Table */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Investment Table</h2>
            <button
              onClick={handleAddInvestment}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
              disabled={!!editingId} // Disable add button when editing
            >
              <FiPlus /> Add
            </button>
          </div>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-500">
              <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Investor</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <LoadingAnimation />
                    </td>
                  </tr>
                ) : (
                  <>
                    {investments.map((investment) => (
                      <tr key={investment.id} className="border-b border-gray-400">
                        {editingId === investment.id ? (
                          <>
                            <td className="px-4 py-2">
                              <input
                                type="date"
                                value={newInvestment.date}
                                onChange={(e) =>
                                  setNewInvestment({ ...newInvestment, date: e.target.value })
                                }
                                className="border border-gray-300 rounded-md px-2 py-1"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <select
                                value={newInvestment.investorId}
                                onChange={(e) =>
                                  setNewInvestment({ ...newInvestment, investorId: e.target.value })
                                }
                                className="border border-gray-300 rounded-md px-2 py-1"
                              >
                                <option value="">Select Investor</option>
                                {users.map((user) => (
                                  <option key={user.id} value={user.id}>
                                    {user.fullName}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={newInvestment.description}
                                onChange={(e) =>
                                  setNewInvestment({ ...newInvestment, description: e.target.value })
                                }
                                placeholder="Description"
                                className="border border-gray-300 rounded-md px-2 py-1"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={newInvestment.amount}
                                onChange={(e) =>
                                  setNewInvestment({ ...newInvestment, amount: e.target.value })
                                }
                                placeholder="Amount"
                                className="border border-gray-300 rounded-md px-2 py-1"
                              />
                            </td>
                            <td className="px-4 py-2 flex gap-2">
                              <button
                                onClick={handleSaveInvestment}
                                className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700"
                              >
                                <FiCheck />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setNewInvestment(null);
                                }}
                                className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
                              >
                                <FiX />
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-2">{new Date(investment.date).toLocaleDateString()}</td>
                            <td className="px-4 py-2">{investment.fullName}</td>
                            <td className="px-4 py-2">{investment.description}</td>
                            <td className="px-4 py-2">₦{investment.amount.toLocaleString()}</td>
                            <td className="px-4 py-2 flex gap-2">
                              <button
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleEditInvestment(investment)}
                                disabled={!!editingId} // Disable edit button when already editing
                              >
                                <img src={edit} alt="Edit" className="w-5 h-5" />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() => {
                                  setDeleteId(investment.id);
                                  setDeleteType("investment");
                                }}
                                disabled={!!editingId} // Disable delete button when editing
                              >
                                <FiTrash2 size={20} />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                    {/* Only show new row if not currently editing */}
                    {newInvestment && !editingId && (
                      <tr className="border-b border-gray-400">
                        <td className="px-4 py-2">
                          <input
                            type="date"
                            value={newInvestment.date}
                            onChange={(e) =>
                              setNewInvestment({ ...newInvestment, date: e.target.value })
                            }
                            className="border border-gray-300 rounded-md px-2 py-1"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <select
                            value={newInvestment.investorId}
                            onChange={(e) =>
                              setNewInvestment({ ...newInvestment, investorId: e.target.value })
                            }
                            className="border border-gray-300 rounded-md px-2 py-1"
                          >
                            <option value="">Select Investor</option>
                            {users.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.fullName}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={newInvestment.description}
                            onChange={(e) =>
                              setNewInvestment({ ...newInvestment, description: e.target.value })
                            }
                            placeholder="Description"
                            className="border border-gray-300 rounded-md px-2 py-1"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={newInvestment.amount}
                            onChange={(e) =>
                              setNewInvestment({ ...newInvestment, amount: e.target.value })
                            }
                            placeholder="Amount"
                            className="border border-gray-300 rounded-md px-2 py-1"
                          />
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                          <button
                            onClick={handleSaveInvestment}
                            className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700"
                          >
                            <FiCheck />
                          </button>
                          <button
                            onClick={() => setNewInvestment(null)}
                            className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
                          >
                            <FiX />
                          </button>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses Table */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Expenses Table</h2>
            <button
              onClick={handleAddExpense}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
              disabled={!!editingExpenseId} // Disable add button when editing
            >
              <FiPlus /> Add
            </button>
          </div>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-500">
              <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Investor</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <LoadingAnimation />
                    </td>
                  </tr>
                ) : (
                  <>
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="border-b border-gray-400">
                        {editingExpenseId === expense.id ? (
                          <>
                            <td className="px-4 py-2">
                              <input
                                type="date"
                                value={newExpense.date}
                                onChange={(e) =>
                                  setNewExpense({ ...newExpense, date: e.target.value })
                                }
                                className="border border-gray-300 rounded-md px-2 py-1"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <select
                                value={newExpense.investorId}
                                onChange={(e) =>
                                  setNewExpense({ ...newExpense, investorId: e.target.value })
                                }
                                className="border border-gray-300 rounded-md px-2 py-1"
                              >
                                <option value="">Select Investor</option>
                                {users.map((user) => (
                                  <option key={user.id} value={user.id}>
                                    {user.fullName}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={newExpense.description}
                                onChange={(e) =>
                                  setNewExpense({ ...newExpense, description: e.target.value })
                                }
                                placeholder="Description"
                                className="border border-gray-300 rounded-md px-2 py-1"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={newExpense.amount}
                                onChange={(e) =>
                                  setNewExpense({ ...newExpense, amount: e.target.value })
                                }
                                placeholder="Amount"
                                className="border border-gray-300 rounded-md px-2 py-1"
                              />
                            </td>
                            <td className="px-4 py-2 flex gap-2">
                              <button
                                onClick={handleSaveEditedExpense}
                                className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700"
                              >
                                <FiCheck />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingExpenseId(null);
                                  setNewExpense(null);
                                }}
                                className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
                              >
                                <FiX />
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                            <td className="px-4 py-2">{expense.fullName}</td>
                            <td className="px-4 py-2">{expense.description}</td>
                            <td className="px-4 py-2">₦{expense.amount.toLocaleString()}</td>
                            <td className="px-4 py-2 flex gap-2">
                              <button
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleEditExpense(expense)}
                                disabled={!!editingExpenseId} // Disable edit button when already editing
                              >
                                <img src={edit} alt="Edit" className="w-5 h-5" />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() => {
                                  setDeleteId(expense.id);
                                  setDeleteType("expense");
                                }}
                                disabled={!!editingExpenseId} // Disable delete button when editing
                              >
                                <FiTrash2 size={20} />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                    {/* Only show new row if not currently editing */}
                    {newExpense && !editingExpenseId && (
                      <tr className="border-b border-gray-400">
                        <td className="px-4 py-2">
                          <input
                            type="date"
                            value={newExpense.date}
                            onChange={(e) =>
                              setNewExpense({ ...newExpense, date: e.target.value })
                            }
                            className="border border-gray-300 rounded-md px-2 py-1"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <select
                            value={newExpense.investorId}
                            onChange={(e) =>
                              setNewExpense({ ...newExpense, investorId: e.target.value })
                            }
                            className="border border-gray-300 rounded-md px-2 py-1"
                          >
                            <option value="">Select Investor</option>
                            {users.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.fullName}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={newExpense.description}
                            onChange={(e) =>
                              setNewExpense({ ...newExpense, description: e.target.value })
                            }
                            placeholder="Description"
                            className="border border-gray-300 rounded-md px-2 py-1"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={newExpense.amount}
                            onChange={(e) =>
                              setNewExpense({ ...newExpense, amount: e.target.value })
                            }
                            placeholder="Amount"
                            className="border border-gray-300 rounded-md px-2 py-1"
                          />
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                          <button
                            onClick={handleSaveExpense}
                            className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700"
                          >
                            <FiCheck />
                          </button>
                          <button
                            onClick={() => setNewExpense(null)}
                            className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
                          >
                            <FiX />
                          </button>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-bold mb-4">Are you sure you want to delete this record?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700"
                onClick={handleDelete}
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
    </div>
  );
};

export default InvestmentPage;