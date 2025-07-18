
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InputSection from './InputSection';
import ResultsDisplay from './ResultsDisplay';
import ExecutiveSummary from './ExecutiveSummary';
import PaymentMethodSelector from './PaymentMethodSelector';
import { CustomPaymentScheduleCalculator } from './CustomPaymentScheduleCalculator';

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
    cashFlows,
    leaseValue,
    numericValues,
    handleDiscountRateChange,
    handleBaseCashFlowChange,
    handleIncreaseValueChange,
    handleIncreaseTypeChange,
    handleIncreaseFrequencyChange,
    handleTimePeriodChange,
    handleTotalHectaresChange,
    handlePaymentTimingChange,
  } = useLeaseCalculatorLogic();

  const [paymentMethod, setPaymentMethod] = useState<'standard' | 'custom'>('standard');

  const totalInvestment = leaseValue * numericValues.totalHectares;
  const hasValidCalculation = leaseValue > 0 && numericValues.totalHectares > 0;

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
            cashFlows={cashFlows}
            leaseValue={leaseValue}
            totalValue={leaseValue}
            discountRate={numericValues.discountRate}
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
          />
          
          {/* Payment Method Selection - Only show if calculation is valid */}
          {hasValidCalculation && (
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
              leaseValue={leaseValue}
              totalHectares={numericValues.totalHectares}
            />
          )}

          {/* Custom Payment Schedule - Only show if custom method is selected */}
          {hasValidCalculation && paymentMethod === 'custom' && (
            <CustomPaymentScheduleCalculator
              dealValue={totalInvestment}
              discountRate={numericValues.discountRate}
              leaseStartDate={new Date()}
              showComparison={true}
              standardLeaseValue={leaseValue}
              standardTotalHectares={numericValues.totalHectares}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileLeaseCalculator;
