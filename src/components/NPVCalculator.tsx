
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const [annualIncrease, setAnnualIncrease] = useState<number>(0);
  const [timePeriod, setTimePeriod] = useState<number>(5);
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([]);
  const [npv, setNpv] = useState<number>(0);

  // Generate cash flows based on base amount and annual increase
  useEffect(() => {
    const generatedFlows: CashFlow[] = [];
    for (let year = 1; year <= timePeriod; year++) {
      const amount = baseCashFlow + (annualIncrease * (year - 1));
      generatedFlows.push({
        id: year.toString(),
        year: year,
        amount: Math.max(0, amount) // Ensure non-negative cash flows
      });
    }
    setCashFlows(generatedFlows);
  }, [baseCashFlow, annualIncrease, timePeriod]);

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

              <div className="space-y-2">
                <Label htmlFor="annual-increase" className="text-sm font-medium text-gray-600">
                  Annual Increase ($)
                </Label>
                <Input
                  id="annual-increase"
                  type="number"
                  value={annualIncrease || ''}
                  onChange={(e) => setAnnualIncrease(Number(e.target.value) || 0)}
                  placeholder="Enter annual increase"
                  className="text-lg"
                />
              </div>

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
          </CardContent>
        </Card>

        {/* Results Section */}
        <ResultsDisplay
          npv={npv}
          initialInvestment={initialInvestment}
          discountRate={discountRate}
          cashFlows={cashFlows}
        />
      </div>
    </div>
  );
};

export default NPVCalculator;
