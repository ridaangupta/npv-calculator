import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import CurrencyInput from './CurrencyInput';
import DiscountRateInput from './DiscountRateInput';
import CashFlowConfiguration from './CashFlowConfiguration';
import CashFlowPreview from './CashFlowPreview';
import HectaresInput from './HectaresInput';
import ValidationSummary from './ValidationSummary';
import useFormValidation from '@/hooks/useFormValidation';

interface CashFlow {
  id: string;
  year: number;
  amount: number;
}

interface InputSectionProps {
  discountRateInput: string;
  baseCashFlowInput: string;
  increaseValueInput: string;
  increaseType: 'amount' | 'percent';
  increaseFrequency: number;
  timePeriodInput: string;
  totalHectaresInput: string;
  paymentTiming: 'beginning' | 'middle' | 'end';
  cashFlows: CashFlow[];
  leaseValue: number;
  totalValue: number;
  discountRate: number;
  onDiscountRateChange: (value: string) => void;
  onBaseCashFlowChange: (value: string) => void;
  onIncreaseValueChange: (value: string) => void;
  onIncreaseTypeChange: (value: 'amount' | 'percent') => void;
  onIncreaseFrequencyChange: (value: number) => void;
  onTimePeriodChange: (value: string) => void;
  onTotalHectaresChange: (value: string) => void;
  onPaymentTimingChange: (value: 'beginning' | 'middle' | 'end') => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  discountRateInput,
  baseCashFlowInput,
  increaseValueInput,
  increaseType,
  increaseFrequency,
  timePeriodInput,
  totalHectaresInput,
  paymentTiming,
  cashFlows,
  leaseValue,
  totalValue,
  discountRate,
  onDiscountRateChange,
  onBaseCashFlowChange,
  onIncreaseValueChange,
  onIncreaseTypeChange,
  onIncreaseFrequencyChange,
  onTimePeriodChange,
  onTotalHectaresChange,
  onPaymentTimingChange
}) => {
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const handleFieldBlur = (fieldName: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldName));
  };

  const validation = useFormValidation({
    discountRateInput,
    baseCashFlowInput,
    increaseValueInput,
    increaseType,
    timePeriodInput,
    totalHectaresInput,
    paymentTiming,
    totalValue,
    cashFlows,
    leaseValue,
    touchedFields
  });

  const getCurrentStepFromError = (field: string) => {
    if (field === 'discountRate') return 'Discount Rate';
    if (field === 'baseCashFlow') return 'Base Cash Flow';
    if (field === 'increaseValue') return 'Increase Value';
    if (field === 'timePeriod') return 'Time Period';
    if (field === 'totalHectares') return 'Total Hectares';
    if (field === 'paymentTiming') return 'Payment Timing';
    return 'Unknown';
  };

  const totalSteps = 6;

  return (
    <div className="space-y-6">
      <ValidationSummary 
        validation={validation}
        totalSteps={totalSteps}
        getCurrentStepFromError={getCurrentStepFromError}
      />
      
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6 space-y-6">
          <DiscountRateInput
            value={discountRateInput}
            onChange={onDiscountRateChange}
            onBlur={() => handleFieldBlur('discountRate')}
          />

          <CurrencyInput
            value={baseCashFlowInput}
            onChange={onBaseCashFlowChange}
            onBlur={() => handleFieldBlur('baseCashFlow')}
          />

          <CashFlowConfiguration
            increaseValueInput={increaseValueInput}
            onIncreaseValueChange={onIncreaseValueChange}
            increaseType={increaseType}
            onIncreaseTypeChange={onIncreaseTypeChange}
            increaseFrequency={increaseFrequency}
            onIncreaseFrequencyChange={onIncreaseFrequencyChange}
            timePeriodInput={timePeriodInput}
            onTimePeriodChange={onTimePeriodChange}
            paymentTiming={paymentTiming}
            onPaymentTimingChange={onPaymentTimingChange}
            onIncreaseValueBlur={() => handleFieldBlur('increaseValue')}
            onTimePeriodBlur={() => handleFieldBlur('timePeriod')}
          />

          <CashFlowPreview
            cashFlows={cashFlows}
          />

          <HectaresInput
            value={totalHectaresInput}
            onChange={onTotalHectaresChange}
            onBlur={() => handleFieldBlur('totalHectares')}
          />
        </CardContent>
      </Card>

      {/* Prevent Incomplete Submissions */}
      {!validation.isValid && (
        <Card className="shadow-lg border-0 bg-red-50/80 backdrop-blur-sm border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Configuration Incomplete</span>
            </div>
            <p className="text-sm text-red-700 mt-2">
              Please resolve all validation errors before proceeding with calculations. 
              Complete configuration progress: {validation.completionPercentage}%
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Custom comparison function for React.memo
const arePropsEqual = (prevProps: InputSectionProps, nextProps: InputSectionProps) => {
  return (
    prevProps.discountRateInput === nextProps.discountRateInput &&
    prevProps.baseCashFlowInput === nextProps.baseCashFlowInput &&
    prevProps.increaseValueInput === nextProps.increaseValueInput &&
    prevProps.increaseType === nextProps.increaseType &&
    prevProps.increaseFrequency === nextProps.increaseFrequency &&
    prevProps.timePeriodInput === nextProps.timePeriodInput &&
    prevProps.totalHectaresInput === nextProps.totalHectaresInput &&
    prevProps.paymentTiming === nextProps.paymentTiming &&
    prevProps.leaseValue === nextProps.leaseValue &&
    prevProps.totalValue === nextProps.totalValue &&
    prevProps.discountRate === nextProps.discountRate &&
    prevProps.cashFlows.length === nextProps.cashFlows.length &&
    prevProps.cashFlows.every((flow, index) => 
      flow.id === nextProps.cashFlows[index]?.id &&
      flow.year === nextProps.cashFlows[index]?.year &&
      flow.amount === nextProps.cashFlows[index]?.amount
    ) &&
    prevProps.onDiscountRateChange === nextProps.onDiscountRateChange &&
    prevProps.onBaseCashFlowChange === nextProps.onBaseCashFlowChange &&
    prevProps.onIncreaseValueChange === nextProps.onIncreaseValueChange &&
    prevProps.onIncreaseTypeChange === nextProps.onIncreaseTypeChange &&
    prevProps.onIncreaseFrequencyChange === nextProps.onIncreaseFrequencyChange &&
    prevProps.onTimePeriodChange === nextProps.onTimePeriodChange &&
    prevProps.onTotalHectaresChange === nextProps.onTotalHectaresChange &&
    prevProps.onPaymentTimingChange === nextProps.onPaymentTimingChange
  );
};

export default React.memo(InputSection, arePropsEqual);