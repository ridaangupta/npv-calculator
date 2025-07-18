import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign } from 'lucide-react';

interface PaymentMethodSelectorProps {
  selectedMethod: 'standard' | 'custom';
  onMethodChange: (method: 'standard' | 'custom') => void;
  leaseValue: number;
  totalHectares: number;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  leaseValue,
  totalHectares
}) => {
  const totalInvestment = leaseValue * totalHectares;

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Calendar className="w-5 h-5" />
          Payment Schedule Options
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant={selectedMethod === 'standard' ? 'default' : 'outline'}
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={() => onMethodChange('standard')}
          >
            <DollarSign className="w-6 h-6" />
            <div className="text-center">
              <div className="font-medium">Standard Annual Payments</div>
              <div className="text-sm opacity-75">Use calculated lease structure</div>
            </div>
          </Button>
          
          <Button
            variant={selectedMethod === 'custom' ? 'default' : 'outline'}
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={() => onMethodChange('custom')}
          >
            <Calendar className="w-6 h-6" />
            <div className="text-center">
              <div className="font-medium">Custom Payment Schedule</div>
              <div className="text-sm opacity-75">Create custom installment plan</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;