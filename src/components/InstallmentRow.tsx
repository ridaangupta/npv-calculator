import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeDatePicker } from "./NativeDatePicker";
import { InstallmentInput } from "@/hooks/useInstallmentManager";

interface InstallmentRowProps {
  installment: InstallmentInput;
  index: number;
  leaseStartDate: Date | undefined;
  onUpdate: (id: string, updates: Partial<Omit<InstallmentInput, 'id'>>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export const InstallmentRow = ({
  installment,
  index,
  leaseStartDate,
  onUpdate,
  onRemove,
  canRemove
}: InstallmentRowProps) => {
  return (
    <div className="space-y-3 md:space-y-0">
      {/* Mobile Layout */}
      <div className="md:hidden space-y-3 p-3 border rounded-lg bg-card">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Payment #{index + 1}
          </span>
          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(installment.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              title="Remove Payment"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove Payment</span>
            </Button>
          )}
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Date</label>
            <NativeDatePicker
              date={installment.paymentDate}
              onDateChange={(date) => date && onUpdate(installment.id, { paymentDate: date })}
              minDate={leaseStartDate}
              placeholder="Select date"
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Percentage</label>
              <Input
                type="number"
                value={installment.percentage}
                onChange={(e) => onUpdate(installment.id, { percentage: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                min="0"
                max="100"
                step="0.01"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Display</label>
              <div className="mt-1 h-10 flex items-center px-3 bg-muted rounded-md text-sm">
                {installment.percentage.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-12 gap-4 items-center p-3 border rounded-lg">
        <div className="col-span-1 text-sm font-medium">
          {index + 1}
        </div>
        
        <div className="col-span-5">
          <NativeDatePicker
            date={installment.paymentDate}
            onDateChange={(date) => date && onUpdate(installment.id, { paymentDate: date })}
            minDate={leaseStartDate}
            placeholder="Select payment date"
          />
        </div>
        
        <div className="col-span-3">
          <Input
            type="number"
            value={installment.percentage}
            onChange={(e) => onUpdate(installment.id, { percentage: parseFloat(e.target.value) || 0 })}
            placeholder="Percentage"
            min="0"
            max="100"
            step="0.01"
          />
        </div>
        
        <div className="col-span-2 text-sm text-muted-foreground">
          {installment.percentage.toFixed(2)}%
        </div>
        
        <div className="col-span-1">
          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(installment.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              title="Remove Payment"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove Payment</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};