
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InputSection from './InputSection';
import ResultsDisplay from './ResultsDisplay';
import ExecutiveSummary from './ExecutiveSummary';
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
    paymentType,
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
    handlePaymentTypeChange,
    handlePaymentScheduleChange
  } = useNPVCalculatorLogic();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview" className="text-sm font-medium">
            Overview
          </TabsTrigger>
          <TabsTrigger value="configuration" className="text-sm font-medium">
            Configuration
          </TabsTrigger>
          <TabsTrigger value="analysis" className="text-sm font-medium">
            Analysis
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <ExecutiveSummary
            npv={npv}
            totalHectares={numericValues.totalHectares}
            totalInvestment={npv * numericValues.totalHectares}
            paymentScheduleComplete={paymentSchedule.totalPercentage >= 95}
            percentageAllocated={paymentSchedule.totalPercentage}
            paymentCount={paymentSchedule.installments.length}
          />
        </TabsContent>
        
        <TabsContent value="configuration" className="space-y-6">
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
            npv={npv}
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
        
        <TabsContent value="analysis" className="space-y-6">
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
