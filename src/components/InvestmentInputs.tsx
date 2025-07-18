
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';

interface InvestmentInputsProps {
  initialInvestment: number;
  discountRate: number;
  onInitialInvestmentChange: (value: number) => void;
  onDiscountRateChange: (value: number) => void;
}

const InvestmentInputs: React.FC<InvestmentInputsProps> = ({
  initialInvestment,
  discountRate,
  onInitialInvestmentChange,
  onDiscountRateChange
}) => {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Investment Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="initial-investment" className="text-sm font-medium text-gray-700">
            Initial Investment ($)
          </Label>
          <Input
            id="initial-investment"
            type="text"
            value={initialInvestment === 0 ? '' : initialInvestment.toString()}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                onInitialInvestmentChange(0);
              } else {
                const numValue = parseFloat(value);
                if (!isNaN(numValue) && numValue >= 0) {
                  onInitialInvestmentChange(numValue);
                }
              }
            }}
            placeholder="Enter initial investment"
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount-rate" className="text-sm font-medium text-gray-700">
            Discount Rate (%)
          </Label>
          <Input
            id="discount-rate"
            type="text"
            value={discountRate === 0 ? '' : discountRate.toString()}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                onDiscountRateChange(0);
              } else {
                const numValue = parseFloat(value);
                if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                  onDiscountRateChange(numValue);
                }
              }
            }}
            placeholder="Enter discount rate"
            className="text-lg"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentInputs;
