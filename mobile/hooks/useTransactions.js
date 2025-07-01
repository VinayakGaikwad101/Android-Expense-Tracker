import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import env from "../config/env";

const API_URL = env.API_URL;

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Log user ID and API URL for debugging
  console.log("User ID:", userId);
  console.log("API URL:", API_URL);

  // changes only if one of its input has changed, basically memoization
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);

      const data = await response.json();

      if (response.ok && data.success && data.transactions) {
        // Server returned transactions successfully
        setTransactions(data.transactions);
        console.log(`Fetched ${data.transactions.length} transactions for user`);
      } else if (response.status === 404) {
        // No transactions found - this is normal, not an error
        setTransactions([]);
        console.log("No transactions found for user - showing empty state");
      } else {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSummary({
          balance: data.balance,
          income: data.income,
          expenses: data.expenses,
        });
        console.log(`Summary fetched for user:`, data);
      } else {
        throw new Error(data.message || "Failed to fetch summary");
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);

    try {
      // run these functions in parallel
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (taskId) => {
    try {
      const id = parseInt(taskId);
      if (isNaN(id) || id <= 0) throw new Error("Invalid transaction ID");
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete transaction");
      }
      loadData();
      Alert.alert("Success", "Transaction deleted successfully!");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Error", error.message);
    }
  };

  const addTransaction = async (transaction) => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...transaction, user_id: userId }),
      });

      if (!response.ok) throw new Error("Failed to add transaction");

      Alert.alert("Success", "Transaction added successfully!");

      // Refresh transactions list after adding
      await loadData();
    } catch (error) {
      console.error("Error adding transaction:", error);
      Alert.alert("Error", error.message);
    }
  };

  return { transactions, summary, isLoading, deleteTransaction, loadData, addTransaction };
};
