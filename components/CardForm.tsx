import React, { useState, useMemo } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from "react-native";

type CardData = {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
};

type Props = {
  total: number;
  currency: string;
  onConfirm?: (data: CardData) => void;
};

export default function CardForm({ total, currency, onConfirm }: Props) {
  const [form, setForm] = useState<CardData>({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const handleChange = (field: keyof CardData, value: string) => {
    let formatted = value;
    if (field === "number") {
      const cleaned = value.replace(/\D/g, "").slice(0, 16);
      formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();
    } else if (field === "expiry") {
      formatted = value.replace(/\D/g, "").replace(/(\d{2})(\d{1,2})/, "$1/$2").slice(0, 5);
    } else if (field === "cvv") {
      formatted = value.replace(/\D/g, "").slice(0, 3);
    }
    setForm((prev) => ({ ...prev, [field]: formatted }));
  };

  const isValid = useMemo(() => {
    const { number, expiry, cvv, name } = form;
    const numDigits = number.replace(/\s/g, "").length === 16;
    const validExpiry = /^\d{2}\/\d{2}$/.test(expiry);
    const validCVV = /^\d{3,4}$/.test(cvv); 
    const validName = name.trim().length > 2;
    return numDigits && validExpiry && validCVV && validName;
  }, [form]);

  const handleConfirm = () => {
    if (!isValid) {
      Alert.alert("Datos inválidos", "Por favor, revisa la información de tu tarjeta.");
      return;
    }
    onConfirm?.(form);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Card Payment</Text>

      <TextInput
        style={styles.input}
        placeholder="Card number"
        keyboardType="numeric"
        value={form.number}
        onChangeText={(text) => handleChange("number", text)}
        maxLength={19} 
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.half]}
          placeholder="MM/YY"
          keyboardType="numeric"
          value={form.expiry}
          onChangeText={(text) => handleChange("expiry", text)}
          maxLength={5} 
        />
        <TextInput
          style={[styles.input, styles.half]}
          placeholder="CVV"
          keyboardType="numeric"
          value={form.cvv}
          onChangeText={(text) => handleChange("cvv", text)}
          maxLength={3} 
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Cardholder name"
        autoCapitalize="words"
        value={form.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      <TouchableOpacity
        style={[styles.confirmButton, !isValid && { opacity: 0.5 }]}
        onPress={handleConfirm}
        disabled={!isValid}
      >
        <Text style={styles.confirmText}>Confirm payment</Text>
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
    marginBottom: 40, 
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
  input: {
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  half: {
    flex: 1,
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