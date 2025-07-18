
import React, { useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCurrency } from '@/contexts/CurrencyContext';
import { AlertCircle } from 'lucide-react';

interface HectaresInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

const HectaresInput: React.FC<HectaresInputProps> = ({
  value,
  onChange,
  onBlur
}) => {
  const { selectedCurrency } = useCurrency();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const validation = useMemo(() => {
    const hectares = Number(value || 0);
    if (value === '') {
      return { isValid: false, message: 'Total hectares is required' };
    }
    if (hectares <= 0) {
      return { isValid: false, message: 'Total hectares must be greater than zero' };
    }
    if (hectares > 10000) {
      return { isValid: false, message: 'Total hectares seems unusually large' };
    }
    return { isValid: true, message: '' };
  }, [value]);

  return (
    <div className="space-y-2 pt-4 border-t border-gray-200">
      <Label htmlFor="total-hectares" className="text-sm font-medium text-gray-700">
        Total Hectares
      </Label>
      <div className="relative">
        <Input
          id="total-hectares"
          type="number"
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder="Enter total hectares (e.g., 100)"
          min="0.1"
          step="0.1"
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
        Lease calculations are per hectare in {selectedCurrency.code}. Total project value will be calculated based on this area.
      </p>
    </div>
  );
};

export default HectaresInput;
