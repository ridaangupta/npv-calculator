
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

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

interface CachedRates {
  rates: ExchangeRates;
  timestamp: number;
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
  { code: 'XOF', name: 'CFA Franc BCEAO', symbol: 'CFA', symbolNative: 'F CFA', decimalDigits: 0 },
];

const CACHE_KEY = 'npv_calculator_exchange_rates';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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

  // Load cached exchange rates
  const loadCachedRates = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const cachedData: CachedRates = JSON.parse(cached);
        const now = Date.now();
        
        // Check if cache is still valid (within 24 hours)
        if (now - cachedData.timestamp < CACHE_DURATION) {
          setExchangeRates(cachedData.rates);
          setLastUpdated(new Date(cachedData.timestamp));
          return true;
        }
      }
    } catch (error) {
      console.error('Failed to load cached exchange rates:', error);
    }
    return false;
  };

  // Save exchange rates to cache
  const saveCachedRates = (rates: ExchangeRates) => {
    try {
      const cacheData: CachedRates = {
        rates,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to save exchange rates to cache:', error);
    }
  };

  const fetchExchangeRates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      const newRates = { USD: 1, ...data.rates };
      setExchangeRates(newRates);
      setLastUpdated(new Date());
      saveCachedRates(newRates);
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      // Fallback rates (approximate)
      const fallbackRates = {
        USD: 1,
        EUR: 0.85,
        XOF: 600,
      };
      setExchangeRates(fallbackRates);
      setLastUpdated(new Date());
      saveCachedRates(fallbackRates);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Try to load from cache first, if failed or expired, fetch new rates
    if (!loadCachedRates()) {
      fetchExchangeRates();
    }
  }, []);

  // Memoized conversion functions to prevent recreation on every render
  const convertFromUSD = useMemo(() => {
    return (amount: number): number => {
      const rate = exchangeRates[selectedCurrency.code] || 1;
      return amount * rate;
    };
  }, [exchangeRates, selectedCurrency.code]);

  const convertToUSD = useMemo(() => {
    return (amount: number): number => {
      const rate = exchangeRates[selectedCurrency.code] || 1;
      return amount / rate;
    };
  }, [exchangeRates, selectedCurrency.code]);

  const formatCurrency = useMemo(() => {
    return (amount: number): string => {
      const convertedAmount = convertFromUSD(amount);
      
      // Special handling for CFA Franc
      if (selectedCurrency.code === 'XOF') {
        const formatted = new Intl.NumberFormat('fr-FR', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(Math.round(convertedAmount));
        return `${formatted} ${selectedCurrency.symbolNative}`;
      }
      
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: selectedCurrency.code,
        minimumFractionDigits: selectedCurrency.decimalDigits,
        maximumFractionDigits: selectedCurrency.decimalDigits,
        currencyDisplay: 'symbol'
      }).format(convertedAmount);
    };
  }, [convertFromUSD, selectedCurrency]);

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
