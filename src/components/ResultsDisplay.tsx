
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Calculator, BarChart } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { PaymentSchedule } from '@/types/PaymentSchedule';

interface CashFlow {
  id: string;
  year: number;
  amount: number;
}

interface ResultsDisplayProps {
  npv: number;
  totalHectares: number;
  discountRate: number;
  cashFlows: CashFlow[];
  baseCashFlow: number;
  increaseValue: number;
  increaseType: 'amount' | 'percent';
  increaseFrequency: number;
  paymentTiming: 'beginning' | 'middle' | 'end';
  paymentSchedule: PaymentSchedule;
  onPaymentScheduleChange: (schedule: PaymentSchedule) => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  npv,
  totalHectares,
  discountRate,
  baseCashFlow,
  increaseValue,
  increaseType,
  paymentTiming
}) => {
  const { formatCurrency } = useCurrency();

  // Calculate per square meter (1 hectare = 10,000 square meters)
  const npvPerSquareMeter = npv / 10000;

  return (
    <div className="space-y-6">
      {/* Main Results Cards */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Upfront Price per Square Meter</p>
                <p className="text-3xl font-bold">{formatCurrency(Math.max(0, npvPerSquareMeter))}</p>
              </div>
              <Calculator className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Upfront Price per Hectare (NPV per Hectare)</p>
                <p className="text-3xl font-bold">{formatCurrency(Math.max(0, npv))}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Upfront Price for All Total Hectares ({totalHectares} hectares)</p>
                <p className="text-3xl font-bold">{formatCurrency(Math.max(0, npv * totalHectares))}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Summary */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <BarChart className="w-5 h-5" />
            Configuration Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{discountRate}%</div>
              <div className="text-sm text-gray-600">Discount Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{formatCurrency(baseCashFlow)}</div>
              <div className="text-sm text-gray-600">Base Cash Flow</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {increaseType === 'percent' ? `${increaseValue}%` : `${formatCurrency(increaseValue)}/m²`}
              </div>
              <div className="text-sm text-gray-600">
                {increaseType === 'percent' ? 'Increase Rate' : 'Increase Amount per m²'}
              </div>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="text-sm">
                {paymentTiming.charAt(0).toUpperCase() + paymentTiming.slice(1)} of Year
              </Badge>
              <div className="text-sm text-gray-600 mt-1">Payment Timing</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
