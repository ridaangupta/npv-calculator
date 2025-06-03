
import React from 'react';
import { Label } from '@/components/ui/label';

interface CashFlow {
  id: string;
  year: number;
  amount: number;
}

interface CashFlowPreviewProps {
  cashFlows: CashFlow[];
}

const CashFlowPreview: React.FC<CashFlowPreviewProps> = ({ cashFlows }) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">
        Generated Cash Flow Preview ($/hectare per year)
      </Label>
      <div className="max-h-32 overflow-y-auto space-y-2 bg-gray-50 p-3 rounded-lg">
        {cashFlows.map((flow) => (
          <div key={flow.id} className="flex justify-between text-sm">
            <span className="text-gray-600">Year {flow.year}:</span>
            <span className="font-medium">
              ${flow.amount.toLocaleString()}/ha
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Values shown are per hectare (converted from per m² input × 10,000)
      </p>
    </div>
  );
};

export default CashFlowPreview;
