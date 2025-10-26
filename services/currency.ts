// services/currency.ts
export type Currency = "EUR" | "USD" | "GBP";
export type Rates = Record<Currency, number>;

const FRANKFURTER = "https://api.frankfurter.app/latest?from=EUR&to=USD,GBP";

let cache: { rates: Rates; date: string } | null = null;

export async function fetchLatestRates(): Promise<{ rates: Rates; date: string }> {
  try {
    const res = await fetch(FRANKFURTER);
    if (!res.ok) throw new Error("Failed to fetch FX");
    const data = await res.json();
    const rates: Rates = { EUR: 1, USD: data.rates.USD, GBP: data.rates.GBP };
    cache = { rates, date: data.date };
    return { rates, date: data.date };
  } catch (e) {
    if (cache) return cache;
    return { rates: { EUR: 1, USD: 1.08, GBP: 0.86 }, date: "offline" };
  }
}

export function convertCurrency(amount: number, from: Currency, to: Currency, rates: Rates): number {
  if (from === to) return amount;
  const inEUR = from === "EUR" ? amount : amount / rates[from];
  return to === "EUR" ? inEUR : inEUR * rates[to];
}
