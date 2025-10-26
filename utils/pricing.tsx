// utils/pricing.ts
import { convertCurrency, Currency, Rates } from "../services/currency";
import { Product } from "../services/api"; // Asumiendo que Product viene de api.ts

/**
 * Devuelve el multiplicador de precio (1 = 0% descuento, 0.8 = 20% descuento, etc.).
 * @param type El tipo de cliente.
 */
export const getDiscount = (type: string | undefined): number => {
    switch (type) {
      case "Crew":
        return 0.8;
      case "Happy hour":
        return 0.7;
      case "Business invitation":
      case "Tourist invitation":
        return 0;
      default:
        return 1;
    }
};

/**
 * Calcula el precio final de un producto con descuento y conversión de moneda aplicados.
 * @param priceBaseUSD Precio base del producto en USD.
 * @param customerType Tipo de cliente para calcular el descuento.
 * @param targetCurrency Moneda de destino.
 * @param rates Tasas de conversión.
 * @returns El precio final convertido y con descuento.
 */

export const calculateFinalPrice = (
    priceBaseUSD: number,
    customerType: string | undefined,
    targetCurrency: Currency,
    rates: Rates
): number => {
    const discount = getDiscount(customerType);
    const discountedUSDPrice = priceBaseUSD * discount;
    
    return convertCurrency(
        discountedUSDPrice, 
        "USD", 
        targetCurrency, 
        rates
    );
};