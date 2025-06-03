
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface CashFlowConfigurationProps {
  baseCashFlow: number | string;
  increaseValue: number | string;
  increaseType: 'amount' | 'percent';
  increaseFrequency: number;
  timePeriod: number | string;
  onBaseCashFlowChange: (value: number | string) => void;
  onIncreaseValueChange: (value: number | string) => void;
  onIncreaseTypeChange: (value: 'amount' | 'percent') => void;
  onIncreaseFrequencyChange: (value: number) => void;
  onTimePeriodChange: (value: number | string) => void;
}

const CashFlowConfiguration: React.FC<CashFlowConfigurationProps> = ({
  baseCashFlow,
  increaseValue,
  increaseType,
  increaseFrequency,
  timePeriod,
  onBaseCashFlowChange,
  onIncreaseValueChange,
  onIncreaseTypeChange,
  onIncreaseFrequencyChange,
  onTimePeriodChange
}) => {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        Cash Flow Parameters
      </Label>
      
      <div className="space-y-2">
        <Label htmlFor="base-cash-flow" className="text-sm font-medium text-gray-600">
          Initial Lease Rent ($)
        </Label>
        <Input
          id="base-cash-flow"
          type="number"
          value={baseCashFlow}
          onChange={(e) => onBaseCashFlowChange(e.target.value === '' ? '' : e.target.value)}
          placeholder="Enter initial lease rent"
          step="0.01"
          className="text-lg"
        />
      </div>

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
            <Label htmlFor="amount" className="text-sm">Fixed Amount Increase</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="percent" id="percent" />
            <Label htmlFor="percent" className="text-sm">Percentage Increase</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="increase-value" className="text-sm font-medium text-gray-600">
          {increaseType === 'amount' ? 'Increase Amount ($)' : 'Increase Percentage (%)'}
        </Label>
        <Input
          id="increase-value"
          type="number"
          value={increaseValue}
          onChange={(e) => onIncreaseValueChange(e.target.value === '' ? '' : e.target.value)}
          placeholder={increaseType === 'amount' ? 'Enter dollar increase' : 'Enter percentage increase'}
          step="0.01"
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

      <div className="space-y-2">
        <Label htmlFor="time-period" className="text-sm font-medium text-gray-600">
          Time Period (Years)
        </Label>
        <Input
          id="time-period"
          type="number"
          value={timePeriod}
          onChange={(e) => onTimePeriodChange(e.target.value === '' ? '' : e.target.value)}
          placeholder="Enter time period"
          min="0.1"
          step="0.1"
          className="text-lg"
        />
      </div>
    </div>
  );
};

export default CashFlowConfiguration;
