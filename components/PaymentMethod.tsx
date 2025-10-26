import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  method: "Cash" | "Card";
  setMethod: (m: "Cash" | "Card") => void;
};

export default function PaymentMethod({ method, setMethod }: Props) {
  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() => setMethod("Cash")}
        style={[styles.option, method === "Cash" && styles.selectedCash]}
      >
        <Text style={styles.icon}>💵</Text>
        <Text style={styles.text}>Cash</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setMethod("Card")}
        style={[styles.option, method === "Card" && styles.selectedCard]}
      >
        <Text style={styles.icon}>💳</Text>
        <Text style={styles.text}>Card</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-around", marginTop: 20 },
  option: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: "#222",
    alignItems: "center",
  },
  selectedCash: { 
    backgroundColor: "#007bff" 
  },
  selectedCard: { 
    backgroundColor: "#007bff" 
  },
  icon: { 
    fontSize: 20, 
    color: "#fff" 
  },
  text: { 
    color: "#fff", 
    fontWeight: "700", 
    marginTop: 4 
  },
});
