import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Product } from "../services/api";
import { Currency } from "../services/currency";

type Props = {
  item: Product;
  quantity: number;
  currency: Currency;
  onRemove: () => void;
};

const SYMBOL: Record<Currency, string> = { USD: "$", EUR: "€", GBP: "£" };

export default function CartItem({ item, quantity, currency, onRemove }: Props) {
  const price = item.price * quantity;
  const symbol = SYMBOL[currency];
  const renderRightActions = () => (
    <TouchableOpacity onPress={onRemove} style={styles.deleteBox}>
      <Text style={styles.deleteText}>Remove</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.container}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>
            {price.toFixed(2)} {symbol}
          </Text>
        </View>
        <Text style={styles.qty}>{quantity}</Text>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
    elevation: 1,
  },
  image: { 
    width: 48, 
    height: 48, 
    borderRadius: 8, 
    marginRight: 12 
  },
  name: { 
    fontWeight: "600", 
    fontSize: 15 
  },
  price: { 
    color: "#666", 
    marginTop: 2 
  },
  qty: { 
    fontWeight: "700",
    fontSize: 16, 
    paddingHorizontal: 8 
  },
  deleteBox: {
    backgroundColor: "#ff4d4f",
    justifyContent: "center",
    alignItems: "flex-end",
    borderRadius: 12,
    paddingHorizontal: 20,
    marginVertical: 6,
  },
  deleteText: { 
    color: "#fff", 
    fontWeight: "700" 
  },
});
