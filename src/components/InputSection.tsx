
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CurrencyInput from './CurrencyInput';
import DiscountRateInput from './DiscountRateInput';
import CashFlowConfiguration from './CashFlowConfiguration';
import CashFlowPreview from './CashFlowPreview';
import HectaresInput from './HectaresInput';

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
  cashFlows: CashFlow[];
  onDiscountRateChange: (value: string) => void;
  onBaseCashFlowChange: (value: string) => void;
  onIncreaseValueChange: (value: string) => void;
  onIncreaseTypeChange: (value: 'amount' | 'percent') => void;
  onIncreaseFrequencyChange: (value: number) => void;
  onTimePeriodChange: (value: string) => void;
  onTotalHectaresChange: (value: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  discountRateInput,
  baseCashFlowInput,
  increaseValueInput,
  increaseType,
  increaseFrequency,
  timePeriodInput,
  totalHectaresInput,
  cashFlows,
  onDiscountRateChange,
  onBaseCashFlowChange,
  onIncreaseValueChange,
  onIncreaseTypeChange,
  onIncreaseFrequencyChange,
  onTimePeriodChange,
  onTotalHectaresChange
}) => {
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
          onBaseCashFlowChange={onBaseCashFlowChange}
          onIncreaseValueChange={onIncreaseValueChange}
          onIncreaseTypeChange={onIncreaseTypeChange}
          onIncreaseFrequencyChange={onIncreaseFrequencyChange}
          onTimePeriodChange={onTimePeriodChange}
        />

        <CashFlowPreview cashFlows={cashFlows} />

        <HectaresInput
          totalHectares={totalHectaresInput}
          onTotalHectaresChange={onTotalHectaresChange}
        />
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
    prevProps.onTotalHectaresChange === nextProps.onTotalHectaresChange
  );
};

export default React.memo(InputSection, arePropsEqual);
