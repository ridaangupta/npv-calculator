import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';

interface PaymentDateInputProps {
  paymentDate: Date;
  onUpdateDate: (date: Date) => void;
}

const PaymentDateInput: React.FC<PaymentDateInputProps> = ({
  paymentDate,
  onUpdateDate
}) => {
  const [dateValue, setDateValue] = useState(format(paymentDate, 'dd/MM/yyyy'));
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDateFocused) {
      setDateValue(format(paymentDate, 'dd/MM/yyyy'));
    }
  }, [paymentDate, isDateFocused]);

  const handleDateFocus = useCallback(() => {
    setIsDateFocused(true);
  }, []);

  const handleDateBlur = useCallback(() => {
    const parsedDate = parse(dateValue, 'dd/MM/yyyy', new Date());
    setIsDateFocused(false);
    if (isValid(parsedDate)) {
      onUpdateDate(parsedDate);
    } else {
      setDateValue(format(paymentDate, 'dd/MM/yyyy'));
    }
  }, [dateValue, paymentDate, onUpdateDate]);

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
      setDateValue(formattedValue);
    }
  }, []);

  const handleCalendarSelect = useCallback((date: Date | undefined) => {
    if (date) {
      onUpdateDate(date);
      setIsCalendarOpen(false);
    }
  }, [onUpdateDate]);

  const dateDisplayValue = isDateFocused ? dateValue : format(paymentDate, 'dd/MM/yyyy');

  return (
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
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal h-10"
              onClick={() => setIsCalendarOpen(true)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(paymentDate, 'MMM dd, yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={paymentDate}
              onSelect={handleCalendarSelect}
              initialFocus
              defaultMonth={paymentDate}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default PaymentDateInput;