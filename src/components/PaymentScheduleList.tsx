
import React from 'react';
import { PaymentInstallment } from '@/types/PaymentSchedule';
import PaymentScheduleListMemo from './PaymentScheduleListMemo';

interface PaymentScheduleListProps {
  installments: PaymentInstallment[];
  totalNPV: number;
  onUpdateAmount: (id: string, amount: number) => void;
  onUpdatePercentage: (id: string, percentage: number) => void;
  onUpdateDate: (id: string, date: Date) => void;
  onRemove: (id: string) => void;
}

const PaymentScheduleList: React.FC<PaymentScheduleListProps> = (props) => {
  return <PaymentScheduleListMemo {...props} />;
};

export default PaymentScheduleList;
