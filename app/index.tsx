// app/index.tsx
import React, { useEffect, useState, useMemo } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import Filter from "../components/Filter";
import BottomBar from "../components/PaymentBar";
import { fetchLatestRates, Currency, Rates } from "../services/currency";
import { useCart } from "../context/CartContext";
import { calculateFinalPrice } from "../utils/pricing";

export default function ProductListScreen() {
  const { cart, setCart, products, setProducts } = useCart();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("All");
  const [customerType, setCustomerType] = useState("Retail");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [rates, setRates] = useState<Rates>({ EUR: 1, USD: 1.08, GBP: 0.86 });

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    (async () => {
      const { rates } = await fetchLatestRates();
      setRates(rates);
    })();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (category === "All") return products;
    return products.filter((p) => p.category === category);
  }, [category, products]);

  const add = (id: number) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const remove = (id: number) =>
    setCart((c) => ({ ...c, [id]: Math.max((c[id] || 0) - 1, 0) }));

  const total = products.reduce((sum, p) => {
    const qty = cart[p.id] || 0;
    
    const finalPrice = calculateFinalPrice(
        p.price,
        customerType,
        currency, 
        rates
    );

    return sum + qty * finalPrice;
  }, 0);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <Filter value={category} categories={categories} onChange={setCategory} />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 16 }}
        contentContainerStyle={{ paddingBottom: 140 }}
        renderItem={({ item }) => {
          const convertedPrice = calculateFinalPrice(
            item.price,
            customerType,
            currency,
            rates
          );

          return (
            <View style={styles.gridItem}>
              <ProductCard
                product={{ ...item, price: convertedPrice }}
                quantity={cart[item.id] || 0}
                currency={currency}
                onAdd={() => add(item.id)}
                onRemove={() => remove(item.id)}
              />
            </View>
          );
        }}
      />
      <BottomBar
        total={total}
        currency={currency}
        setCurrency={setCurrency}
        customerType={customerType}
        setCustomerType={setCustomerType}
        rates={rates}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#f9f9f9" 
  },
  gridItem: {
    width: "48%",
  },
});