
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { PaymentSchedule } from '@/types/PaymentSchedule';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PaymentScheduleSummaryProps {
  totalNPV: number;
  paymentSchedule: PaymentSchedule;
  totalAmount: number;
  totalPercentage: number;
  remainingAmount: number;
  isValid: boolean;
  totalPresentValue: number;
  isIncomplete: boolean;
  validationErrors: string[];
  percentageAllocated: number;
}

const PaymentScheduleSummary: React.FC<PaymentScheduleSummaryProps> = ({
  totalNPV,
  totalAmount,
  totalPercentage,
  remainingAmount,
  isValid,
  totalPresentValue,
  isIncomplete,
  validationErrors,
  percentageAllocated
}) => {
  const { formatCurrency } = useCurrency();

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="mb-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-800 mb-2">
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium">Present Value Equivalence Method</span>
          </div>
          <p className="text-xs text-blue-700">
            Percentages are calculated based on present value (NPV) to ensure accurate time-adjusted payment allocation.
          </p>
        </div>

        {/* Validation Status and Errors */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Deal Value</div>
            <div className="text-lg font-bold text-blue-700">
              {formatCurrency(totalNPV)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Present Value Basis for %
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Total Amount Paid</div>
            <div className="text-xl font-bold text-green-700">
              {formatCurrency(totalAmount)}
            </div>
            <div className="text-xs text-gray-500">
              Future Value: {totalPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Present Value: {formatCurrency(totalPresentValue)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Remaining Deal Value</div>
            <div className="text-xl font-bold text-orange-700">
              {formatCurrency(remainingAmount)}
            </div>
            <div className="text-xs text-gray-500">
              {((remainingAmount / totalNPV) * 100).toFixed(1)}% of Deal Value
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            {isValid && !isIncomplete ? (
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle className="w-6 h-6" />
                <span className="font-medium">Valid</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <AlertTriangle className="w-6 h-6" />
                <span className="font-medium">
                  {isIncomplete ? 'Incomplete' : 'Invalid'}
                </span>
              </div>
            )}
            {isIncomplete && (
              <div className="text-xs text-orange-600 text-center">
                {percentageAllocated.toFixed(1)}% allocated
              </div>
            )}
          </div>
        </div>

        {/* Error Messages */}
        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Validation Errors:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-red-600">{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Payment Schedule Progress (Present Value Basis)
            </span>
            <span className={`text-sm font-medium ${
              percentageAllocated >= 95 && percentageAllocated <= 105 
                ? 'text-green-600' 
                : percentageAllocated < 95 
                  ? 'text-orange-600' 
                  : 'text-red-600'
            }`}>
              {percentageAllocated.toFixed(1)}% of Deal Value allocated
            </span>
          </div>
          <Progress 
            value={Math.min(percentageAllocated, 100)} 
            className={`h-3 ${
              percentageAllocated > 100 ? '[&>div]:bg-red-500' : 
              percentageAllocated < 95 ? '[&>div]:bg-orange-500' : 
              '[&>div]:bg-green-500'
            }`}
          />
          
          {/* Progress Status Messages */}
          {percentageAllocated < 95 && (
            <p className="text-orange-600 text-sm mt-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Payment schedule incomplete - {(100 - percentageAllocated).toFixed(1)}% remaining to allocate
            </p>
          )}
          
          {percentageAllocated > 105 && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Payment schedule exceeds deal value by {(percentageAllocated - 100).toFixed(1)}%
            </p>
          )}
          
          {percentageAllocated >= 95 && percentageAllocated <= 105 && (
            <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Payment schedule is properly balanced
            </p>
          )}
          
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600">
              <strong>Debug Info:</strong> Deal Value (PV): {formatCurrency(totalNPV)} | 
              Total Payments (FV): {formatCurrency(totalAmount)} | 
              Total PV of Payments: {formatCurrency(totalPresentValue)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentScheduleSummary;
