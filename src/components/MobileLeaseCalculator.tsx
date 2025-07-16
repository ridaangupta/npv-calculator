
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InputSection from './InputSection';
import ResultsDisplay from './ResultsDisplay';
import ExecutiveSummary from './ExecutiveSummary';
import UpfrontPaymentScheduler from './UpfrontPaymentScheduler';
import { useLeaseCalculatorLogic } from '@/hooks/useLeaseCalculatorLogic';

const MobileLeaseCalculator: React.FC = () => {
  const {
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
    leaseValue,
    paymentSchedule,
    numericValues,
    handleDiscountRateChange,
    handleBaseCashFlowChange,
    handleIncreaseValueChange,
    handleIncreaseTypeChange,
    handleIncreaseFrequencyChange,
    handleTimePeriodChange,
    handleTotalHectaresChange,
    handlePaymentTimingChange,
    handlePaymentTypeChange,
    handlePaymentScheduleChange
  } = useLeaseCalculatorLogic();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="input" className="text-sm font-medium">
            Input
          </TabsTrigger>
          <TabsTrigger value="results" className="text-sm font-medium">
            Results
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="input" className="space-y-6">
          <InputSection
            discountRateInput={discountRateInput}
            baseCashFlowInput={baseCashFlowInput}
            increaseValueInput={increaseValueInput}
            increaseType={increaseType}
            increaseFrequency={increaseFrequency}
            timePeriodInput={timePeriodInput}
            totalHectaresInput={totalHectaresInput}
            paymentTiming={paymentTiming}
            paymentType={paymentType}
            cashFlows={cashFlows}
            leaseValue={leaseValue}
            paymentSchedule={paymentSchedule}
            discountRate={numericValues.discountRate}
            onDiscountRateChange={handleDiscountRateChange}
            onBaseCashFlowChange={handleBaseCashFlowChange}
            onIncreaseValueChange={handleIncreaseValueChange}
            onIncreaseTypeChange={handleIncreaseTypeChange}
            onIncreaseFrequencyChange={handleIncreaseFrequencyChange}
            onTimePeriodChange={handleTimePeriodChange}
            onTotalHectaresChange={handleTotalHectaresChange}
            onPaymentTimingChange={handlePaymentTimingChange}
            onPaymentTypeChange={handlePaymentTypeChange}
            onPaymentScheduleChange={handlePaymentScheduleChange}
          />
        </TabsContent>
        
        <TabsContent value="results" className="space-y-6">
          <ResultsDisplay
            leaseValue={leaseValue}
            totalHectares={numericValues.totalHectares}
            discountRate={numericValues.discountRate}
            cashFlows={cashFlows}
            baseCashFlow={numericValues.baseCashFlow}
            increaseValue={numericValues.increaseValue}
            increaseType={increaseType}
            increaseFrequency={increaseFrequency}
            paymentTiming={paymentTiming}
            paymentSchedule={paymentSchedule}
            onPaymentScheduleChange={handlePaymentScheduleChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileLeaseCalculator;
