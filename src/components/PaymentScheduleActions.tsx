
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
    <div className="flex items-center gap-2">
      <Button
        onClick={onAddInstallment}
        size="sm"
        variant="ghost"
        className="text-white hover:bg-white/20"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add Payment
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleExpanded}
        className="text-white hover:bg-white/20"
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
