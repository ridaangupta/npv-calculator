
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus, Calculator } from 'lucide-react';
import CashFlowInput from './CashFlowInput';
import ResultsDisplay from './ResultsDisplay';

interface CashFlow {
  id: string;
  year: number;
  amount: number;
}

const NPVCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(10);
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([
    { id: '1', year: 1, amount: 0 },
    { id: '2', year: 2, amount: 0 },
    { id: '3', year: 3, amount: 0 }
  ]);
  const [npv, setNpv] = useState<number>(0);

  const addCashFlow = () => {
    const newId = (cashFlows.length + 1).toString();
    const newYear = cashFlows.length + 1;
    setCashFlows([...cashFlows, { id: newId, year: newYear, amount: 0 }]);
  };

  const removeCashFlow = (id: string) => {
    if (cashFlows.length > 1) {
      const updatedFlows = cashFlows.filter(flow => flow.id !== id);
      // Renumber the years
      const renumberedFlows = updatedFlows.map((flow, index) => ({
        ...flow,
        year: index + 1
      }));
      setCashFlows(renumberedFlows);
    }
  };

  const updateCashFlow = (id: string, amount: number) => {
    setCashFlows(flows => 
      flows.map(flow => 
        flow.id === id ? { ...flow, amount } : flow
      )
    );
  };

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
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">
                  Cash Flows by Year
                </Label>
                <div className="flex gap-2">
                  <Button
                    onClick={addCashFlow}
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  {cashFlows.length > 1 && (
                    <Button
                      onClick={() => removeCashFlow(cashFlows[cashFlows.length - 1].id)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cashFlows.map((flow) => (
                  <CashFlowInput
                    key={flow.id}
                    cashFlow={flow}
                    onUpdate={updateCashFlow}
                    onRemove={removeCashFlow}
                    canRemove={cashFlows.length > 1}
                  />
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
