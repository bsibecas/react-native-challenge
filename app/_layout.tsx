// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "Products" }} />
      <Stack.Screen name="payment/index" options={{ title: "Payment" }} />
    </Stack>
  );
}
