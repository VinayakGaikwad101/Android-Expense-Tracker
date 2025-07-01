import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useTransactions } from "../hooks/useTransactions";
import { useUser } from "@clerk/clerk-expo";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const categories = [
  { label: "Salary", value: "salary" },
  { label: "Food", value: "food" },
  { label: "Card", value: "card" },
];

const types = [
  { label: "Income", value: "income" },
  { label: "Expense", value: "expense" },
];

export default function CreateTransaction() {
  const router = useRouter();
  const { user } = useUser();
  const { addTransaction } = useTransactions(user?.id);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0].value);
  const [type, setType] = useState(types[0].value);

  const handleSubmit = () => {
    if (!title || !amount) {
      Alert.alert("Validation Error", "Please enter title and amount.");
      return;
    }
    if (!user?.id) {
      Alert.alert("User Error", "User not found. Please sign in again.");
      return;
    }
    let parsedAmount = Math.abs(parseFloat(amount));
    if (type === "expense") parsedAmount = -parsedAmount;
    const newTransaction = {
      title,
      amount: parsedAmount,
      category,
    };
    addTransaction(newTransaction);
    router.back();
  };

  const handleAmountChange = (text) => {
    // Only allow digits and decimal point
    const numericText = text.replace(/[^0-9.]/g, "");
    setAmount(numericText);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add New Transaction</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        value={amount}
        onChangeText={handleAmountChange}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter category (or pick below)"
        value={category}
        onChangeText={setCategory}
      />
      <View style={styles.optionsContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.value}
            style={[
              styles.optionButton,
              category === cat.value && styles.optionButtonSelected,
            ]}
            onPress={() => setCategory(cat.value)}
          >
            <Text
              style={[
                styles.optionText,
                category === cat.value && styles.optionTextSelected,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Type</Text>
      <View style={styles.optionsContainer}>
        {types.map((t) => (
          <TouchableOpacity
            key={t.value}
            style={[
              styles.optionButton,
              type === t.value && styles.optionButtonSelected,
            ]}
            onPress={() => setType(t.value)}
          >
            <Text
              style={[
                styles.optionText,
                type === t.value && styles.optionTextSelected,
              ]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
        <Text style={styles.submitButtonText}>Add Transaction</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Ionicons name="close-circle-outline" size={24} color={COLORS.expense} />
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: COLORS.textDark,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.textDark,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    color: COLORS.textDark,
  },
  optionsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    marginRight: 10,
  },
  optionButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.textDark,
    fontSize: 16,
  },
  optionTextSelected: {
    color: "#fff",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 6,
    justifyContent: "center",
    marginBottom: 12,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 8,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: COLORS.expense,
    fontSize: 18,
    marginLeft: 8,
  },
});
