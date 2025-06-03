
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCurrency } from '@/contexts/CurrencyContext';

const CurrencyInput: React.FC = () => {
  const { 
    selectedCurrency, 
    currencies, 
    exchangeRates, 
    isLoading, 
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
    <div className="space-y-2">
      <Label htmlFor="currency-select" className="text-sm font-medium text-gray-700">
        Currency
      </Label>
      <Select value={selectedCurrency.code} onValueChange={handleCurrencyChange}>
        <SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
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
      
      <div className="text-xs text-gray-500">
        {selectedCurrency.code !== 'USD' && (
          <span>1 USD = {formatExchangeRate()} {selectedCurrency.code}</span>
        )}
        {isLoading && <span className="text-blue-500 ml-2">Updating...</span>}
      </div>
    </div>
  );
};

export default CurrencyInput;
