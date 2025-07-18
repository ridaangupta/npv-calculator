
import React, { useState } from 'react';
import InputSection from './InputSection';
import ResultsDisplay from './ResultsDisplay';
import ExecutiveSummary from './ExecutiveSummary';
import PaymentMethodSelector from './PaymentMethodSelector';
import { CustomPaymentScheduleCalculator } from './CustomPaymentScheduleCalculator';
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Executive Summary */}
      <ExecutiveSummary
        leaseValue={leaseValue}
        totalHectares={numericValues.totalHectares}
        totalInvestment={leaseValue * numericValues.totalHectares}
        paymentScheduleComplete={true}
        percentageAllocated={100}
        paymentCount={1}
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
        />
      </div>

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
    </div>
  );
};

export default DesktopLeaseCalculator;
