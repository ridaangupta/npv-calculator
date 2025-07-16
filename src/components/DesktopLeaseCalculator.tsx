
import React from 'react';
import InputSection from './InputSection';
import ResultsDisplay from './ResultsDisplay';
import ExecutiveSummary from './ExecutiveSummary';
import { useLeaseCalculatorLogic } from '@/hooks/useLeaseCalculatorLogic';

const DesktopLeaseCalculator: React.FC = () => {
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Executive Summary */}
      <ExecutiveSummary
        leaseValue={leaseValue}
        totalHectares={numericValues.totalHectares}
        totalInvestment={leaseValue * numericValues.totalHectares}
        paymentScheduleComplete={paymentSchedule.totalPercentage >= 95}
        percentageAllocated={paymentSchedule.totalPercentage}
        paymentCount={paymentSchedule.installments.length}
      />
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
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
        </div>

        {/* Results Section */}
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
      </div>
    </div>
  );
};

export default DesktopLeaseCalculator;
