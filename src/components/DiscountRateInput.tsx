
import React, { useCallback, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

interface DiscountRateInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

const DiscountRateInput: React.FC<DiscountRateInputProps> = ({
  value,
  onChange,
  onBlur
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const validation = useMemo(() => {
    const rate = Number(value || 0);
    if (value === '' || value === '0') {
      return { isValid: false, message: 'Discount rate is required' };
    }
    if (rate < 0) {
      return { isValid: false, message: 'Discount rate cannot be negative' };
    }
    if (rate > 100) {
      return { isValid: false, message: 'Discount rate seems unusually high' };
    }
    return { isValid: true, message: '' };
  }, [value]);

  return (
    <div className="space-y-2">
      <Label htmlFor="discount-rate" className="text-sm font-medium text-gray-700">
        Discount Rate (%)
      </Label>
      <div className="relative">
        <Input
          id="discount-rate"
          type="number"
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder="Enter discount rate (e.g., 10)"
          step="0.01"
          min="0"
          max="100"
          className={`text-lg ${!validation.isValid && value !== '' ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {!validation.isValid && value !== '' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
        )}
      </div>
      {!validation.isValid && value !== '' && (
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
