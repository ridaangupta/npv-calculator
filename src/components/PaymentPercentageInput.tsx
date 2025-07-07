import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';

interface PaymentPercentageInputProps {
  percentageOfDeal: number;
  onUpdatePercentage: (percentage: number) => void;
}

const PaymentPercentageInput: React.FC<PaymentPercentageInputProps> = ({
  percentageOfDeal,
  onUpdatePercentage
}) => {
  const [percentageValue, setPercentageValue] = useState(percentageOfDeal > 0 ? percentageOfDeal.toString() : '');
  const [isPercentageFocused, setIsPercentageFocused] = useState(false);
  const percentageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isPercentageFocused) {
      setPercentageValue(percentageOfDeal > 0 ? percentageOfDeal.toString() : '');
    }
  }, [percentageOfDeal, isPercentageFocused]);

  const handlePercentageFocus = useCallback(() => {
    setIsPercentageFocused(true);
    setPercentageValue(percentageOfDeal > 0 ? percentageOfDeal.toString() : '');
  }, [percentageOfDeal]);

  const handlePercentageBlur = useCallback(() => {
    const percentage = parseFloat(percentageValue) || 0;
    setIsPercentageFocused(false);
    onUpdatePercentage(Math.min(100, Math.max(0, percentage)));
  }, [percentageValue, onUpdatePercentage]);

  const handlePercentageChange = useCallback((value: string) => {
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setPercentageValue(value);
    }
  }, []);

  const percentageDisplayValue = isPercentageFocused 
    ? percentageValue 
    : (percentageOfDeal > 0 ? percentageOfDeal.toFixed(1) : '');

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Percentage of Deal
      </label>
      <div className="space-y-2">
        <div className="relative">
          <Input
            ref={percentageInputRef}
            type="text"
            placeholder="Enter percentage"
            value={percentageDisplayValue}
            onChange={(e) => handlePercentageChange(e.target.value)}
            onFocus={handlePercentageFocus}
            onBlur={handlePercentageBlur}
            className="h-12 text-base font-medium pr-8"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
            %
          </span>
        </div>
        {!isPercentageFocused && percentageOfDeal > 0 && (
          <div className="text-xs text-blue-600 font-medium px-2">
            {percentageOfDeal.toFixed(2)}% of total
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPercentageInput;