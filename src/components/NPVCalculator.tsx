import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Calculator } from 'lucide-react';
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
  const [timePeriod, setTimePeriod] = useState<number>(5);
  const [totalHectares, setTotalHectares] = useState<number>(1);
  const [cashFlowFunction, setCashFlowFunction] = useState<string>('');
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([]);
  const [npv, setNpv] = useState<number>(0);

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
    
    if (increaseType === 'function' && cashFlowFunction.trim()) {
      // Use function-based calculation
      for (let year = 1; year <= timePeriod; year++) {
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
      
      for (let year = 1; year <= timePeriod; year++) {
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
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Investment Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="initial-investment" className="text-sm font-medium text-gray-700">
                Initial Investment ($)
              </Label>
              <Input
                id="initial-investment"
                type="number"
                value={initialInvestment || ''}
                onChange={(e) => setInitialInvestment(Number(e.target.value) || 0)}
                placeholder="Enter initial investment"
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount-rate" className="text-sm font-medium text-gray-700">
                Discount Rate (%)
              </Label>
              <Input
                id="discount-rate"
                type="number"
                value={discountRate || ''}
                onChange={(e) => setDiscountRate(Number(e.target.value) || 0)}
                placeholder="Enter discount rate"
                step="0.1"
                className="text-lg"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">
                Cash Flow Parameters
              </Label>
              
              {increaseType !== 'function' && (
                <div className="space-y-2">
                  <Label htmlFor="base-cash-flow" className="text-sm font-medium text-gray-600">
                    Base Cash Flow - Year 1 ($)
                  </Label>
                  <Input
                    id="base-cash-flow"
                    type="number"
                    value={baseCashFlow || ''}
                    onChange={(e) => setBaseCashFlow(Number(e.target.value) || 0)}
                    placeholder="Enter base cash flow"
                    className="text-lg"
                  />
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-600">
                  Cash Flow Type
                </Label>
                <RadioGroup 
                  value={increaseType} 
                  onValueChange={(value: 'amount' | 'percent' | 'function') => setIncreaseType(value)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="amount" id="amount" />
                    <Label htmlFor="amount" className="text-sm">Fixed Dollar Increase</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percent" id="percent" />
                    <Label htmlFor="percent" className="text-sm">Percentage Increase</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="function" id="function" />
                    <Label htmlFor="function" className="text-sm">Custom Function</Label>
                  </div>
                </RadioGroup>
              </div>

              {increaseType === 'function' ? (
                <div className="space-y-2">
                  <Label htmlFor="cash-flow-function" className="text-sm font-medium text-gray-600">
                    Cash Flow Function f(t)
                  </Label>
                  <Textarea
                    id="cash-flow-function"
                    value={cashFlowFunction}
                    onChange={(e) => setCashFlowFunction(e.target.value)}
                    placeholder="e.g., 1000 * exp(0.1 * t) or 500 + 100 * t^2"
                    className="text-sm font-mono"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    Enter a function where 't' is years after investment. 
                    Supports: +, -, *, /, ^, exp(), log(), sin(), cos(), sqrt(), abs()
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="increase-value" className="text-sm font-medium text-gray-600">
                      {increaseType === 'amount' ? 'Increase Amount ($)' : 'Increase Percentage (%)'}
                    </Label>
                    <Input
                      id="increase-value"
                      type="number"
                      value={increaseValue || ''}
                      onChange={(e) => setIncreaseValue(Number(e.target.value) || 0)}
                      placeholder={increaseType === 'amount' ? 'Enter dollar increase' : 'Enter percentage increase'}
                      step={increaseType === 'percent' ? '0.1' : '1'}
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-600">
                      Increase Frequency
                    </Label>
                    <RadioGroup 
                      value={increaseFrequency.toString()} 
                      onValueChange={(value) => setIncreaseFrequency(Number(value))}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="yearly" />
                        <Label htmlFor="yearly" className="text-sm">Every Year</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2" id="biennial" />
                        <Label htmlFor="biennial" className="text-sm">Every 2 Years</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3" id="triennial" />
                        <Label htmlFor="triennial" className="text-sm">Every 3 Years</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="4" id="quadrennial" />
                        <Label htmlFor="quadrennial" className="text-sm">Every 4 Years</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5" id="quinquennial" />
                        <Label htmlFor="quinquennial" className="text-sm">Every 5 Years</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="time-period" className="text-sm font-medium text-gray-600">
                  Time Period (Years)
                </Label>
                <Input
                  id="time-period"
                  type="number"
                  value={timePeriod || ''}
                  onChange={(e) => setTimePeriod(Math.max(1, Number(e.target.value) || 1))}
                  placeholder="Enter time period"
                  min="1"
                  max="50"
                  className="text-lg"
                />
              </div>
            </div>

            {/* Cash Flow Preview */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Generated Cash Flow Preview
              </Label>
              <div className="max-h-32 overflow-y-auto space-y-2 bg-gray-50 p-3 rounded-lg">
                {cashFlows.map((flow) => (
                  <div key={flow.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">Year {flow.year}:</span>
                    <span className="font-medium">
                      ${flow.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Hectares Input */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <Label htmlFor="total-hectares" className="text-sm font-medium text-gray-700">
                Total Hectares
              </Label>
              <Input
                id="total-hectares"
                type="number"
                value={totalHectares || ''}
                onChange={(e) => setTotalHectares(Number(e.target.value) || 1)}
                placeholder="Enter total hectares"
                min="0.1"
                step="0.1"
                className="text-lg"
              />
              <p className="text-xs text-gray-500">
                NPV calculations above are per hectare. Total project value will be calculated below.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <ResultsDisplay
          npv={npv}
          totalHectares={totalHectares}
          initialInvestment={initialInvestment}
          discountRate={discountRate}
          cashFlows={cashFlows}
        />
      </div>
    </div>
  );
};

export default NPVCalculator;
