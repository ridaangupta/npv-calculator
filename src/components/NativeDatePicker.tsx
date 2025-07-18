import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface NativeDatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// Utility functions for date conversion
const dateToInputValue = (date: Date | undefined): string => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

const inputValueToDate = (value: string): Date | undefined => {
  if (!value) return undefined;
  const date = new Date(value + 'T00:00:00');
  return isNaN(date.getTime()) ? undefined : date;
};

export const NativeDatePicker = ({
  date,
  onDateChange,
  minDate,
  maxDate,
  placeholder = "Select date",
  className,
  disabled = false
}: NativeDatePickerProps) => {
  return (
    <Input
      type="date"
      value={dateToInputValue(date)}
      onChange={(e) => onDateChange(inputValueToDate(e.target.value))}
      min={minDate ? dateToInputValue(minDate) : undefined}
      max={maxDate ? dateToInputValue(maxDate) : undefined}
      placeholder={placeholder}
      disabled={disabled}
      className={cn("w-full", className)}
    />
  );
};