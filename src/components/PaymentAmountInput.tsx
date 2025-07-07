import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PaymentAmountInputProps {
  amountDue: number;
  presentValue: number;
  onUpdateAmount: (amount: number) => void;
}

const PaymentAmountInput: React.FC<PaymentAmountInputProps> = ({
  amountDue,
  presentValue,
  onUpdateAmount
}) => {
  const { formatCurrency } = useCurrency();
  const [amountValue, setAmountValue] = useState(amountDue > 0 ? amountDue.toString() : '');
  const [isAmountFocused, setIsAmountFocused] = useState(false);
  const amountInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAmountFocused) {
      setAmountValue(amountDue > 0 ? amountDue.toString() : '');
    }
  }, [amountDue, isAmountFocused]);

  const handleAmountFocus = useCallback(() => {
    setIsAmountFocused(true);
    setAmountValue(amountDue > 0 ? amountDue.toString() : '');
  }, [amountDue]);

  const handleAmountBlur = useCallback(() => {
    const amount = parseFloat(amountValue) || 0;
    setIsAmountFocused(false);
    onUpdateAmount(amount);
  }, [amountValue, onUpdateAmount]);

  const handleAmountChange = useCallback((value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmountValue(value);
    }
  }, []);

  const amountDisplayValue = isAmountFocused 
    ? amountValue 
    : (amountDue > 0 ? amountDue.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '');

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Amount Due
      </label>
      <div className="space-y-2">
        <Input
          ref={amountInputRef}
          type="text"
          placeholder="Enter amount"
          value={amountDisplayValue}
          onChange={(e) => handleAmountChange(e.target.value)}
          onFocus={handleAmountFocus}
          onBlur={handleAmountBlur}
          className="h-12 text-base font-medium"
        />
        {!isAmountFocused && amountDue > 0 && (
          <div className="space-y-1">
            <div className="text-xs text-green-600 font-medium px-2">
              Future: {formatCurrency(amountDue)}
            </div>
            <div className="text-xs text-blue-600 font-medium px-2">
              Present: {formatCurrency(presentValue)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentAmountInput;