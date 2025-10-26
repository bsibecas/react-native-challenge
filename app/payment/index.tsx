// app/payment/index.tsx
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Alert, 
  TouchableOpacity,
  KeyboardAvoidingView, 
  ScrollView, 
  Platform 
} from "react-native";
import { useCart } from "../../context/CartContext";
import CartItem from "../../components/CartItem";
import SeatSelector from "../../components/SeatSelector";
import PaymentMethod from "../../components/PaymentMethod";
import { Currency, Rates } from "../../services/currency";
import CardForm from "../../components/CardForm";
import { updateProductStock } from "../../services/api";
import PaymentSuccess from "../../components/PaymentSuccess";
import CashForm from "../../components/CashForm";
import { FontAwesome5 as Icon } from '@expo/vector-icons';
import { calculateFinalPrice } from "../../utils/pricing";

type PaymentMethodType = "Cash" | "Card" | ""; 

const getCurrencySymbol = (currency: Currency) => {
  switch (currency) {
    case "USD": return "$";
    case "EUR": return "€";
    case "GBP": return "£";
    default: return "";
  }
};

export default function PaymentScreen() {
  const { cart, setCart, products } = useCart();
  const { currency: currencyParam, rates: ratesParam, customerType: customerTypeParam } = useLocalSearchParams();
  const [currency, setCurrency] = useState<Currency>(
    (currencyParam as Currency) || "USD"
  );
  const [rates, setRates] = useState<Rates>({ EUR: 1, USD: 1.08, GBP: 0.86 });
  const [seat, setSeat] = useState("A1");
  const [method, setMethod] = useState<PaymentMethodType>("");
  const [paymentDone, setPaymentDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const customerType = Array.isArray(customerTypeParam) 
    ? customerTypeParam[0] 
    : (customerTypeParam as string | undefined);
  
  useEffect(() => {
    if (ratesParam) {
      try {
        const parsedRates = JSON.parse(ratesParam as string);
        setRates(parsedRates);
      } catch (error) {
        console.warn("Invalid rates param:", error);
      }
    }
  }, [ratesParam]);

  const items = useMemo(() => products.filter((p) => cart[p.id] > 0), [products, cart]);
  const total = useMemo(() => {
    return items.reduce((sum, p) => {
      const finalPrice = calculateFinalPrice(
          p.price,
          customerType,
          currency, 
          rates
      );
      return sum + finalPrice * cart[p.id];
    }, 0);
  }, [items, cart, currency, rates, customerType]);

  const handleRemoveItem = (id: number) => {
    const updated = { ...cart };
    delete updated[id];
    setCart(updated);
  };
  const handlePaymentSuccess = async (paymentData: any) => {
    if (loading) return;
    setLoading(true);
    try {
        const stockUpdatePromises = items.map(item => {
            const quantityPurchased = cart[item.id];
            const newStock = Math.max(item.stock - quantityPurchased, 0);
            return updateProductStock(item.id, newStock);
        });
        await Promise.all(stockUpdatePromises);
        setCart({});
        setPaymentDone(true);
        Alert.alert("Success", "Payment processed and stock updated!");
    } catch (error) {
        console.error("Payment error:", error);
        Alert.alert("Error", "Something went wrong while processing your payment.");
    } finally {
        setLoading(false);
    }
};

  const handleClearCart = () => {
    Alert.alert(
      "Vaciar Carrito",
      "¿Estás seguro de que quieres eliminar todos los productos del carrito?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí",
          onPress: () => {
            setCart({});
            Alert.alert("Carrito vaciado", "Todos los productos han sido eliminados.");
          },
        },
      ]
    );
  };

  if (paymentDone) {
    return <PaymentSuccess />;
  }

  return (
     <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Receipt</Text>
            <TouchableOpacity 
              onPress={handleClearCart} 
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="times" size={20} color="#888" />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Selected Products</Text>

          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => {
                const convertedPrice = calculateFinalPrice(
                    item.price,
                    customerType,
                    currency,
                    rates
                );
                return (
                  <CartItem
                    item={{
                      ...item,
                      price: convertedPrice,
                    }}
                    quantity={cart[item.id]}
                    currency={currency}
                    onRemove={() => handleRemoveItem(item.id)}
                  />
                )
            }}
            scrollEnabled={false}
            contentContainerStyle={styles.flatListContent}
          />

          <View style={styles.bottom}>
            <SeatSelector seat={seat} setSeat={setSeat} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>
                {total.toFixed(2)}{" "}
                {getCurrencySymbol(currency)}
              </Text>
            </View>

            <PaymentMethod method={method as "Cash" | "Card"} setMethod={setMethod as (s: "Cash" | "Card" | "") => void} />
            
            {method === "Card" && (
              <CardForm
                total={total}
                currency={getCurrencySymbol(currency)}
                onConfirm={handlePaymentSuccess}
              />
            )}
            
            {method === "Cash" && (
              <CashForm
                total={total}
                currencySymbol={getCurrencySymbol(currency)}
                onConfirm={handlePaymentSuccess}
              />
            )}
            {loading && <Text style={styles.loadingText}>Processing payment...</Text>}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  flatListContent: { 
    paddingBottom: 20 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    color: "#666",
    marginBottom: 12,
  },
  bottom: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 6,
  },
  totalLabel: {
    fontWeight: "700",
    color: "#555",
  },
  totalValue: {
    fontWeight: "800",
    fontSize: 18,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#007bff',
    fontWeight: '600',
  }
});