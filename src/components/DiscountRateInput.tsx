
import React, { useCallback } from 'react';
import { Label } from '@/components/ui/label';

interface DiscountRateInputProps {
  discountRate: string;
  onDiscountRateChange: (value: string) => void;
}

const DiscountRateInput: React.FC<DiscountRateInputProps> = ({
  discountRate,
  onDiscountRateChange
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onDiscountRateChange(e.target.value);
  }, [onDiscountRateChange]);

  return (
    <div className="space-y-2">
      <Label htmlFor="discount-rate" className="text-sm font-medium text-gray-700">
        Discount Rate (%)
      </Label>
      <input
        id="discount-rate"
        type="number"
        value={discountRate}
        onChange={handleChange}
        placeholder="Enter discount rate"
        step="0.01"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      />
    </div>
  );
};

export default DiscountRateInput;
