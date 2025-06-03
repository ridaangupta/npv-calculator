import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CashFlowConfiguration from './CashFlowConfiguration';
import CashFlowPreview from './CashFlowPreview';
import HectaresInput from './HectaresInput';
import ResultsDisplay from './ResultsDisplay';
import CurrencyInput from './CurrencyInput';
import { useIsMobile } from '@/hooks/use-mobile';

interface CashFlow {
  id: string;
  year: number;
  amount: number;
}

const NPVCalculator = () => {
  const isMobile = useIsMobile();
  const [discountRate, setDiscountRate] = useState<number | string>(10);
  const [baseCashFlow, setBaseCashFlow] = useState<number | string>(0);
  const [increaseValue, setIncreaseValue] = useState<number | string>(0);
  const [increaseType, setIncreaseType] = useState<'amount' | 'percent'>('amount');
  const [increaseFrequency, setIncreaseFrequency] = useState<number>(1);
  const [timePeriod, setTimePeriod] = useState<number | string>(5);
  const [totalHectares, setTotalHectares] = useState<number | string>(1);
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([]);
  const [npv, setNpv] = useState<number>(0);

  // Helper functions to get numeric values with fallbacks
  const getNumericDiscountRate = () => {
    const num = Number(discountRate);
    return isNaN(num) || num < 0 ? 0 : num;
  };

  const getNumericBaseCashFlow = () => {
    const num = Number(baseCashFlow);
    return isNaN(num) || num < 0 ? 0 : num;
  };

  const getNumericIncreaseValue = () => {
    const num = Number(increaseValue);
    return isNaN(num) || num < 0 ? 0 : num;
  };

  const getNumericTimePeriod = () => {
    const num = Number(timePeriod);
    return isNaN(num) || num <= 0 ? 1 : num;
  };

  const getNumericTotalHectares = () => {
    const num = Number(totalHectares);
    return isNaN(num) || num <= 0 ? 1 : num;
  };

  // Generate cash flows with spread increases instead of discrete jumps
  // Convert from per m² to per hectare by multiplying by 10,000
  useEffect(() => {
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
  }, [baseCashFlow, increaseValue, increaseType, increaseFrequency, timePeriod]);

  const calculateNPV = () => {
    let npvValue = 0;
    const numericDiscountRate = getNumericDiscountRate();
    
    cashFlows.forEach(flow => {
      const presentValue = flow.amount / Math.pow(1 + numericDiscountRate / 100, flow.year);
      npvValue += presentValue;
    });
    
    setNpv(npvValue);
  };

  useEffect(() => {
    calculateNPV();
  }, [discountRate, cashFlows]);

  const InputSection = () => (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        <CurrencyInput />

        <div className="space-y-2">
          <label htmlFor="discount-rate" className="text-sm font-medium text-gray-700">
            Discount Rate (%)
          </label>
          <input
            id="discount-rate"
            type="number"
            value={discountRate}
            onChange={(e) => setDiscountRate(e.target.value === '' ? '' : e.target.value)}
            placeholder="Enter discount rate"
            step="0.01"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          />
        </div>

        <CashFlowConfiguration
          baseCashFlow={baseCashFlow}
          increaseValue={increaseValue}
          increaseType={increaseType}
          increaseFrequency={increaseFrequency}
          timePeriod={timePeriod}
          onBaseCashFlowChange={setBaseCashFlow}
          onIncreaseValueChange={setIncreaseValue}
          onIncreaseTypeChange={setIncreaseType}
          onIncreaseFrequencyChange={setIncreaseFrequency}
          onTimePeriodChange={setTimePeriod}
        />

        <CashFlowPreview cashFlows={cashFlows} />

        <HectaresInput
          totalHectares={totalHectares}
          onTotalHectaresChange={setTotalHectares}
        />
      </CardContent>
    </Card>
  );

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
            <InputSection />
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
          <InputSection />
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
