import React from "react";
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from "react-native";
import { Product } from "../services/api";
import { Currency } from "../services/currency";

type Props = {
  product: Product;
  quantity: number;
  currency: Currency;
  onAdd: () => void;
  onRemove: () => void;
};

const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export default function ProductCard({ product, quantity, currency, onAdd, onRemove }: Props) {
  const symbol = CURRENCY_SYMBOL[currency];
  
  const isOutOfStock = product.stock <= quantity;
  
  const handleAdd = isOutOfStock ? () => {} : onAdd;
  
  return (
    <View style={styles.card}>
      <ImageBackground
        source={{ uri: product.image }}
        style={styles.image}
        imageStyle={styles.imageBorder}
      >
        <View style={styles.scrim} />
        <View style={styles.topInfo}>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.units}>{quantity} units</Text>
        </View>
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            onPress={handleAdd} 
            style={[
              styles.btn, 
              styles.plus, 
              isOutOfStock && styles.btnDisabled 
            ]}
            disabled={isOutOfStock}
          >
            <Text style={styles.btnText}>＋</Text>
          </TouchableOpacity>
          
          {quantity > 0 && (
            <TouchableOpacity onPress={onRemove} style={[styles.btn, styles.minus]}>
              <Text style={styles.btnText}>−</Text>
            </TouchableOpacity>
          )}
          <View style={[styles.pricePill, isOutOfStock && styles.noStockPill]}>
            {isOutOfStock ? (
              <Text style={styles.noStockText}>
                No stock
              </Text>
            ) : (
              <Text style={styles.priceText}>
                {product.price.toFixed(2)} {symbol}
              </Text>
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#eaeaea",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  image: {
    width: "100%",
    aspectRatio: 0.72,
    justifyContent: "space-between",
  },
  imageBorder: {
    borderRadius: 16,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.22)",
  },
  topInfo: {
    padding: 12,
  },
  name: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  units: {
    color: "#fff",
    opacity: 0.95,
    marginTop: 2,
    fontWeight: "600",
  },
  bottomBar: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  plus: { 
    backgroundColor: "#2680ff" 
  },
  minus: { 
    backgroundColor: "#ff4d4f" 
  },
  btnDisabled: {
    backgroundColor: "#aaa", 
    opacity: 0.6 
  },
  btnText: { 
    color: "#fff", 
    fontWeight: "900", 
    fontSize: 18, 
    lineHeight: 18 
  },
  pricePill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.65)",
    marginLeft: "auto",
  },
  priceText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  noStockPill: {
    backgroundColor: "#ff4d4f",
  },
  noStockText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});