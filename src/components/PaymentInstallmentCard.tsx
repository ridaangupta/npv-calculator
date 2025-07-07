import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
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

const PaymentInstallmentCard: React.FC<PaymentInstallmentCardProps> = memo(({
  installment,
  totalNPV,
  onUpdateAmount,
  onUpdatePercentage,
  onUpdateDate,
  onRemove
}) => {
  const { formatCurrency } = useCurrency();
  
  // Combined state for better performance
  const [editState, setEditState] = useState({
    amountValue: installment.amountDue > 0 ? installment.amountDue.toString() : '',
    percentageValue: installment.percentageOfDeal > 0 ? installment.percentageOfDeal.toString() : '',
    dateValue: format(installment.paymentDate, 'dd/MM/yyyy'),
    isAmountFocused: false,
    isPercentageFocused: false,
    isDateFocused: false,
    isCalendarOpen: false
  });
  
  const amountInputRef = useRef<HTMLInputElement>(null);
  const percentageInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Single useEffect to handle all external updates
  useEffect(() => {
    setEditState(prev => ({
      ...prev,
      amountValue: prev.isAmountFocused ? prev.amountValue : (installment.amountDue > 0 ? installment.amountDue.toString() : ''),
      percentageValue: prev.isPercentageFocused ? prev.percentageValue : (installment.percentageOfDeal > 0 ? installment.percentageOfDeal.toString() : ''),
      dateValue: prev.isDateFocused ? prev.dateValue : format(installment.paymentDate, 'dd/MM/yyyy')
    }));
  }, [installment.amountDue, installment.percentageOfDeal, installment.paymentDate]);

  // Memoized handlers for better performance
  const handleAmountFocus = useCallback(() => {
    setEditState(prev => ({
      ...prev,
      isAmountFocused: true,
      amountValue: installment.amountDue > 0 ? installment.amountDue.toString() : ''
    }));
  }, [installment.amountDue]);

  const handleAmountBlur = useCallback(() => {
    const amount = parseFloat(editState.amountValue) || 0;
    setEditState(prev => ({ ...prev, isAmountFocused: false }));
    onUpdateAmount(installment.id, amount);
  }, [editState.amountValue, installment.id, onUpdateAmount]);

  const handleAmountChange = useCallback((value: string) => {
    // Allow empty string or valid number format
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setEditState(prev => ({ ...prev, amountValue: value }));
    }
  }, []);

  const handlePercentageFocus = useCallback(() => {
    setEditState(prev => ({
      ...prev,
      isPercentageFocused: true,
      percentageValue: installment.percentageOfDeal > 0 ? installment.percentageOfDeal.toString() : ''
    }));
  }, [installment.percentageOfDeal]);

  const handlePercentageBlur = useCallback(() => {
    const percentage = parseFloat(editState.percentageValue) || 0;
    setEditState(prev => ({ ...prev, isPercentageFocused: false }));
    onUpdatePercentage(installment.id, Math.min(100, Math.max(0, percentage)));
  }, [editState.percentageValue, installment.id, onUpdatePercentage]);

  const handlePercentageChange = useCallback((value: string) => {
    // Allow empty string or valid number format with up to 2 decimal places
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setEditState(prev => ({ ...prev, percentageValue: value }));
    }
  }, []);

  const handleDateFocus = useCallback(() => {
    setEditState(prev => ({ ...prev, isDateFocused: true }));
  }, []);

  const handleDateBlur = useCallback(() => {
    const parsedDate = parse(editState.dateValue, 'dd/MM/yyyy', new Date());
    setEditState(prev => ({ ...prev, isDateFocused: false }));
    if (isValid(parsedDate)) {
      onUpdateDate(installment.id, parsedDate);
    } else {
      setEditState(prev => ({ ...prev, dateValue: format(installment.paymentDate, 'dd/MM/yyyy') }));
    }
  }, [editState.dateValue, installment.id, installment.paymentDate, onUpdateDate]);

  const handleDateChange = useCallback((value: string) => {
    const cleanValue = value.replace(/[^\d/]/g, '');
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
    if (formattedValue.length <= 10) {
      setEditState(prev => ({ ...prev, dateValue: formattedValue }));
    }
  }, []);

  const handleCalendarSelect = useCallback((date: Date | undefined) => {
    if (date) {
      onUpdateDate(installment.id, date);
      setEditState(prev => ({ ...prev, isCalendarOpen: false }));
    }
  }, [installment.id, onUpdateDate]);

  // Memoized display values
  const amountDisplayValue = editState.isAmountFocused 
    ? editState.amountValue 
    : (installment.amountDue > 0 ? installment.amountDue.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '');

  const percentageDisplayValue = editState.isPercentageFocused 
    ? editState.percentageValue 
    : (installment.percentageOfDeal > 0 ? installment.percentageOfDeal.toFixed(1) : '');

  const dateDisplayValue = editState.isDateFocused 
    ? editState.dateValue 
    : format(installment.paymentDate, 'dd/MM/yyyy');

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
                value={dateDisplayValue}
                onChange={(e) => handleDateChange(e.target.value)}
                onFocus={handleDateFocus}
                onBlur={handleDateBlur}
                className="h-12 text-base font-medium"
              />
              <Popover open={editState.isCalendarOpen} onOpenChange={(open) => setEditState(prev => ({ ...prev, isCalendarOpen: open }))}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-10"
                    onClick={() => setEditState(prev => ({ ...prev, isCalendarOpen: true }))}
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
                value={amountDisplayValue}
                onChange={(e) => handleAmountChange(e.target.value)}
                onFocus={handleAmountFocus}
                onBlur={handleAmountBlur}
                className="h-12 text-base font-medium"
              />
              {!editState.isAmountFocused && installment.amountDue > 0 && (
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
                  type="text"
                  placeholder="Enter percentage"
                  value={percentageDisplayValue}
                  onChange={(e) => handlePercentageChange(e.target.value)}
                  onFocus={handlePercentageFocus}
                  onBlur={handlePercentageBlur}
                  className="h-12 text-base font-medium pr-8"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                  %
                </span>
              </div>
              {!editState.isPercentageFocused && installment.percentageOfDeal > 0 && (
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
});

export default PaymentInstallmentCard;
