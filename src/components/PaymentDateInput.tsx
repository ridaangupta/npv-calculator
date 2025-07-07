
import React from 'react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

interface PaymentDateInputProps {
  paymentDate: Date;
  onUpdateDate: (date: Date) => void;
}

const PaymentDateInput: React.FC<PaymentDateInputProps> = ({
  paymentDate,
  onUpdateDate
}) => {
  const handleDateInputChange = (value: string) => {
    const newDate = new Date(value);
    if (!isNaN(newDate.getTime())) {
      onUpdateDate(newDate);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Payment Date
      </label>
      <Input
        type="date"
        value={format(paymentDate, 'yyyy-MM-dd')}
        onChange={(e) => handleDateInputChange(e.target.value)}
        className="h-12 text-base font-medium"
      />
    </div>
  );
};

export default PaymentDateInput;
