import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Calendar } from 'lucide-react';

interface PaymentTypeSelectorProps {
  paymentType: 'normal' | 'custom';
  onPaymentTypeChange: (value: 'normal' | 'custom') => void;
}

const PaymentTypeSelector: React.FC<PaymentTypeSelectorProps> = ({
  paymentType,
  onPaymentTypeChange
}) => {
  return (
    <Card className="shadow-sm border bg-white/60 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700">
            Payment Structure
          </Label>
          <RadioGroup 
            value={paymentType} 
            onValueChange={onPaymentTypeChange}
            className="space-y-3"
          >
            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="normal" id="normal" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="normal" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  Normal Payment
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Standard lease payment calculation with automatic schedule generation
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="custom" id="custom" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="custom" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  Custom Payment Schedule
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Define your own payment schedule with specific amounts and dates
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentTypeSelector;