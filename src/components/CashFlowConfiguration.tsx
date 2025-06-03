
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

interface CashFlowConfigurationProps {
  baseCashFlow: number;
  increaseValue: number;
  increaseType: 'amount' | 'percent' | 'function';
  increaseFrequency: number;
  timePeriod: number;
  cashFlowFunction: string;
  onBaseCashFlowChange: (value: number) => void;
  onIncreaseValueChange: (value: number) => void;
  onIncreaseTypeChange: (value: 'amount' | 'percent' | 'function') => void;
  onIncreaseFrequencyChange: (value: number) => void;
  onTimePeriodChange: (value: number) => void;
  onCashFlowFunctionChange: (value: string) => void;
}

const CashFlowConfiguration: React.FC<CashFlowConfigurationProps> = ({
  baseCashFlow,
  increaseValue,
  increaseType,
  increaseFrequency,
  timePeriod,
  cashFlowFunction,
  onBaseCashFlowChange,
  onIncreaseValueChange,
  onIncreaseTypeChange,
  onIncreaseFrequencyChange,
  onTimePeriodChange,
  onCashFlowFunctionChange
}) => {
  return (
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
            value={baseCashFlow}
            onChange={(e) => onBaseCashFlowChange(Number(e.target.value) || 0)}
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
          onValueChange={onIncreaseTypeChange}
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
            onChange={(e) => onCashFlowFunctionChange(e.target.value)}
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
              value={increaseValue}
              onChange={(e) => onIncreaseValueChange(Number(e.target.value) || 0)}
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
              onValueChange={(value) => onIncreaseFrequencyChange(Number(value))}
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
          value={timePeriod}
          onChange={(e) => onTimePeriodChange(Math.max(1, Number(e.target.value) || 1))}
          placeholder="Enter time period"
          min="1"
          max="50"
          className="text-lg"
        />
      </div>
    </div>
  );
};

export default CashFlowConfiguration;
