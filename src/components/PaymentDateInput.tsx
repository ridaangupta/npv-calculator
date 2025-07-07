
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface PaymentDateInputProps {
  paymentDate: Date;
  onUpdateDate: (date: Date) => void;
}

const PaymentDateInput: React.FC<PaymentDateInputProps> = ({
  paymentDate,
  onUpdateDate
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateInputChange = (value: string) => {
    const newDate = new Date(value);
    if (!isNaN(newDate.getTime())) {
      onUpdateDate(newDate);
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      onUpdateDate(date);
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Payment Date
      </label>
      <div className="space-y-2">
        <Input
          type="date"
          value={format(paymentDate, 'yyyy-MM-dd')}
          onChange={(e) => handleDateInputChange(e.target.value)}
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
