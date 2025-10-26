import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function PaymentScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  title: { fontSize: 22, fontWeight: "700" },
});
