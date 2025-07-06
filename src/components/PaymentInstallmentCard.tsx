
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { PaymentInstallment } from '@/types/PaymentSchedule';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PaymentInstallmentCardProps {
  installment: PaymentInstallment;
  totalNPV: number;
  onUpdateAmount: (id: string, amount: number) => void;
  onUpdatePercentage: (id: string, percentage: number) => void;
  onUpdateDate: (id: string, date: Date) => void;
  onRemove: (id: string) => void;
}

const PaymentInstallmentCard: React.FC<PaymentInstallmentCardProps> = ({
  installment,
  totalNPV,
  onUpdateAmount,
  onUpdatePercentage,
  onUpdateDate,
  onRemove
}) => {
  const { formatCurrency } = useCurrency();

  const handleAmountChange = (value: string) => {
    const cleanValue = value.replace(/[^\d.]/g, '');
    const amount = parseFloat(cleanValue) || 0;
    onUpdateAmount(installment.id, amount);
  };

  const handlePercentageChange = (value: string) => {
    const percentage = parseFloat(value) || 0;
    onUpdatePercentage(installment.id, percentage);
  };

  const formatNumberInput = (value: number) => {
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  return (
    <Card className="relative bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-semibold text-gray-800">
            {installment.description || `Payment ${installment.id}`}
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(installment.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payment Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Payment Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-12"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(installment.paymentDate, 'MMM dd, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={installment.paymentDate}
                  onSelect={(date) => date && onUpdateDate(installment.id, date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Amount Due */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Amount Due
            </label>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter amount"
                value={formatNumberInput(installment.amountDue)}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="h-12 text-base font-medium"
              />
              <div className="text-xs text-green-600 font-medium px-2">
                {formatCurrency(installment.amountDue)}
              </div>
            </div>
          </div>

          {/* Percentage */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Percentage of Deal
            </label>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="0.0"
                  value={installment.percentageOfDeal.toFixed(1)}
                  onChange={(e) => handlePercentageChange(e.target.value)}
                  className="h-12 text-base font-medium pr-8"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                  %
                </span>
              </div>
              <div className="text-xs text-blue-600 font-medium px-2">
                {installment.percentageOfDeal.toFixed(2)}% of total
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentInstallmentCard;
