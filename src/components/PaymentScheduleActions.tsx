
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface PaymentScheduleActionsProps {
  onAddInstallment: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const PaymentScheduleActions: React.FC<PaymentScheduleActionsProps> = ({
  onAddInstallment,
  isExpanded,
  onToggleExpanded
}) => {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Button
        onClick={onAddInstallment}
        size="sm"
        variant="ghost"
        className="text-white hover:bg-white/20 min-h-[36px] px-2 sm:px-3"
      >
        <Plus className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">Add Payment</span>
        <span className="sm:hidden">Add</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleExpanded}
        className="text-white hover:bg-white/20 min-h-[36px] px-2"
        aria-label={isExpanded ? "Collapse payment schedule" : "Expand payment schedule"}
      >
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

export default PaymentScheduleActions;
