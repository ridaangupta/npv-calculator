
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  symbolNative: string;
  decimalDigits: number;
}

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyContextType {
  selectedCurrency: Currency;
  currencies: Currency[];
  exchangeRates: ExchangeRates;
  isLoading: boolean;
  lastUpdated: Date | null;
  setSelectedCurrency: (currency: Currency) => void;
  convertFromUSD: (amount: number) => number;
  convertToUSD: (amount: number) => number;
  formatCurrency: (amount: number) => string;
}

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', symbolNative: '$', decimalDigits: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', symbolNative: '€', decimalDigits: 2 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', symbolNative: 'د.إ', decimalDigits: 2 },
  { code: 'XOF', name: 'CFA Franc', symbol: 'CFA', symbolNative: 'CFA', decimalDigits: 0 },
  { code: 'GBP', name: 'British Pound', symbol: '£', symbolNative: '£', decimalDigits: 2 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', symbolNative: '¥', decimalDigits: 0 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CAD', symbolNative: '$', decimalDigits: 2 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', symbolNative: '₦', decimalDigits: 2 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', symbolNative: 'R', decimalDigits: 2 },
];

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]); // USD default
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({ USD: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchExchangeRates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      setExchangeRates({ USD: 1, ...data.rates });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      // Fallback rates (approximate)
      setExchangeRates({
        USD: 1,
        EUR: 0.85,
        AED: 3.67,
        XOF: 600,
        GBP: 0.73,
        JPY: 110,
        CAD: 1.25,
        NGN: 460,
        ZAR: 15.5,
      });
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const convertFromUSD = (amount: number): number => {
    const rate = exchangeRates[selectedCurrency.code] || 1;
    return amount * rate;
  };

  const convertToUSD = (amount: number): number => {
    const rate = exchangeRates[selectedCurrency.code] || 1;
    return amount / rate;
  };

  const formatCurrency = (amount: number): string => {
    const convertedAmount = convertFromUSD(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency.code,
      minimumFractionDigits: selectedCurrency.decimalDigits,
      maximumFractionDigits: selectedCurrency.decimalDigits,
      currencyDisplay: 'symbol'
    }).format(convertedAmount).replace(/[A-Z]{3}/, selectedCurrency.symbol);
  };

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        currencies,
        exchangeRates,
        isLoading,
        lastUpdated,
        setSelectedCurrency,
        convertFromUSD,
        convertToUSD,
        formatCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
