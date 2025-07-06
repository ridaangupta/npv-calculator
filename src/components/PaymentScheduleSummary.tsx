
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { PaymentSchedule } from '@/types/PaymentSchedule';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PaymentScheduleSummaryProps {
  totalNPV: number;
  paymentSchedule: PaymentSchedule;
  totalAmount: number;
  totalPercentage: number;
  remainingAmount: number;
  isValid: boolean;
}

const PaymentScheduleSummary: React.FC<PaymentScheduleSummaryProps> = ({
  totalNPV,
  totalAmount,
  totalPercentage,
  remainingAmount,
  isValid
}) => {
  const { formatCurrency } = useCurrency();

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Total Available</div>
            <div className="text-xl font-bold text-blue-700">
              {formatCurrency(totalNPV)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Scheduled</div>
            <div className="text-xl font-bold text-green-700">
              {formatCurrency(totalAmount)}
            </div>
            <div className="text-xs text-gray-500">
              {totalPercentage.toFixed(1)}%
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Remaining</div>
            <div className="text-xl font-bold text-orange-700">
              {formatCurrency(remainingAmount)}
            </div>
            <div className="text-xs text-gray-500">
              {(100 - totalPercentage).toFixed(1)}%
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
              Payment Schedule Progress
            </span>
            <span className="text-sm text-gray-600">
              {totalPercentage.toFixed(1)}% of total
            </span>
          </div>
          <Progress 
            value={Math.min(totalPercentage, 100)} 
            className="h-3"
          />
          {!isValid && (
            <p className="text-red-500 text-sm mt-2">
              Total scheduled payments exceed available amount
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentScheduleSummary;
