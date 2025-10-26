// components/FilterPill.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
  value: string;
  categories: string[];
  onChange: (c: string) => void;
};

export default function Filter({ value, categories, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const label = value === "All" ? "All Products" : value;
  const allOptions = ["All", ...categories];

  return (
    <View style={styles.wrap}>
      {/* Pill */}
      <Pressable onPress={() => setOpen(!open)} style={styles.pill}>
        <Text style={styles.pillText}>Filter: {label} ▾</Text>
      </Pressable>

      {/* Dropdown */}
      {open && (
        <>
          {/* Overlay to close when tapping outside */}
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />

          <View style={styles.dropdown}>
            {allOptions.map((item) => (
              <Pressable
                key={item} // ✅ unique key
                onPress={() => {
                  onChange(item);
                  setOpen(false);
                }}
                style={({ pressed }) => [
                  styles.option,
                  pressed && { backgroundColor: "#f2f2f2" },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    item === value && styles.optionSelected,
                  ]}
                >
                  {item === "All" ? "All Products" : item}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: "flex-start", marginBottom: 10 },
  pill: {
    backgroundColor: "#e6e6e6",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pillText: { fontWeight: "600", color: "#333" },
  dropdown: {
    position: "absolute",
    top: 44,
    left: 0,
    minWidth: 200,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    zIndex: 999,
  },
  option: { paddingVertical: 10, paddingHorizontal: 14 },
  optionText: { fontSize: 15, color: "#333" },
  optionSelected: { fontWeight: "700" },
});
