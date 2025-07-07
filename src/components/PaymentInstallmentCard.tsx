import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { PaymentInstallment } from '@/types/PaymentSchedule';
import PaymentAmountInput from './PaymentAmountInput';
import PaymentPercentageInput from './PaymentPercentageInput';
import PaymentDateInput from './PaymentDateInput';
import PaymentTimeDisplay from './PaymentTimeDisplay';

interface PaymentInstallmentCardProps {
  installment: PaymentInstallment;
  totalNPV: number;
  onUpdateAmount: (id: string, amount: number) => void;
  onUpdatePercentage: (id: string, percentage: number) => void;
  onUpdateDate: (id: string, date: Date) => void;
  onRemove: (id: string) => void;
  leaseStartDate: Date;
  discountRate: number;
}

const PaymentInstallmentCard: React.FC<PaymentInstallmentCardProps> = memo(({
  installment,
  totalNPV,
  onUpdateAmount,
  onUpdatePercentage,
  onUpdateDate,
  onRemove,
  leaseStartDate,
  discountRate
}) => {

  return (
    <Card className="relative bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-semibold text-gray-800">
            {installment.description || `Payment ${installment.id}`}
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(installment.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <PaymentDateInput
            paymentDate={installment.paymentDate}
            onUpdateDate={(date) => onUpdateDate(installment.id, date)}
          />

          <PaymentAmountInput
            amountDue={installment.amountDue}
            presentValue={installment.presentValue}
            onUpdateAmount={(amount) => onUpdateAmount(installment.id, amount)}
          />

          <PaymentPercentageInput
            percentageOfDeal={installment.percentageOfDeal}
            onUpdatePercentage={(percentage) => onUpdatePercentage(installment.id, percentage)}
          />

          <PaymentTimeDisplay
            leaseStartDate={leaseStartDate}
            paymentDate={installment.paymentDate}
          />
        </div>
      </CardContent>
    </Card>
  );
});

export default PaymentInstallmentCard;
