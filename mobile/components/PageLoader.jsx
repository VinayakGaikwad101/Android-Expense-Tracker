import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

const PageLoader = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
      ></ActivityIndicator>
    </View>
  );
};

export default PageLoader;
