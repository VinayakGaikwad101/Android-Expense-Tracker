import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import { useTransactions } from "../../hooks/useTransactions";
import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import PageLoader from "../../components/PageLoader";
import { styles } from "../../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { BalanceCard } from "../../components/BalanceCard";
import TransactionItem from "../../components/TransactionItem";
import { COLORS } from "../../constants/colors";
import Loader from "../../components/PageLoader";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { transactions, summary, isLoading, loadData, deleteTransaction } =
    useTransactions(user.id);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="receipt-outline"
        size={64}
        color={COLORS.textLight}
        style={styles.emptyStateIcon}
      />
      <Text style={styles.emptyStateTitle}>No Transactions Yet</Text>
      <Text style={styles.emptyStateText}>
        Start tracking your expenses by adding your first transaction
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => router.push("/create")}
      >
        <Ionicons name="add" size={20} color={COLORS.white} />
        <Text style={styles.emptyStateButtonText}>Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) return <Loader />;

  console.log("Transactions: ", transactions);
  console.log("Summary: ", summary);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome, </Text>
              <Text
                style={styles.usernameText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add-circle" size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>
        <BalanceCard summary={summary} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>

      <Text style={styles.refreshHintText}>
        Pull down to refresh transactions
      </Text>

      {/* render long lists in rn */}
      {/* lazy loads only those on the screen */}
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TransactionItem transaction={item} onDelete={deleteTransaction} />
        )}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.textLight]}
            tintColor={COLORS.textLight}
            progressViewOffset={20}
            progressBackgroundColor={COLORS.background}
            size="large"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
