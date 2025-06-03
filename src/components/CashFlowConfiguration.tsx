
import React, { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCurrency } from '@/contexts/CurrencyContext';

interface CashFlowConfigurationProps {
  baseCashFlow: string;
  increaseValue: string;
  increaseType: 'amount' | 'percent';
  increaseFrequency: number;
  timePeriod: string;
  onBaseCashFlowChange: (value: string) => void;
  onIncreaseValueChange: (value: string) => void;
  onIncreaseTypeChange: (value: 'amount' | 'percent') => void;
  onIncreaseFrequencyChange: (value: number) => void;
  onTimePeriodChange: (value: string) => void;
}

const CashFlowConfiguration: React.FC<CashFlowConfigurationProps> = ({
  baseCashFlow,
  increaseValue,
  increaseType,
  increaseFrequency,
  timePeriod,
  onBaseCashFlowChange,
  onIncreaseValueChange,
  onIncreaseTypeChange,
  onIncreaseFrequencyChange,
  onTimePeriodChange
}) => {
  const { selectedCurrency, convertFromUSD, convertToUSD } = useCurrency();

  const handleBaseCashFlowChange = useCallback((value: string) => {
    onBaseCashFlowChange(value);
  }, [onBaseCashFlowChange]);

  const handleIncreaseValueChange = useCallback((value: string) => {
    onIncreaseValueChange(value);
  }, [onIncreaseValueChange]);

  const getDisplayBaseCashFlow = useCallback(() => {
    if (baseCashFlow === '' || baseCashFlow === '0') return '';
    const usdValue = Number(baseCashFlow);
    if (isNaN(usdValue)) return baseCashFlow;
    return convertFromUSD(usdValue).toFixed(selectedCurrency.decimalDigits);
  }, [baseCashFlow, convertFromUSD, selectedCurrency.decimalDigits]);

  const getDisplayIncreaseValue = useCallback(() => {
    if (increaseValue === '' || increaseValue === '0') return '';
    if (increaseType === 'percent') return increaseValue;
    const usdValue = Number(increaseValue);
    if (isNaN(usdValue)) return increaseValue;
    return convertFromUSD(usdValue).toFixed(selectedCurrency.decimalDigits);
  }, [increaseValue, increaseType, convertFromUSD, selectedCurrency.decimalDigits]);

  const getDisplayAnnualIncrease = useCallback(() => {
    if (increaseType === 'amount') {
      const usdAnnualIncrease = Number(increaseValue) / increaseFrequency || 0;
      const displayAnnualIncrease = convertFromUSD(usdAnnualIncrease);
      return `${selectedCurrency.symbol}${displayAnnualIncrease.toFixed(selectedCurrency.decimalDigits)}/m² per year`;
    } else {
      return `${(Number(increaseValue) / increaseFrequency || 0).toFixed(2)}% per year`;
    }
  }, [increaseType, increaseValue, increaseFrequency, convertFromUSD, selectedCurrency]);

  const handleBaseCashFlowInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      handleBaseCashFlowChange('');
      return;
    }
    // Store USD value but allow typing in display currency
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      const usdValue = convertToUSD(numericValue);
      handleBaseCashFlowChange(usdValue.toString());
    } else {
      handleBaseCashFlowChange(value);
    }
  }, [handleBaseCashFlowChange, convertToUSD]);

  const handleIncreaseValueInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      handleIncreaseValueChange('');
      return;
    }
    if (increaseType === 'amount') {
      const numericValue = Number(value);
      if (!isNaN(numericValue)) {
        const usdValue = convertToUSD(numericValue);
        handleIncreaseValueChange(usdValue.toString());
      } else {
        handleIncreaseValueChange(value);
      }
    } else {
      handleIncreaseValueChange(value);
    }
  }, [handleIncreaseValueChange, increaseType, convertToUSD]);

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        Cash Flow Parameters
      </Label>
      
      <div className="space-y-2">
        <Label htmlFor="base-cash-flow" className="text-sm font-medium text-gray-600">
          Initial Lease Rent ({selectedCurrency.symbol}/m² per year)
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {selectedCurrency.symbol}
          </span>
          <Input
            id="base-cash-flow"
            type="number"
            value={getDisplayBaseCashFlow()}
            onChange={handleBaseCashFlowInputChange}
            placeholder={`Enter initial lease rent per square meter in ${selectedCurrency.code}`}
            step="0.01"
            className="text-lg pl-8"
          />
        </div>
        <p className="text-xs text-gray-500">
          This will be automatically converted to hectares (1 hectare = 10,000 m²)
        </p>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-600">
          Cash Flow Type
        </Label>
        <RadioGroup 
          value={increaseType} 
          onValueChange={onIncreaseTypeChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="amount" id="amount" />
            <Label htmlFor="amount" className="text-sm">Fixed Amount Increase ({selectedCurrency.symbol}/m² per year)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="percent" id="percent" />
            <Label htmlFor="percent" className="text-sm">Percentage Increase (%)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="increase-value" className="text-sm font-medium text-gray-600">
          {increaseType === 'amount' 
            ? `Total Increase Over ${increaseFrequency} Year${increaseFrequency > 1 ? 's' : ''} (${selectedCurrency.symbol}/m² per year)` 
            : `Total Increase Over ${increaseFrequency} Year${increaseFrequency > 1 ? 's' : ''} (%)`}
        </Label>
        <div className="relative">
          {increaseType === 'amount' && (
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {selectedCurrency.symbol}
            </span>
          )}
          <Input
            id="increase-value"
            type="number"
            value={getDisplayIncreaseValue()}
            onChange={handleIncreaseValueInputChange}
            placeholder={increaseType === 'amount' 
              ? `Enter total ${selectedCurrency.symbol}/m² increase over ${increaseFrequency} year${increaseFrequency > 1 ? 's' : ''}` 
              : `Enter total % increase over ${increaseFrequency} year${increaseFrequency > 1 ? 's' : ''}`}
            step="0.01"
            className={`text-lg ${increaseType === 'amount' ? 'pl-8' : ''}`}
          />
        </div>
        <p className="text-xs text-gray-500">
          This will be spread evenly over each year ({getDisplayAnnualIncrease()})
        </p>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-600">
          Increase Period
        </Label>
        <RadioGroup 
          value={increaseFrequency.toString()} 
          onValueChange={(value) => onIncreaseFrequencyChange(Number(value))}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="yearly" />
            <Label htmlFor="yearly" className="text-sm">1 Year Period</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2" id="biennial" />
            <Label htmlFor="biennial" className="text-sm">2 Year Period</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="triennial" />
            <Label htmlFor="triennial" className="text-sm">3 Year Period</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4" id="quadrennial" />
            <Label htmlFor="quadrennial" className="text-sm">4 Year Period</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="5" id="quinquennial" />
            <Label htmlFor="quinquennial" className="text-sm">5 Year Period</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="time-period" className="text-sm font-medium text-gray-600">
          Time Period (Years)
        </Label>
        <Input
          id="time-period"
          type="number"
          value={timePeriod}
          onChange={(e) => onTimePeriodChange(e.target.value)}
          placeholder="Enter time period"
          min="0.1"
          step="0.1"
          className="text-lg"
        />
      </div>
    </div>
  );
};

export default CashFlowConfiguration;
