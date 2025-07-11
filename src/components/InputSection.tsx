

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CurrencyInput from './CurrencyInput';
import DiscountRateInput from './DiscountRateInput';
import CashFlowConfiguration from './CashFlowConfiguration';
import CashFlowPreview from './CashFlowPreview';
import HectaresInput from './HectaresInput';
import PaymentTypeSelector from './PaymentTypeSelector';
import UpfrontPaymentScheduler from './UpfrontPaymentScheduler';

interface CashFlow {
  id: string;
  year: number;
  amount: number;
}

interface PaymentSchedule {
  installments: any[];
  totalPercentage: number;
  totalAmount: number;
  remainingAmount: number;
  leaseStartDate: Date;
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
  paymentType: 'normal' | 'custom';
  cashFlows: CashFlow[];
  npv: number;
  paymentSchedule: PaymentSchedule;
  discountRate: number;
  onDiscountRateChange: (value: string) => void;
  onBaseCashFlowChange: (value: string) => void;
  onIncreaseValueChange: (value: string) => void;
  onIncreaseTypeChange: (value: 'amount' | 'percent') => void;
  onIncreaseFrequencyChange: (value: number) => void;
  onTimePeriodChange: (value: string) => void;
  onTotalHectaresChange: (value: string) => void;
  onPaymentTimingChange: (value: 'beginning' | 'middle' | 'end') => void;
  onPaymentTypeChange: (value: 'normal' | 'custom') => void;
  onPaymentScheduleChange: (schedule: PaymentSchedule) => void;
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
  paymentType,
  cashFlows,
  npv,
  paymentSchedule,
  discountRate,
  onDiscountRateChange,
  onBaseCashFlowChange,
  onIncreaseValueChange,
  onIncreaseTypeChange,
  onIncreaseFrequencyChange,
  onTimePeriodChange,
  onTotalHectaresChange,
  onPaymentTimingChange,
  onPaymentTypeChange,
  onPaymentScheduleChange
}) => {
  const totalNPV = npv * Number(totalHectaresInput || 1);

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        <CurrencyInput />

        <DiscountRateInput
          discountRate={discountRateInput}
          onDiscountRateChange={onDiscountRateChange}
        />

        <CashFlowConfiguration
          baseCashFlow={baseCashFlowInput}
          increaseValue={increaseValueInput}
          increaseType={increaseType}
          increaseFrequency={increaseFrequency}
          timePeriod={timePeriodInput}
          paymentTiming={paymentTiming}
          onBaseCashFlowChange={onBaseCashFlowChange}
          onIncreaseValueChange={onIncreaseValueChange}
          onIncreaseTypeChange={onIncreaseTypeChange}
          onIncreaseFrequencyChange={onIncreaseFrequencyChange}
          onTimePeriodChange={onTimePeriodChange}
          onPaymentTimingChange={onPaymentTimingChange}
        />

        <CashFlowPreview cashFlows={cashFlows} />

        <HectaresInput
          totalHectares={totalHectaresInput}
          onTotalHectaresChange={onTotalHectaresChange}
        />

        <PaymentTypeSelector
          paymentType={paymentType}
          onPaymentTypeChange={onPaymentTypeChange}
        />

        {paymentType === 'custom' && (
          <UpfrontPaymentScheduler
            totalNPV={totalNPV}
            paymentSchedule={paymentSchedule}
            onUpdateSchedule={onPaymentScheduleChange}
            discountRate={discountRate}
          />
        )}
      </CardContent>
    </Card>
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
    prevProps.paymentType === nextProps.paymentType &&
    prevProps.npv === nextProps.npv &&
    prevProps.discountRate === nextProps.discountRate &&
    prevProps.cashFlows.length === nextProps.cashFlows.length &&
    prevProps.cashFlows.every((flow, index) => 
      flow.id === nextProps.cashFlows[index]?.id &&
      flow.year === nextProps.cashFlows[index]?.year &&
      flow.amount === nextProps.cashFlows[index]?.amount
    ) &&
    prevProps.paymentSchedule.totalPercentage === nextProps.paymentSchedule.totalPercentage &&
    prevProps.paymentSchedule.totalAmount === nextProps.paymentSchedule.totalAmount &&
    prevProps.onDiscountRateChange === nextProps.onDiscountRateChange &&
    prevProps.onBaseCashFlowChange === nextProps.onBaseCashFlowChange &&
    prevProps.onIncreaseValueChange === nextProps.onIncreaseValueChange &&
    prevProps.onIncreaseTypeChange === nextProps.onIncreaseTypeChange &&
    prevProps.onIncreaseFrequencyChange === nextProps.onIncreaseFrequencyChange &&
    prevProps.onTimePeriodChange === nextProps.onTimePeriodChange &&
    prevProps.onTotalHectaresChange === nextProps.onTotalHectaresChange &&
    prevProps.onPaymentTimingChange === nextProps.onPaymentTimingChange &&
    prevProps.onPaymentTypeChange === nextProps.onPaymentTypeChange &&
    prevProps.onPaymentScheduleChange === nextProps.onPaymentScheduleChange
  );
};

export default React.memo(InputSection, arePropsEqual);

