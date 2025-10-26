// app/_layout.tsx
import { Stack } from "expo-router";
import { CartProvider } from "../context/CartContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <CartProvider>
        <Stack screenOptions={{ headerShown: true }}>
          <Stack.Screen name="index" options={{ title: "Products" }} />
          <Stack.Screen name="payment/index" options={{ title: "Payment" }} />
        </Stack>
      </CartProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});