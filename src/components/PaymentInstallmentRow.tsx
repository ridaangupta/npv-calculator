import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { PaymentInstallment } from '@/types/PaymentSchedule';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PaymentInstallmentRowProps {
  installment: PaymentInstallment;
  totalNPV: number;
  onUpdateAmount: (id: string, amount: number) => void;
  onUpdatePercentage: (id: string, percentage: number) => void;
  onUpdateDate: (id: string, date: Date) => void;
  onRemove: (id: string) => void;
}

const PaymentInstallmentRow: React.FC<PaymentInstallmentRowProps> = ({
  installment,
  totalNPV,
  onUpdateAmount,
  onUpdatePercentage,
  onUpdateDate,
  onRemove
}) => {
  const { formatCurrency } = useCurrency();

  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    onUpdateAmount(installment.id, amount);
  };

  const handlePercentageChange = (value: string) => {
    const percentage = parseFloat(value) || 0;
    onUpdatePercentage(installment.id, percentage);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg border">
      {/* Payment Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Payment Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal min-h-[40px]"
            >
              <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">{format(installment.paymentDate, 'MMM dd, yyyy')}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={installment.paymentDate}
              onSelect={(date) => date && onUpdateDate(installment.id, date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Percentage */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">% of Deal</label>
        <div className="relative">
          <Input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={installment.percentageOfDeal.toFixed(1)}
            onChange={(e) => handlePercentageChange(e.target.value)}
            className="pr-8 min-h-[40px]"
            inputMode="decimal"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
        </div>
      </div>

      {/* Amount Due */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Amount Due</label>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={installment.amountDue.toFixed(2)}
          onChange={(e) => handleAmountChange(e.target.value)}
          className="min-h-[40px]"
          inputMode="decimal"
        />
      </div>

      {/* Formatted Amount Display */}
      <div className="space-y-2 lg:block hidden">
        <label className="text-sm font-medium text-gray-700">Formatted Amount</label>
        <div className="p-2 bg-white rounded border text-sm font-medium text-green-600 min-h-[40px] flex items-center">
          {formatCurrency(installment.amountDue)}
        </div>
      </div>

      {/* Remove Button */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Action</label>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemove(installment.id)}
          className="w-full min-h-[40px]"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Remove</span>
          <span className="sm:hidden">Del</span>
        </Button>
      </div>
    </div>
  );
};

export default PaymentInstallmentRow;