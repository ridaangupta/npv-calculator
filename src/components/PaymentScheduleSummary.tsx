
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
}

const PaymentScheduleSummary: React.FC<PaymentScheduleSummaryProps> = ({
  totalNPV,
  totalAmount,
  totalPercentage,
  remainingAmount,
  isValid,
  totalPresentValue
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

          <div className="flex items-center justify-center">
            {isValid ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                <span className="font-medium">Valid</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                <span className="font-medium">Invalid</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Payment Schedule Progress (Present Value Basis)
            </span>
            <span className="text-sm text-gray-600">
              {((totalPresentValue / totalNPV) * 100).toFixed(1)}% of Deal Value allocated
            </span>
          </div>
          <Progress 
            value={Math.min((totalPresentValue / totalNPV) * 100, 100)} 
            className="h-3"
          />
          {!isValid && (
            <p className="text-red-500 text-sm mt-2">
              Total present value of scheduled payments exceeds available deal value
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
