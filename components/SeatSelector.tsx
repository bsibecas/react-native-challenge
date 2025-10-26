import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';

type Props = { seat: string; setSeat: (s: string) => void };

const splitSeat = (seat: string) => {
  const match = seat.match(/^([A-Z])(\d+)$/i);
  if (match) {
    return { row: match[1].toUpperCase(), number: match[2] };
  }
  return { row: "", number: "" };
};

export default function SeatSelector({ seat, setSeat }: Props) {
  const [open, setOpen] = useState(false);
  const { row: initialRow, number: initialNumber } = splitSeat(seat);  
  const [tempRow, setTempRow] = useState(initialRow);
  const [tempNumber, setTempNumber] = useState(initialNumber);

  const isValid = useMemo(() => {
    const validRow = /^[A-Z]$/.test(tempRow.trim().toUpperCase());
    const validNumber = /^\d{1,2}$/.test(tempNumber.trim()) && parseInt(tempNumber.trim()) > 0;
    return validRow && validNumber;
  }, [tempRow, tempNumber]);

  const handleConfirm = () => {
    if (!isValid) {
      Alert.alert("Invalid Seat", "Please enter a valid seat format (e.g., A5). Row must be a letter and Seat Number must be a number.");
      return;
    }

    const finalSeat = `${tempRow.toUpperCase()}${tempNumber}`;
    setSeat(finalSeat);
    setOpen(false);
  };
  
  React.useEffect(() => {
    const { row, number } = splitSeat(seat);
    setTempRow(row);
    setTempNumber(number);
  }, [seat]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>SEAT</Text>      
      <TouchableOpacity onPress={() => setOpen(!open)} style={styles.seatBox}>
        <FontAwesome5 name="plane" size={14} color="#007bff" style={{ marginRight: 8 }} />
        <Text style={styles.seatText}>{seat || "Select seat"}</Text>
        <FontAwesome5 name={open ? "chevron-up" : "chevron-down"} size={10} color="#555" style={{ marginLeft: 10 }} />
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdown}>
          <Text style={styles.dropdownLabel}>Row (A-Z) | Seat No. (1-99)</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={tempRow}
              onChangeText={(text) => setTempRow(text.toUpperCase().slice(0, 1))}
              placeholder="A"
              style={[styles.input, styles.rowInput]}
              maxLength={1}
              autoCapitalize="characters"
            />
            <TextInput
              value={tempNumber}
              onChangeText={(text) => setTempNumber(text.replace(/\D/g, '').slice(0, 2))}
              placeholder="1"
              style={[styles.input, styles.numberInput]}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
          <TouchableOpacity
            style={[styles.confirm, !isValid && styles.disabledConfirm]}
            onPress={handleConfirm}
            disabled={!isValid}
          >
            <Text style={styles.confirmText}>
              {isValid ? `Confirm ${tempRow.toUpperCase()}${tempNumber}` : "Invalid Seat"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10, alignItems: "flex-start" },
  label: { fontWeight: "600", color: "#555", marginBottom: 4 },
  seatBox: {
    backgroundColor: "#eee",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  seatText: { 
    fontWeight: "600", 
    color: "#222" 
  },  
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    width: 200,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 4,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  rowInput: {
    flex: 1,
    marginRight: 8,
    maxWidth: 50,
  },
  numberInput: {
    flex: 2,
  },
  confirm: {
    backgroundColor: "#007bff",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  disabledConfirm: {
    backgroundColor: '#ccc',
  },
  confirmText: { 
    color: "#fff", 
    fontWeight: "700" 
  },
});