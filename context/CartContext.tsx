// context/CartContext.tsx
import React, { createContext, useContext, useState } from "react";
import { Product } from "../services/api";

type Cart = Record<number, number>;

type CartContextType = {
  cart: Cart;
  setCart: React.Dispatch<React.SetStateAction<Cart>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <CartContext.Provider value={{ cart, setCart, products, setProducts }}>
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => useContext(CartContext)!;
