import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

const TransactionItem = ({ transaction, onDelete }) => {
  const isIncome = transaction.type === "income";

  return (
    <View style={styles.transactionCard}>
      <View style={styles.transactionContent}>
        <View style={styles.categoryIconContainer}>
          <Ionicons
            name={
              transaction.category === "salary"
                ? "cash-outline"
                : transaction.category === "food"
                ? "fast-food-outline"
                : "card-outline"
            }
            size={24}
            color={isIncome ? COLORS.income : COLORS.expense}
          />
        </View>
        <View style={styles.transactionLeft}>
          <Text
            style={styles.transactionTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {transaction.title}
          </Text>
          <Text style={styles.transactionCategory}>{transaction.category}</Text>
        </View>
        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              { color: isIncome ? COLORS.income : COLORS.expense },
            ]}
          >
            {isIncome ? "+" : "-"}&#8377;
            {parseFloat(transaction.amount).toFixed(2)}
          </Text>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(transaction.id)}
      >
        <Ionicons name="trash-outline" size={24} color={COLORS.expense} />
      </TouchableOpacity>
    </View>
  );
};

export default TransactionItem;
