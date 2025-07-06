
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import PaymentScheduleActions from './PaymentScheduleActions';

interface PaymentScheduleHeaderProps {
  onAddInstallment: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const PaymentScheduleHeader: React.FC<PaymentScheduleHeaderProps> = ({
  onAddInstallment,
  isExpanded,
  onToggleExpanded
}) => {
  return (
    <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <CardTitle className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Custom Payment Schedule
        </span>
        <PaymentScheduleActions
          onAddInstallment={onAddInstallment}
          isExpanded={isExpanded}
          onToggleExpanded={onToggleExpanded}
        />
      </CardTitle>
    </CardHeader>
  );
};

export default PaymentScheduleHeader;
