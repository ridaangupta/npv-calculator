
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCurrency } from '@/contexts/CurrencyContext';

const CurrencySelector: React.FC = () => {
  const { 
    selectedCurrency, 
    currencies, 
    exchangeRates, 
    isLoading, 
    lastUpdated, 
    setSelectedCurrency 
  } = useCurrency();

  const handleCurrencyChange = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (currency) {
      setSelectedCurrency(currency);
    }
  };

  const formatExchangeRate = () => {
    if (selectedCurrency.code === 'USD') return '1.00';
    const rate = exchangeRates[selectedCurrency.code];
    return rate ? rate.toFixed(selectedCurrency.decimalDigits === 0 ? 0 : 4) : 'N/A';
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg border">
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Currency</Label>
        <Select value={selectedCurrency.code} onValueChange={handleCurrencyChange}>
          <SelectTrigger className="w-full">
            <SelectValue>
              <div className="flex items-center gap-2">
                <span className="font-medium">{selectedCurrency.symbol}</span>
                <span className="text-sm">{selectedCurrency.code}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{currency.symbol}</span>
                    <span className="text-sm">{currency.code}</span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">{currency.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="text-xs text-gray-500 space-y-1">
          <div>Rate: 1 USD = {formatExchangeRate()} {selectedCurrency.code}</div>
          {lastUpdated && (
            <div>Updated: {lastUpdated.toLocaleTimeString()}</div>
          )}
          {isLoading && <div className="text-blue-500">Updating rates...</div>}
        </div>
      </div>
    </div>
  );
};

export default CurrencySelector;
