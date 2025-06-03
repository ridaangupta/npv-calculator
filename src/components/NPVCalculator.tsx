
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InputSection from './InputSection';
import ResultsDisplay from './ResultsDisplay';
import { useIsMobile } from '@/hooks/use-mobile';

interface CashFlow {
  id: string;
  year: number;
  amount: number;
}

const NPVCalculator = () => {
  const isMobile = useIsMobile();
  // Use string values for input fields to maintain focus
  const [discountRateInput, setDiscountRateInput] = useState<string>('10');
  const [baseCashFlowInput, setBaseCashFlowInput] = useState<string>('0');
  const [increaseValueInput, setIncreaseValueInput] = useState<string>('0');
  const [increaseType, setIncreaseType] = useState<'amount' | 'percent'>('amount');
  const [increaseFrequency, setIncreaseFrequency] = useState<number>(1);
  const [timePeriodInput, setTimePeriodInput] = useState<string>('5');
  const [totalHectaresInput, setTotalHectaresInput] = useState<string>('1');
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([]);
  const [npv, setNpv] = useState<number>(0);

  // Helper functions to get numeric values with fallbacks
  const getNumericDiscountRate = useCallback(() => {
    const num = Number(discountRateInput);
    return isNaN(num) || num < 0 ? 0 : num;
  }, [discountRateInput]);

  const getNumericBaseCashFlow = useCallback(() => {
    const num = Number(baseCashFlowInput);
    return isNaN(num) || num < 0 ? 0 : num;
  }, [baseCashFlowInput]);

  const getNumericIncreaseValue = useCallback(() => {
    const num = Number(increaseValueInput);
    return isNaN(num) || num < 0 ? 0 : num;
  }, [increaseValueInput]);

  const getNumericTimePeriod = useCallback(() => {
    const num = Number(timePeriodInput);
    return isNaN(num) || num <= 0 ? 1 : num;
  }, [timePeriodInput]);

  const getNumericTotalHectares = useCallback(() => {
    const num = Number(totalHectaresInput);
    return isNaN(num) || num <= 0 ? 1 : num;
  }, [totalHectaresInput]);

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

  // Generate cash flows with debounced calculation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const generatedFlows: CashFlow[] = [];
      const numericTimePeriod = getNumericTimePeriod();
      const numericBaseCashFlow = getNumericBaseCashFlow();
      const numericIncreaseValue = getNumericIncreaseValue();
      
      // Calculate equivalent annual increase by spreading over frequency period
      const annualIncreaseValue = numericIncreaseValue / increaseFrequency;
      let currentCashFlowPerM2 = numericBaseCashFlow;
      
      for (let year = 1; year <= numericTimePeriod; year++) {
        // Apply the equivalent annual increase every year (except year 1)
        if (year > 1) {
          if (increaseType === 'amount') {
            currentCashFlowPerM2 += annualIncreaseValue;
          } else if (increaseType === 'percent') {
            currentCashFlowPerM2 = currentCashFlowPerM2 * (1 + annualIncreaseValue / 100);
          }
        }
        
        // Convert from per m² to per hectare (multiply by 10,000)
        const currentCashFlowPerHectare = currentCashFlowPerM2 * 10000;
        
        // Round to 2 decimal places
        const roundedCashFlow = Math.round(currentCashFlowPerHectare * 100) / 100;
        
        generatedFlows.push({
          id: year.toString(),
          year: year,
          amount: Math.max(0, roundedCashFlow)
        });
      }
      
      setCashFlows(generatedFlows);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [baseCashFlowInput, increaseValueInput, increaseType, increaseFrequency, timePeriodInput, getNumericTimePeriod, getNumericBaseCashFlow, getNumericIncreaseValue]);

  const calculateNPV = useCallback(() => {
    let npvValue = 0;
    const numericDiscountRate = getNumericDiscountRate();
    
    cashFlows.forEach(flow => {
      const presentValue = flow.amount / Math.pow(1 + numericDiscountRate / 100, flow.year);
      npvValue += presentValue;
    });
    
    setNpv(npvValue);
  }, [getNumericDiscountRate, cashFlows]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateNPV();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [calculateNPV]);

  if (isMobile) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="input" className="text-sm font-medium">
              Input
            </TabsTrigger>
            <TabsTrigger value="output" className="text-sm font-medium">
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
              cashFlows={cashFlows}
              onDiscountRateChange={handleDiscountRateChange}
              onBaseCashFlowChange={handleBaseCashFlowChange}
              onIncreaseValueChange={handleIncreaseValueChange}
              onIncreaseTypeChange={handleIncreaseTypeChange}
              onIncreaseFrequencyChange={handleIncreaseFrequencyChange}
              onTimePeriodChange={handleTimePeriodChange}
              onTotalHectaresChange={handleTotalHectaresChange}
            />
          </TabsContent>
          
          <TabsContent value="output" className="space-y-6">
            <ResultsDisplay
              npv={npv}
              totalHectares={getNumericTotalHectares()}
              discountRate={getNumericDiscountRate()}
              cashFlows={cashFlows}
              baseCashFlow={getNumericBaseCashFlow()}
              increaseValue={getNumericIncreaseValue()}
              increaseType={increaseType}
              increaseFrequency={increaseFrequency}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="max-w-4xl mx-auto space-y-8">
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
            cashFlows={cashFlows}
            onDiscountRateChange={handleDiscountRateChange}
            onBaseCashFlowChange={handleBaseCashFlowChange}
            onIncreaseValueChange={handleIncreaseValueChange}
            onIncreaseTypeChange={handleIncreaseTypeChange}
            onIncreaseFrequencyChange={handleIncreaseFrequencyChange}
            onTimePeriodChange={handleTimePeriodChange}
            onTotalHectaresChange={handleTotalHectaresChange}
          />
        </div>

        {/* Results Section */}
        <ResultsDisplay
          npv={npv}
          totalHectares={getNumericTotalHectares()}
          discountRate={getNumericDiscountRate()}
          cashFlows={cashFlows}
          baseCashFlow={getNumericBaseCashFlow()}
          increaseValue={getNumericIncreaseValue()}
          increaseType={increaseType}
          increaseFrequency={increaseFrequency}
        />
      </div>
    </div>
  );
};

export default NPVCalculator;
