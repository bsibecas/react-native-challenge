import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { convertCurrency, Currency, Rates } from "../services/currency";

type Props = {
  total: number;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  customerType: string;
  setCustomerType: (c: string) => void;
  rates: Rates;
};

export default function BottomBar({
  total,
  currency,
  setCurrency,
  customerType,
  setCustomerType,
  rates,
}: Props) {
  const [openType, setOpenType] = useState(false);
  const [openCurrency, setOpenCurrency] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.payButton}>
          <Text style={styles.payText}>
            PAY {total.toFixed(2)} {currency}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.typeButton}
          onPress={() => setOpenType((prev) => !prev)}
        >
          <Text style={styles.typeText}>{customerType} ▼</Text>
        </TouchableOpacity>
      </View>
      {openType && (
        <View style={styles.dropdown}>
          {[
            "Retail",
            "Crew",
            "Happy hour",
            "Business invitation",
            "Tourist invitation",
          ].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => {
                setCustomerType(t);
                setOpenType(false);
              }}
              style={[
                styles.option,
                t === customerType && { backgroundColor: "#eee" },
              ]}
            >
              <Text>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={styles.currencyRow}>
        <Text style={styles.conversions}>
          {convertCurrency(total, currency, "USD", rates).toFixed(2)} $ |{" "}
          {convertCurrency(total, currency, "EUR", rates).toFixed(2)} € |{" "}
          {convertCurrency(total, currency, "GBP", rates).toFixed(2)} £
        </Text>
          <TouchableOpacity
          onPress={() => setOpenCurrency((prev) => !prev)}
          style={styles.currencyButton}
        >
          <Text style={styles.currencyText}>{currency} ▼</Text>
        </TouchableOpacity>
      </View>
      {openCurrency && (
        <View style={styles.dropdown}>
          {["USD", "EUR", "GBP"].map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => {
                setCurrency(c as Currency);
                setOpenCurrency(false);
              }}
              style={[
                styles.option,
                c === currency && { backgroundColor: "#eee" },
              ]}
            >
              <Text>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  payButton: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    flex: 1,
    alignItems: "center",
  },
  typeButton: {
    backgroundColor: "#444",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  payText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  typeText: {
    color: "white",
    fontWeight: "600",
  },
  currencyRow: {
    flexDirection: "row",
    marginVertical: 20,
    alignItems: "center",
    marginTop: 6,
  },
  conversions: {
    color: "#333",
    fontSize: 13,
    textAlign: "center",
    marginHorizontal: 10,
    marginTop: 4,
  },
  currencyButton: {
    marginTop: 4,
  },
  currencyText: {
    color: "#007bff",
    fontWeight: "600",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 6,
    paddingVertical: 4,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
});
