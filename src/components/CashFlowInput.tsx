
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CashFlow {
  id: string;
  year: number;
  amount: number;
}

interface CashFlowInputProps {
  cashFlow: CashFlow;
  onUpdate: (id: string, amount: number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

const CashFlowInput: React.FC<CashFlowInputProps> = ({
  cashFlow,
  onUpdate,
  onRemove,
  canRemove
}) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
          Year {cashFlow.year}:
        </span>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            $
          </span>
          <Input
            type="text"
            value={cashFlow.amount === 0 ? '' : cashFlow.amount.toString()}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                onUpdate(cashFlow.id, 0);
              } else {
                const numValue = parseFloat(value);
                if (!isNaN(numValue) && numValue >= 0) {
                  onUpdate(cashFlow.id, numValue);
                }
              }
            }}
            placeholder="0"
            className="pl-8 text-right"
          />
        </div>
      </div>
      {canRemove && (
        <Button
          onClick={() => onRemove(cashFlow.id)}
          size="sm"
          variant="ghost"
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default CashFlowInput;
