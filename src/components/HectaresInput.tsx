
import React, { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCurrency } from '@/contexts/CurrencyContext';

interface HectaresInputProps {
  totalHectares: string;
  onTotalHectaresChange: (value: string) => void;
}

const HectaresInput: React.FC<HectaresInputProps> = ({
  totalHectares,
  onTotalHectaresChange
}) => {
  const { selectedCurrency } = useCurrency();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onTotalHectaresChange(e.target.value);
  }, [onTotalHectaresChange]);

  return (
    <div className="space-y-2 pt-4 border-t border-gray-200">
      <Label htmlFor="total-hectares" className="text-sm font-medium text-gray-700">
        Total Hectares
      </Label>
      <Input
        id="total-hectares"
        type="number"
        value={totalHectares}
        onChange={handleChange}
        placeholder="Enter total hectares"
        min="0.1"
        step="0.1"
        className="text-lg"
      />
      <p className="text-xs text-gray-500">
        NPV calculations above are per hectare in {selectedCurrency.code}. Total project value will be calculated below.
      </p>
    </div>
  );
};

export default HectaresInput;
