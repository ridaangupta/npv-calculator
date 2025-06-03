import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import InvestmentInputs from './InvestmentInputs';
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
  const [initialInvestment, setInitialInvestment] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(10);
  const [baseCashFlow, setBaseCashFlow] = useState<number>(0);
  const [increaseValue, setIncreaseValue] = useState<number>(0);
  const [increaseType, setIncreaseType] = useState<'amount' | 'percent' | 'function'>('amount');
  const [increaseFrequency, setIncreaseFrequency] = useState<number>(1);
  const [timePeriod, setTimePeriod] = useState<number | string>(5);
  const [totalHectares, setTotalHectares] = useState<number | string>(1);
  const [cashFlowFunction, setCashFlowFunction] = useState<string>('');
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

  // Evaluate mathematical function safely
  const evaluateFunction = (functionStr: string, t: number): number => {
    try {
      // Replace t with the actual value and evaluate basic math functions
      const sanitized = functionStr
        .replace(/\bt\b/g, t.toString())
        .replace(/\^/g, '**') // Convert ^ to ** for exponentiation
        .replace(/exp\(/g, 'Math.exp(')
        .replace(/log\(/g, 'Math.log(')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/abs\(/g, 'Math.abs(');
      
      // Use Function constructor for safer evaluation than eval
      const func = new Function('return ' + sanitized);
      const result = func();
      
      return isNaN(result) || !isFinite(result) ? 0 : Math.max(0, result);
    } catch (error) {
      console.warn('Function evaluation error:', error);
      return 0;
    }
  };

  // Generate cash flows based on base amount, increase value, type, and frequency
  useEffect(() => {
    const generatedFlows: CashFlow[] = [];
    const numericTimePeriod = getNumericTimePeriod();
    
    if (increaseType === 'function' && cashFlowFunction.trim()) {
      // Use function-based calculation
      for (let year = 1; year <= numericTimePeriod; year++) {
        const amount = evaluateFunction(cashFlowFunction, year);
        generatedFlows.push({
          id: year.toString(),
          year: year,
          amount: Math.round(amount)
        });
      }
    } else {
      // Use existing logic for amount and percent increases
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
    }
    
    setCashFlows(generatedFlows);
  }, [baseCashFlow, increaseValue, increaseType, increaseFrequency, timePeriod, cashFlowFunction]);

  const calculateNPV = () => {
    let npvValue = -initialInvestment;
    
    cashFlows.forEach(flow => {
      const presentValue = flow.amount / Math.pow(1 + discountRate / 100, flow.year);
      npvValue += presentValue;
    });
    
    setNpv(npvValue);
  };

  useEffect(() => {
    calculateNPV();
  }, [initialInvestment, discountRate, cashFlows]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <InvestmentInputs
            initialInvestment={initialInvestment}
            discountRate={discountRate}
            onInitialInvestmentChange={setInitialInvestment}
            onDiscountRateChange={setDiscountRate}
          />
          
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              <CashFlowConfiguration
                baseCashFlow={baseCashFlow}
                increaseValue={increaseValue}
                increaseType={increaseType}
                increaseFrequency={increaseFrequency}
                timePeriod={timePeriod}
                cashFlowFunction={cashFlowFunction}
                onBaseCashFlowChange={setBaseCashFlow}
                onIncreaseValueChange={setIncreaseValue}
                onIncreaseTypeChange={setIncreaseType}
                onIncreaseFrequencyChange={setIncreaseFrequency}
                onTimePeriodChange={setTimePeriod}
                onCashFlowFunctionChange={setCashFlowFunction}
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
          initialInvestment={initialInvestment}
          discountRate={discountRate}
          cashFlows={cashFlows}
        />
      </div>
    </div>
  );
};

export default NPVCalculator;
