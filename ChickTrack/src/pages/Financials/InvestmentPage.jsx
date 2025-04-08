import React, { useEffect, useState } from "react";
import { getAllUsers } from "../User/UserService";
import { LoadingAnimation, Notification } from "../../components/CommonComponents";
import { FiTrash2, FiPlus, FiCheck, FiX } from "react-icons/fi";

const API_INVESTMENT = "https://chicktrack.runasp.net/api/Investment";
const API_EXPENSES = "https://chicktrack.runasp.net/api/Expenses";

const InvestmentPage = () => {
  const [investments, setInvestments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [newInvestment, setNewInvestment] = useState(null);
  const [newExpense, setNewExpense] = useState(null);

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
      const data = await getAllUsers();
      setUsers(data.content || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddInvestment = () => {
    setNewInvestment({
      code: "",
      date: "",
      userId: "",
      description: "",
      amount: "",
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
    try {
      const response = await fetch(API_INVESTMENT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvestment),
      });

      if (response.ok) {
        setNotification({ type: "success", message: "Investment added successfully!" });
        setNewInvestment(null);
        fetchInvestments();
      } else {
        setNotification({ type: "error", message: "Failed to add investment. Please try again." });
      }
    } catch (error) {
      setNotification({ type: "error", message: "An error occurred. Please try again." });
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
        setNewExpense(null);
        fetchExpenses();
      } else {
        setNotification({ type: "error", message: "Failed to add expense. Please try again." });
      }
    } catch (error) {
      setNotification({ type: "error", message: "An error occurred. Please try again." });
    }
  };

  useEffect(() => {
    fetchInvestments();
    fetchExpenses();
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Investment</h1>
        </div>
      </header>

      <section className="container mx-auto px-4 py-6">
        {notification && <Notification notification={notification} />}

        {/* Investment Table */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Investment Table</h2>
            <button
              onClick={handleAddInvestment}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
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
                        <td className="px-4 py-2">{new Date(investment.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2">{investment.fullName}</td>
                        <td className="px-4 py-2">{investment.description}</td>
                        <td className="px-4 py-2">₦{investment.amount.toLocaleString()}</td>
                        <td className="px-4 py-2">
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(investment.id, "investment")}
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {newInvestment && (
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
                            value={newInvestment.userId}
                            onChange={(e) =>
                              setNewInvestment({ ...newInvestment, userId: e.target.value })
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
                        <td className="px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2">{expense.fullName}</td>
                        <td className="px-4 py-2">{expense.description}</td>
                        <td className="px-4 py-2">₦{expense.amount.toLocaleString()}</td>
                        <td className="px-4 py-2">
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(expense.id, "expense")}
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {newExpense && (
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
      </section>
    </div>
  );
};

export default InvestmentPage;