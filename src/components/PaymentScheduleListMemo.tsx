import React, { memo } from 'react';
import { PaymentInstallment } from '@/types/PaymentSchedule';
import PaymentInstallmentCard from './PaymentInstallmentCard';

interface PaymentScheduleListProps {
  installments: PaymentInstallment[];
  totalValue: number;
  onUpdateAmount: (id: string, amount: number) => void;
  onUpdatePercentage: (id: string, percentage: number) => void;
  onUpdateDate: (id: string, date: Date) => void;
  onRemove: (id: string) => void;
  leaseStartDate: Date;
  discountRate: number;
}

const PaymentScheduleListMemo: React.FC<PaymentScheduleListProps> = memo(({
  installments,
  totalValue,
  onUpdateAmount,
  onUpdatePercentage,
  onUpdateDate,
  onRemove,
  leaseStartDate,
  discountRate
}) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-base sm:text-lg font-semibold text-gray-800">
          Payment Installments ({installments.length})
        </h4>
      </div>
      
      {installments.map((installment) => (
        <PaymentInstallmentCard
          key={installment.id}
          installment={installment}
          totalValue={totalValue}
          onUpdateAmount={onUpdateAmount}
          onUpdatePercentage={onUpdatePercentage}
          onUpdateDate={onUpdateDate}
          onRemove={onRemove}
          leaseStartDate={leaseStartDate}
          discountRate={discountRate}
        />
      ))}
    </div>
  );
});

PaymentScheduleListMemo.displayName = 'PaymentScheduleListMemo';

export default PaymentScheduleListMemo;