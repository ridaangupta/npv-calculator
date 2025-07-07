import React from 'react';
import { Clock } from 'lucide-react';
import { calculateDaysToPayment } from '@/utils/timeValueCalculations';

interface PaymentTimeDisplayProps {
  leaseStartDate: Date;
  paymentDate: Date;
}

const PaymentTimeDisplay: React.FC<PaymentTimeDisplayProps> = ({
  leaseStartDate,
  paymentDate
}) => {
  const daysToPayment = calculateDaysToPayment(leaseStartDate, paymentDate);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Time to Payment
      </label>
      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
        <Clock className="w-4 h-4 text-gray-600" />
        <div className="text-sm">
          <div className="font-medium text-gray-800">
            {daysToPayment} days
          </div>
          <div className="text-xs text-gray-600">
            {(daysToPayment / 365.25).toFixed(1)} years
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTimeDisplay;