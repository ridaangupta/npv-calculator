
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Calculator, BarChart, AlertTriangle, Info } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { PaymentSchedule } from '@/types/PaymentSchedule';
import ValidationAlert from './ValidationAlert';

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
  cashFlows,
  baseCashFlow,
  increaseValue,
  increaseType,
  paymentTiming
}) => {
  const { formatCurrency } = useCurrency();

  // Enhanced validation for results display
  const validationIssues = [];
  
  if (baseCashFlow <= 0) {
    validationIssues.push('Base cash flow must be greater than 0');
  }
  
  if (totalHectares <= 0) {
    validationIssues.push('Total hectares must be greater than 0');
  }
  
  if (!cashFlows || cashFlows.length === 0) {
    validationIssues.push('No cash flows generated - check your inputs');
  }

  const hasValidationErrors = validationIssues.length > 0;
  
  // If there are validation errors, show error state
  if (hasValidationErrors) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Upfront Lease Valuation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ValidationAlert
              type="error"
              title="Cannot Calculate Results"
              message="Please fix the following validation errors before calculations can be performed:"
              className="mb-4"
            />
            <ul className="list-disc pl-5 space-y-1">
              {validationIssues.map((issue, index) => (
                <li key={index} className="text-sm text-red-600">{issue}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show warning if NPV is zero or negative
  const showNpvWarning = npv <= 0;

  // Calculate per square meter (1 hectare = 10,000 square meters)
  const npvPerSquareMeter = npv / 10000;

  return (
    <div className="space-y-6">
      {/* NPV Warning Alert */}
      {showNpvWarning && (
        <ValidationAlert
          type="warning"
          title="Low or Negative Deal Value"
          message="The calculated deal value is zero or negative. This may indicate that the projected cash flows do not justify the investment. Please review your lease terms and projections."
        />
      )}

      {/* Business Context Explanation */}
      <Card className="shadow-lg border-0 bg-blue-50/80 backdrop-blur-sm border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Understanding Your Upfront Lease Value</h3>
              <p className="text-sm text-blue-800 mb-3">
                These calculations show the present value of your projected lease payments - essentially what the future income stream is worth in today's dollars.
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Deal Value:</strong> The total present value of all future lease payments</li>
                <li>• <strong>Per Square Meter:</strong> Unit pricing for precise land valuations</li>
                <li>• <strong>Total Investment:</strong> Complete upfront amount for your {totalHectares} hectare(s)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Main Results Cards */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Deal Value per Square Meter</p>
                <p className="text-3xl font-bold">{formatCurrency(Math.max(0, npvPerSquareMeter))}</p>
                <p className="text-green-200 text-xs mt-1">Upfront payment per m²</p>
              </div>
              <Calculator className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Deal Value per Hectare</p>
                <p className="text-3xl font-bold">{formatCurrency(Math.max(0, npv))}</p>
                <p className="text-blue-200 text-xs mt-1">Present value of lease payments</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Investment Required</p>
                <p className="text-3xl font-bold">{formatCurrency(Math.max(0, npv * totalHectares))}</p>
                <p className="text-purple-200 text-xs mt-1">Complete upfront amount ({totalHectares} hectares)</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lease Terms Summary */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <BarChart className="w-5 h-5" />
            Lease Terms Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{formatCurrency(baseCashFlow)}</div>
              <div className="text-sm text-gray-600">Starting Annual Payment</div>
              <div className="text-xs text-gray-500 mt-1">Per square meter</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {increaseType === 'percent' ? `${increaseValue}%` : `${formatCurrency(increaseValue)}`}
              </div>
              <div className="text-sm text-gray-600">
                {increaseType === 'percent' ? 'Annual Increase Rate' : 'Annual Increase Amount'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {increaseType === 'percent' ? 'Percentage growth' : 'Per square meter'}
              </div>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="text-sm mb-2">
                {paymentTiming.charAt(0).toUpperCase() + paymentTiming.slice(1)} of Year
              </Badge>
              <div className="text-sm text-gray-600">Payment Timing</div>
              <div className="text-xs text-gray-500 mt-1">When payments are due</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
