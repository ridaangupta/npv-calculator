
import React from 'react';
import InputSection from './InputSection';
import ResultsDisplay from './ResultsDisplay';
import UpfrontPaymentScheduler from './UpfrontPaymentScheduler';
import { useNPVCalculatorLogic } from '@/hooks/useNPVCalculatorLogic';

const DesktopNPVCalculator: React.FC = () => {
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
    <div className="max-w-6xl mx-auto space-y-8">
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
        </div>

        {/* Results Section */}
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
      </div>

      {/* Payment Schedule Section - Full Width Below (only for custom payment type) */}
      {paymentType === 'custom' && (
        <div className="w-full">
          <UpfrontPaymentScheduler
            totalNPV={npv * numericValues.totalHectares}
            paymentSchedule={paymentSchedule}
            onUpdateSchedule={handlePaymentScheduleChange}
            discountRate={numericValues.discountRate}
          />
        </div>
      )}
    </div>
  );
};

export default DesktopNPVCalculator;
