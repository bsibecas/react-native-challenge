// components/CashForm.tsx
import React, { useState, useMemo } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";

type Props = {
  total: number;
  currencySymbol: string;
  onConfirm: (amountPaid: number) => void;
};

export default function CashForm({ total, currencySymbol, onConfirm }: Props) {
  const [amountInput, setAmountInput] = useState("");
  const amountPaid = useMemo(() => {
	const cleanInput = amountInput.replace(',', '.'); 
	const num = parseFloat(cleanInput);
    return isNaN(num) ? 0 : num;
  }, [amountInput]);
  const change = amountPaid - total;
  const isSufficient = amountPaid >= total && amountPaid > 0;
  const handleConfirm = () => {
    if (!isSufficient) {
      Alert.alert("Insufficient Amount", `You need to pay at least ${total.toFixed(2)}${currencySymbol}.`);
      return;
    }
    onConfirm(amountPaid); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cash Payment</Text>
      <View style={styles.inputRow}>
        <Text style={styles.label}>Amount Paid:</Text>
        <TextInput
          style={styles.input}
          placeholder={`E.g.: ${(total + 5).toFixed(2)}`} 
          keyboardType="numeric"
          value={amountInput}
          onChangeText={setAmountInput}
        />
      </View>
      <View style={styles.changeRow}>
        <Text style={styles.changeLabel}>
          {change >= 0 ? "CHANGE" : "MISSING"}
        </Text>
        <Text style={[styles.changeValue, change < 0 && styles.insufficient]}>
          {Math.abs(change).toFixed(2)} {currencySymbol}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.confirmButton, !isSufficient && { opacity: 0.5 }]}
        onPress={handleConfirm}
        disabled={!isSufficient}
      >
        <Text style={styles.confirmText}>Confirm Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginVertical: 10,
  },
  changeLabel: {
    fontWeight: '700',
    fontSize: 15,
    color: '#555',
  },
  changeValue: {
    fontWeight: '800',
    fontSize: 20,
    color: '#28a745',
  },
  insufficient: {
    color: '#dc3545',
  },
  confirmButton: {
    backgroundColor: "#28a745",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});