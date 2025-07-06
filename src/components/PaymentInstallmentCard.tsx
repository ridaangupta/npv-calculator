import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
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
  
  // Separate state for editing vs display
  const [amountEditValue, setAmountEditValue] = useState(installment.amountDue.toString());
  const [percentageEditValue, setPercentageEditValue] = useState(installment.percentageOfDeal.toString());
  const [dateEditValue, setDateEditValue] = useState(format(installment.paymentDate, 'dd/MM/yyyy'));
  const [isAmountFocused, setIsAmountFocused] = useState(false);
  const [isPercentageFocused, setIsPercentageFocused] = useState(false);
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const amountInputRef = useRef<HTMLInputElement>(null);
  const percentageInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Update edit values when installment changes (from external updates)
  useEffect(() => {
    if (!isAmountFocused) {
      setAmountEditValue(installment.amountDue.toString());
    }
  }, [installment.amountDue, isAmountFocused]);

  useEffect(() => {
    if (!isPercentageFocused) {
      setPercentageEditValue(installment.percentageOfDeal.toString());
    }
  }, [installment.percentageOfDeal, isPercentageFocused]);

  useEffect(() => {
    if (!isDateFocused) {
      setDateEditValue(format(installment.paymentDate, 'dd/MM/yyyy'));
    }
  }, [installment.paymentDate, isDateFocused]);

  const handleAmountFocus = () => {
    setIsAmountFocused(true);
    setAmountEditValue(installment.amountDue.toString());
  };

  const handleAmountBlur = () => {
    setIsAmountFocused(false);
    const amount = parseFloat(amountEditValue) || 0;
    onUpdateAmount(installment.id, amount);
  };

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    setAmountEditValue(cleanValue);
  };

  const handlePercentageFocus = () => {
    setIsPercentageFocused(true);
    setPercentageEditValue(installment.percentageOfDeal.toString());
  };

  const handlePercentageBlur = () => {
    setIsPercentageFocused(false);
    const percentage = parseFloat(percentageEditValue) || 0;
    onUpdatePercentage(installment.id, Math.min(100, Math.max(0, percentage)));
  };

  const handlePercentageChange = (value: string) => {
    setPercentageEditValue(value);
  };

  const handleDateFocus = () => {
    setIsDateFocused(true);
  };

  const handleDateBlur = () => {
    setIsDateFocused(false);
    // Try to parse the entered date
    const parsedDate = parse(dateEditValue, 'dd/MM/yyyy', new Date());
    if (isValid(parsedDate)) {
      onUpdateDate(installment.id, parsedDate);
    } else {
      // Reset to current date if invalid
      setDateEditValue(format(installment.paymentDate, 'dd/MM/yyyy'));
    }
  };

  const handleDateChange = (value: string) => {
    // Allow only numbers and slashes
    const cleanValue = value.replace(/[^\d/]/g, '');
    // Auto-format as user types
    let formattedValue = cleanValue;
    if (cleanValue.length >= 2 && cleanValue.charAt(2) !== '/') {
      formattedValue = cleanValue.slice(0, 2) + '/' + cleanValue.slice(2);
    }
    if (cleanValue.length >= 5 && cleanValue.charAt(5) !== '/') {
      const parts = formattedValue.split('/');
      if (parts.length >= 2) {
        formattedValue = parts[0] + '/' + parts[1] + '/' + cleanValue.slice(5);
      }
    }
    // Limit to dd/mm/yyyy format
    if (formattedValue.length <= 10) {
      setDateEditValue(formattedValue);
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      onUpdateDate(installment.id, date);
      setIsCalendarOpen(false);
    }
  };

  const getAmountDisplayValue = () => {
    if (isAmountFocused) {
      return amountEditValue;
    }
    return installment.amountDue.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const getPercentageDisplayValue = () => {
    if (isPercentageFocused) {
      return percentageEditValue;
    }
    return installment.percentageOfDeal.toFixed(1);
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
            <div className="space-y-2">
              <Input
                ref={dateInputRef}
                type="text"
                placeholder="dd/mm/yyyy"
                value={isDateFocused ? dateEditValue : format(installment.paymentDate, 'dd/MM/yyyy')}
                onChange={(e) => handleDateChange(e.target.value)}
                onFocus={handleDateFocus}
                onBlur={handleDateBlur}
                className="h-12 text-base font-medium"
              />
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-10"
                    onClick={() => setIsCalendarOpen(true)}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(installment.paymentDate, 'MMM dd, yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={installment.paymentDate}
                    onSelect={handleCalendarSelect}
                    initialFocus
                    defaultMonth={installment.paymentDate}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Amount Due */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Amount Due
            </label>
            <div className="space-y-2">
              <Input
                ref={amountInputRef}
                type="text"
                placeholder="Enter amount"
                value={getAmountDisplayValue()}
                onChange={(e) => handleAmountChange(e.target.value)}
                onFocus={handleAmountFocus}
                onBlur={handleAmountBlur}
                className="h-12 text-base font-medium"
              />
              {!isAmountFocused && (
                <div className="text-xs text-green-600 font-medium px-2">
                  {formatCurrency(installment.amountDue)}
                </div>
              )}
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
                  ref={percentageInputRef}
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="0.0"
                  value={getPercentageDisplayValue()}
                  onChange={(e) => handlePercentageChange(e.target.value)}
                  onFocus={handlePercentageFocus}
                  onBlur={handlePercentageBlur}
                  className="h-12 text-base font-medium pr-8"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                  %
                </span>
              </div>
              {!isPercentageFocused && (
                <div className="text-xs text-blue-600 font-medium px-2">
                  {installment.percentageOfDeal.toFixed(2)}% of total
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentInstallmentCard;
