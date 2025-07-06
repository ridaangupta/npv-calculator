import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InputSection from './InputSection';
import ResultsDisplay from './ResultsDisplay';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOptimizedCalculations } from '@/hooks/useOptimizedCalculations';
import { PaymentSchedule } from '@/types/PaymentSchedule';
import UpfrontPaymentScheduler from './UpfrontPaymentScheduler';

interface CashFlow {
  id: string;
  year: number;
  amount: number;
}

const NPVCalculator = () => {
  const isMobile = useIsMobile();
  const { calculateNPVMemoized, generateCashFlowsMemoized } = useOptimizedCalculations();
  
  // Use string values for input fields to maintain focus
  const [discountRateInput, setDiscountRateInput] = useState<string>('10');
  const [baseCashFlowInput, setBaseCashFlowInput] = useState<string>('0');
  const [increaseValueInput, setIncreaseValueInput] = useState<string>('0');
  const [increaseType, setIncreaseType] = useState<'amount' | 'percent'>('amount');
  const [increaseFrequency, setIncreaseFrequency] = useState<number>(1);
  const [timePeriodInput, setTimePeriodInput] = useState<string>('5');
  const [totalHectaresInput, setTotalHectaresInput] = useState<string>('1');
  const [paymentTiming, setPaymentTiming] = useState<'beginning' | 'middle' | 'end'>('end');
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([]);
  const [npv, setNpv] = useState<number>(0);
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule>({
    installments: [],
    totalPercentage: 0,
    totalAmount: 0,
    remainingAmount: 0
  });

  // Memoized numeric value parsing with early returns for invalid values
  const numericValues = useMemo(() => {
    const discountRate = Math.max(0, Number(discountRateInput) || 0);
    const baseCashFlow = Math.max(0, Number(baseCashFlowInput) || 0);
    const increaseValue = Math.max(0, Number(increaseValueInput) || 0);
    const timePeriod = Math.max(1, Number(timePeriodInput) || 1);
    const totalHectares = Math.max(1, Number(totalHectaresInput) || 1);

    return {
      discountRate,
      baseCashFlow,
      increaseValue,
      timePeriod,
      totalHectares
    };
  }, [discountRateInput, baseCashFlowInput, increaseValueInput, timePeriodInput, totalHectaresInput]);

  // Memoized change handlers to prevent re-renders
  const handleDiscountRateChange = useCallback((value: string) => {
    setDiscountRateInput(value);
  }, []);

  const handleBaseCashFlowChange = useCallback((value: string) => {
    setBaseCashFlowInput(value);
  }, []);

  const handleIncreaseValueChange = useCallback((value: string) => {
    setIncreaseValueInput(value);
  }, []);

  const handleIncreaseTypeChange = useCallback((value: 'amount' | 'percent') => {
    setIncreaseType(value);
  }, []);

  const handleIncreaseFrequencyChange = useCallback((value: number) => {
    setIncreaseFrequency(value);
  }, []);

  const handleTimePeriodChange = useCallback((value: string) => {
    setTimePeriodInput(value);
  }, []);

  const handleTotalHectaresChange = useCallback((value: string) => {
    setTotalHectaresInput(value);
  }, []);

  const handlePaymentTimingChange = useCallback((value: 'beginning' | 'middle' | 'end') => {
    setPaymentTiming(value);
  }, []);

  const handlePaymentScheduleChange = useCallback((schedule: PaymentSchedule) => {
    setPaymentSchedule(schedule);
  }, []);

  // Generate cash flows with optimized debouncing (reduced from 300ms to 150ms)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const { baseCashFlow, increaseValue, timePeriod } = numericValues;
      
      // Early return for invalid inputs
      if (baseCashFlow < 0 || increaseValue < 0 || timePeriod <= 0) {
        setCashFlows([]);
        return;
      }

      const generatedFlows = generateCashFlowsMemoized(
        baseCashFlow,
        increaseValue,
        increaseType,
        increaseFrequency,
        timePeriod
      );
      
      setCashFlows(generatedFlows);
    }, 150); // Reduced debounce from 300ms to 150ms

    return () => clearTimeout(timeoutId);
  }, [baseCashFlowInput, increaseValueInput, increaseType, increaseFrequency, timePeriodInput, numericValues, generateCashFlowsMemoized]);

  // Memoized NPV calculation with payment timing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const { discountRate } = numericValues;
      
      // Early return for invalid inputs
      if (cashFlows.length === 0 || discountRate < 0) {
        setNpv(0);
        return;
      }

      const npvValue = calculateNPVMemoized(cashFlows, discountRate, paymentTiming);
      setNpv(npvValue);
    }, 150); // Reduced debounce from 300ms to 150ms

    return () => clearTimeout(timeoutId);
  }, [cashFlows, numericValues.discountRate, paymentTiming, calculateNPVMemoized]);

  if (isMobile) {
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
  }

  // Desktop layout
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

      {/* Payment Schedule Section - Full Width Below */}
      <div className="w-full">
        <UpfrontPaymentScheduler
          totalNPV={npv * numericValues.totalHectares}
          paymentSchedule={paymentSchedule}
          onUpdateSchedule={handlePaymentScheduleChange}
        />
      </div>
    </div>
  );
};

export default NPVCalculator;
