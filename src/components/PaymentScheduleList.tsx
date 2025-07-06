
import React from 'react';
import { PaymentInstallment } from '@/types/PaymentSchedule';
import PaymentInstallmentCard from './PaymentInstallmentCard';

interface PaymentScheduleListProps {
  installments: PaymentInstallment[];
  totalNPV: number;
  onUpdateAmount: (id: string, amount: number) => void;
  onUpdatePercentage: (id: string, percentage: number) => void;
  onUpdateDate: (id: string, date: Date) => void;
  onRemove: (id: string) => void;
}

const PaymentScheduleList: React.FC<PaymentScheduleListProps> = ({
  installments,
  totalNPV,
  onUpdateAmount,
  onUpdatePercentage,
  onUpdateDate,
  onRemove
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-800">
          Payment Installments ({installments.length})
        </h4>
      </div>
      
      {installments.map((installment) => (
        <PaymentInstallmentCard
          key={installment.id}
          installment={installment}
          totalNPV={totalNPV}
          onUpdateAmount={onUpdateAmount}
          onUpdatePercentage={onUpdatePercentage}
          onUpdateDate={onUpdateDate}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default PaymentScheduleList;
