
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InputSection from './InputSection';
import ResultsDisplay from './ResultsDisplay';
import UpfrontPaymentScheduler from './UpfrontPaymentScheduler';
import { useNPVCalculatorLogic } from '@/hooks/useNPVCalculatorLogic';

const MobileNPVCalculator: React.FC = () => {
  const {
    discountRateInput,
    baseCashFlowInput,
    increaseValueInput,
    increaseType,
    increaseFrequency,
    timePeriodInput,
    totalHectaresInput,
    paymentTiming,
    cashFlows,
    npv,
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
    handlePaymentScheduleChange
  } = useNPVCalculatorLogic();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="input" className="text-sm font-medium">
            Input
          </TabsTrigger>
          <TabsTrigger value="schedule" className="text-sm font-medium">
            Schedule
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
            cashFlows={cashFlows}
            onDiscountRateChange={handleDiscountRateChange}
            onBaseCashFlowChange={handleBaseCashFlowChange}
            onIncreaseValueChange={handleIncreaseValueChange}
            onIncreaseTypeChange={handleIncreaseTypeChange}
            onIncreaseFrequencyChange={handleIncreaseFrequencyChange}
            onTimePeriodChange={handleTimePeriodChange}
            onTotalHectaresChange={handleTotalHectaresChange}
            onPaymentTimingChange={handlePaymentTimingChange}
          />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <UpfrontPaymentScheduler
            totalNPV={npv * numericValues.totalHectares}
            paymentSchedule={paymentSchedule}
            onUpdateSchedule={handlePaymentScheduleChange}
            discountRate={numericValues.discountRate}
          />
        </TabsContent>
        
        <TabsContent value="results" className="space-y-6">
          <ResultsDisplay
            npv={npv}
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

export default MobileNPVCalculator;
