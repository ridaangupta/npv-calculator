import React, { useCallback, useState, useEffect, useMemo, memo } from 'react';
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
  paymentTiming: 'beginning' | 'middle' | 'end';
  onBaseCashFlowChange: (value: string) => void;
  onIncreaseValueChange: (value: string) => void;
  onIncreaseTypeChange: (value: 'amount' | 'percent') => void;
  onIncreaseFrequencyChange: (value: number) => void;
  onTimePeriodChange: (value: string) => void;
  onPaymentTimingChange: (value: 'beginning' | 'middle' | 'end') => void;
}

const CashFlowConfiguration: React.FC<CashFlowConfigurationProps> = ({
  baseCashFlow,
  increaseValue,
  increaseType,
  increaseFrequency,
  timePeriod,
  paymentTiming,
  onBaseCashFlowChange,
  onIncreaseValueChange,
  onIncreaseTypeChange,
  onIncreaseFrequencyChange,
  onTimePeriodChange,
  onPaymentTimingChange
}) => {
  const { selectedCurrency, convertFromUSD, convertToUSD } = useCurrency();
  
  // Local state for display values during typing
  const [baseCashFlowDisplay, setBaseCashFlowDisplay] = useState('');
  const [increaseValueDisplay, setIncreaseValueDisplay] = useState('');

  // Memoized currency conversions to prevent recalculation on every render
  const memoizedConversions = useMemo(() => {
    const baseCashFlowNum = Number(baseCashFlow);
    const increaseValueNum = Number(increaseValue);
    
    return {
      baseCashFlowConverted: !isNaN(baseCashFlowNum) ? convertFromUSD(baseCashFlowNum) : 0,
      increaseValueConverted: !isNaN(increaseValueNum) && increaseType === 'amount' ? convertFromUSD(increaseValueNum) : increaseValueNum
    };
  }, [baseCashFlow, increaseValue, increaseType, convertFromUSD]);

  // Update display values when currency or props change  
  useEffect(() => {
    if (baseCashFlow === '' || baseCashFlow === '0') {
      setBaseCashFlowDisplay('');
    } else {
      setBaseCashFlowDisplay(memoizedConversions.baseCashFlowConverted.toFixed(selectedCurrency.decimalDigits));
    }
  }, [baseCashFlow, memoizedConversions.baseCashFlowConverted, selectedCurrency.decimalDigits]);

  useEffect(() => {
    if (increaseValue === '' || increaseValue === '0') {
      setIncreaseValueDisplay('');
    } else if (increaseType === 'percent') {
      setIncreaseValueDisplay(increaseValue);
    } else {
      setIncreaseValueDisplay(memoizedConversions.increaseValueConverted.toFixed(selectedCurrency.decimalDigits));
    }
  }, [increaseValue, increaseType, memoizedConversions.increaseValueConverted, selectedCurrency.decimalDigits]);

  const handleBaseCashFlowChange = useCallback((value: string) => {
    onBaseCashFlowChange(value);
  }, [onBaseCashFlowChange]);

  const handleIncreaseValueChange = useCallback((value: string) => {
    onIncreaseValueChange(value);
  }, [onIncreaseValueChange]);

  const getDisplayAnnualIncrease = useCallback(() => {
    if (increaseType === 'amount') {
      const displayIncrease = convertFromUSD(Number(increaseValue) || 0);
      return `${selectedCurrency.symbol}${displayIncrease.toFixed(selectedCurrency.decimalDigits)}/m² every ${increaseFrequency} year${increaseFrequency > 1 ? 's' : ''}`;
    } else {
      return `${Number(increaseValue) || 0}% every ${increaseFrequency} year${increaseFrequency > 1 ? 's' : ''}`;
    }
  }, [increaseType, increaseValue, increaseFrequency, convertFromUSD, selectedCurrency]);

  const handleBaseCashFlowInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBaseCashFlowDisplay(value);
  }, []);

  const handleBaseCashFlowBlur = useCallback(() => {
    if (baseCashFlowDisplay === '') {
      handleBaseCashFlowChange('');
      return;
    }
    const numericValue = Number(baseCashFlowDisplay);
    if (!isNaN(numericValue)) {
      const usdValue = convertToUSD(numericValue);
      handleBaseCashFlowChange(usdValue.toString());
    } else {
      handleBaseCashFlowChange(baseCashFlowDisplay);
    }
  }, [baseCashFlowDisplay, handleBaseCashFlowChange, convertToUSD]);

  const handleIncreaseValueInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIncreaseValueDisplay(value);
  }, []);

  const handleIncreaseValueBlur = useCallback(() => {
    if (increaseValueDisplay === '') {
      handleIncreaseValueChange('');
      return;
    }
    if (increaseType === 'amount') {
      const numericValue = Number(increaseValueDisplay);
      if (!isNaN(numericValue)) {
        const usdValue = convertToUSD(numericValue);
        handleIncreaseValueChange(usdValue.toString());
      } else {
        handleIncreaseValueChange(increaseValueDisplay);
      }
    } else {
      handleIncreaseValueChange(increaseValueDisplay);
    }
  }, [increaseValueDisplay, handleIncreaseValueChange, increaseType, convertToUSD]);

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
            value={baseCashFlowDisplay}
            onChange={handleBaseCashFlowInputChange}
            onBlur={handleBaseCashFlowBlur}
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
            ? `Increase Amount Every ${increaseFrequency} Year${increaseFrequency > 1 ? 's' : ''} (${selectedCurrency.symbol}/m² per year)` 
            : `Increase Percentage Every ${increaseFrequency} Year${increaseFrequency > 1 ? 's' : ''} (%)`}
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
            value={increaseValueDisplay}
            onChange={handleIncreaseValueInputChange}
            onBlur={handleIncreaseValueBlur}
            placeholder={increaseType === 'amount' 
              ? `Enter ${selectedCurrency.symbol}/m² increase every ${increaseFrequency} year${increaseFrequency > 1 ? 's' : ''}` 
              : `Enter % increase every ${increaseFrequency} year${increaseFrequency > 1 ? 's' : ''}`}
            step="0.01"
            className={`text-lg ${increaseType === 'amount' ? 'pl-8' : ''}`}
          />
        </div>
        <p className="text-xs text-gray-500">
          This increase will be applied discretely at the end of each period ({getDisplayAnnualIncrease()})
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

      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-600">
          Payment Timing
        </Label>
        <RadioGroup 
          value={paymentTiming} 
          onValueChange={onPaymentTimingChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="beginning" id="beginning" />
            <Label htmlFor="beginning" className="text-sm">Beginning of Year</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="middle" id="middle" />
            <Label htmlFor="middle" className="text-sm">Middle of Year</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="end" id="end" />
            <Label htmlFor="end" className="text-sm">End of Year</Label>
          </div>
        </RadioGroup>
        <p className="text-xs text-gray-500">
          Payment timing affects the present value calculation. Beginning of year payments are worth more due to less discounting.
        </p>
      </div>
    </div>
  );
};

// Custom comparison function for React.memo
const arePropsEqual = (prevProps: CashFlowConfigurationProps, nextProps: CashFlowConfigurationProps) => {
  return (
    prevProps.baseCashFlow === nextProps.baseCashFlow &&
    prevProps.increaseValue === nextProps.increaseValue &&
    prevProps.increaseType === nextProps.increaseType &&
    prevProps.increaseFrequency === nextProps.increaseFrequency &&
    prevProps.timePeriod === nextProps.timePeriod &&
    prevProps.paymentTiming === nextProps.paymentTiming &&
    prevProps.onBaseCashFlowChange === nextProps.onBaseCashFlowChange &&
    prevProps.onIncreaseValueChange === nextProps.onIncreaseValueChange &&
    prevProps.onIncreaseTypeChange === nextProps.onIncreaseTypeChange &&
    prevProps.onIncreaseFrequencyChange === nextProps.onIncreaseFrequencyChange &&
    prevProps.onTimePeriodChange === nextProps.onTimePeriodChange &&
    prevProps.onPaymentTimingChange === nextProps.onPaymentTimingChange
  );
};

export default React.memo(CashFlowConfiguration, arePropsEqual);
