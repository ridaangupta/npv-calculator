
import React, { useCallback, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

interface DiscountRateInputProps {
  discountRate: string;
  onDiscountRateChange: (value: string) => void;
  onBlur?: () => void;
}

const DiscountRateInput: React.FC<DiscountRateInputProps> = ({
  discountRate,
  onDiscountRateChange,
  onBlur
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onDiscountRateChange(e.target.value);
  }, [onDiscountRateChange]);

  const validation = useMemo(() => {
    const rate = Number(discountRate || 0);
    if (discountRate === '' || discountRate === '0') {
      return { isValid: false, message: 'Discount rate is required' };
    }
    if (rate < 0) {
      return { isValid: false, message: 'Discount rate cannot be negative' };
    }
    if (rate > 100) {
      return { isValid: false, message: 'Discount rate seems unusually high' };
    }
    return { isValid: true, message: '' };
  }, [discountRate]);

  return (
    <div className="space-y-2">
      <Label htmlFor="discount-rate" className="text-sm font-medium text-gray-700">
        Discount Rate (%)
      </Label>
      <div className="relative">
        <Input
          id="discount-rate"
          type="number"
          value={discountRate}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder="Enter discount rate (e.g., 10)"
          step="0.01"
          min="0"
          max="100"
          className={`text-lg ${!validation.isValid && discountRate !== '' ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {!validation.isValid && discountRate !== '' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
        )}
      </div>
      {!validation.isValid && discountRate !== '' && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {validation.message}
        </p>
      )}
      <p className="text-xs text-gray-500">
        The discount rate reflects the cost of capital or required return rate
      </p>
    </div>
  );
};

export default DiscountRateInput;
