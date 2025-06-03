
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CashFlowConfiguration from './CashFlowConfiguration';
import CashFlowPreview from './CashFlowPreview';
import HectaresInput from './HectaresInput';
import ResultsDisplay from './ResultsDisplay';

interface CashFlow {
  id: string;
  year: number;
  amount: number;
}

const NPVCalculator = () => {
  const [discountRate, setDiscountRate] = useState<number>(10);
  const [baseCashFlow, setBaseCashFlow] = useState<number>(0);
  const [increaseValue, setIncreaseValue] = useState<number>(0);
  const [increaseType, setIncreaseType] = useState<'amount' | 'percent'>('amount');
  const [increaseFrequency, setIncreaseFrequency] = useState<number>(1);
  const [timePeriod, setTimePeriod] = useState<number | string>(5);
  const [totalHectares, setTotalHectares] = useState<number | string>(1);
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([]);
  const [npv, setNpv] = useState<number>(0);

  // Helper function to get numeric value with fallback
  const getNumericTimePeriod = () => {
    const num = Number(timePeriod);
    return isNaN(num) || num <= 0 ? 1 : num;
  };

  const getNumericTotalHectares = () => {
    const num = Number(totalHectares);
    return isNaN(num) || num <= 0 ? 1 : num;
  };

  // Generate cash flows based on base amount, increase value, type, and frequency
  useEffect(() => {
    const generatedFlows: CashFlow[] = [];
    const numericTimePeriod = getNumericTimePeriod();
    let currentCashFlow = baseCashFlow;
    
    for (let year = 1; year <= numericTimePeriod; year++) {
      // Check if it's time to apply an increase
      if (year > 1 && (year - 1) % increaseFrequency === 0) {
        if (increaseType === 'amount') {
          currentCashFlow += increaseValue;
        } else if (increaseType === 'percent') {
          currentCashFlow = currentCashFlow * (1 + increaseValue / 100);
        }
      }
      
      generatedFlows.push({
        id: year.toString(),
        year: year,
        amount: Math.max(0, Math.round(currentCashFlow))
      });
    }
    
    setCashFlows(generatedFlows);
  }, [baseCashFlow, increaseValue, increaseType, increaseFrequency, timePeriod]);

  const calculateNPV = () => {
    let npvValue = 0;
    
    cashFlows.forEach(flow => {
      const presentValue = flow.amount / Math.pow(1 + discountRate / 100, flow.year);
      npvValue += presentValue;
    });
    
    setNpv(npvValue);
  };

  useEffect(() => {
    calculateNPV();
  }, [discountRate, cashFlows]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label htmlFor="discount-rate" className="text-sm font-medium text-gray-700">
                  Discount Rate (%)
                </label>
                <input
                  id="discount-rate"
                  type="number"
                  value={discountRate || ''}
                  onChange={(e) => setDiscountRate(Number(e.target.value) || 0)}
                  placeholder="Enter discount rate"
                  step="0.1"
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
        </div>

        {/* Results Section */}
        <ResultsDisplay
          npv={npv}
          totalHectares={getNumericTotalHectares()}
          discountRate={discountRate}
          cashFlows={cashFlows}
        />
      </div>
    </div>
  );
};

export default NPVCalculator;
