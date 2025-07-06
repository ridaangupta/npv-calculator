
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';

interface PaymentScheduleEmptyProps {
  onAddInstallment: () => void;
}

const PaymentScheduleEmpty: React.FC<PaymentScheduleEmptyProps> = ({
  onAddInstallment
}) => {
  return (
    <Card className="border-dashed border-2 border-gray-300">
      <CardContent className="p-8 text-center">
        <div className="text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Payment Installments</h3>
          <p className="text-sm mb-4">
            Create custom payment installments to structure your upfront payment schedule.
          </p>
          <Button onClick={onAddInstallment} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add First Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentScheduleEmpty;
