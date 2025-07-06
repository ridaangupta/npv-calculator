

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Percent, MapPin, Table, ChartLine, Calculator, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useCurrency } from '@/contexts/CurrencyContext';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface CashFlow {
  id: string;
  year: number;
  amount: number;
}

interface ResultsDisplayProps {
  npv: number;
  totalHectares: number;
  discountRate: number;
  cashFlows: CashFlow[];
  baseCashFlow: number;
  increaseValue: number;
  increaseType: 'amount' | 'percent';
  increaseFrequency: number;
  paymentTiming: 'beginning' | 'middle' | 'end';
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  npv,
  totalHectares,
  discountRate,
  cashFlows,
  baseCashFlow,
  increaseValue,
  increaseType,
  increaseFrequency,
  paymentTiming
}) => {
  const { formatCurrency } = useCurrency();
  const [viewMode, setViewMode] = useState<'table' | 'graph'>('table');
  
  // Memoized calculations to prevent recalculation on every render
  const calculatedValues = useMemo(() => {
    const isPositiveNPV = npv > 0;
    const totalNPV = npv * totalHectares;
    const isPositiveTotalNPV = totalNPV > 0;
    const totalCashFlows = cashFlows.reduce((sum, flow) => sum + flow.amount, 0);
    
    // Calculate upfront prices based on NPV (sum of all present values)
    // npv is already the NPV per hectare, so we need to convert to per sqm
    const upfrontPricePerSqm = npv / 10000; // 1 hectare = 10,000 sqm
    const upfrontPricePerHectare = npv; // NPV is already per hectare
    const upfrontPriceTotal = npv * totalHectares; // Total NPV for all hectares
    
    return {
      isPositiveNPV,
      totalNPV,
      isPositiveTotalNPV,
      totalCashFlows,
      upfrontPricePerSqm,
      upfrontPricePerHectare,
      upfrontPriceTotal
    };
  }, [npv, totalHectares, cashFlows]);

  // Memoized chart data preparation
  const chartData = useMemo(() => {
    return cashFlows.map((flow) => {
      let adjustedYear = flow.year;
      
      // Apply the same timing adjustment as in calculations
      switch (paymentTiming) {
        case 'beginning':
          adjustedYear = flow.year - 1;
          break;
        case 'middle':
          adjustedYear = flow.year - 0.5;
          break;
        case 'end':
        default:
          adjustedYear = flow.year;
          break;
      }
      
      adjustedYear = Math.max(0, adjustedYear);
      const presentValue = flow.amount / Math.pow(1 + discountRate / 100, adjustedYear);
      
      return {
        year: flow.year,
        presentValue: presentValue,
        futureValue: flow.amount,
      };
    });
  }, [cashFlows, discountRate, paymentTiming]);

  const chartConfig = {
    presentValue: {
      label: "Present Value",
      color: "#10b981", // emerald-500
    },
    futureValue: {
      label: "Future Value",
      color: "#3b82f6", // blue-500
    },
  };

  const getTimingDisplayName = () => {
    switch (paymentTiming) {
      case 'beginning':
        return 'Beginning of Year';
      case 'middle':
        return 'Middle of Year';
      case 'end':
        return 'End of Year';
      default:
        return 'End of Year';
    }
  };

  const { isPositiveNPV, totalNPV, isPositiveTotalNPV, totalCashFlows, upfrontPricePerSqm, upfrontPricePerHectare, upfrontPriceTotal } = calculatedValues;

  return (
    <div className="space-y-6">
      {/* Upfront Price Per Square Meter */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Upfront Price Per m²
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 text-blue-700">
              {formatCurrency(upfrontPricePerSqm)}
            </div>
            <div className="text-lg font-medium text-blue-600">
              Per Square Meter (NPV)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upfront Price Per Hectare */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Upfront Price Per Hectare
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2 text-green-700">
              {formatCurrency(upfrontPricePerHectare)}
            </div>
            <div className="text-lg font-medium text-green-600">
              Per Hectare (10,000 m² NPV)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upfront Price for Total Hectares */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-violet-50">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Upfront Price for {totalHectares} Hectare{totalHectares !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2 text-purple-700">
              {formatCurrency(upfrontPriceTotal)}
            </div>
            <div className="text-lg font-medium text-purple-600">
              Total Project NPV
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {formatCurrency(upfrontPricePerHectare)} × {totalHectares} hectare{totalHectares !== 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Cash Flow Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Discount Rate</div>
              <div className="text-xl font-semibold text-purple-700 flex items-center justify-center gap-1">
                {discountRate.toFixed(1)}
                <Percent className="w-4 h-4" />
              </div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Payment Timing</div>
              <div className="text-lg font-semibold text-blue-700 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" />
                {getTimingDisplayName()}
              </div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Absolute Value of Total Lease</div>
              <div className="text-xl font-semibold text-orange-700">
                {formatCurrency(totalCashFlows)}
              </div>
            </div>
            
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">NPV of Total Period</div>
              <div className="text-xl font-semibold text-emerald-700">
                {formatCurrency(totalNPV)}
              </div>
            </div>
            
            <div className="text-center p-4 bg-indigo-50 rounded-lg col-span-2">
              <div className="text-sm text-gray-600 mb-1">Years Analyzed</div>
              <div className="text-xl font-semibold text-indigo-700">
                {cashFlows.length} Year{cashFlows.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Breakdown */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <span>Present Value Breakdown</span>
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => value && setViewMode(value as 'table' | 'graph')}
              className="bg-white/10 p-1 rounded-lg border border-white/20"
            >
              <ToggleGroupItem 
                value="table" 
                className="data-[state=on]:bg-white data-[state=on]:text-gray-700 text-white/80 hover:text-white hover:bg-white/10 px-3 py-2"
              >
                <Table className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="graph" 
                className="data-[state=on]:bg-white data-[state=on]:text-gray-700 text-white/80 hover:text-white hover:bg-white/10 px-3 py-2"
              >
                <ChartLine className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {viewMode === 'table' ? (
            <div className="space-y-3">
              {cashFlows.map((flow) => {
                let adjustedYear = flow.year;
                
                // Apply the same timing adjustment as in calculations
                switch (paymentTiming) {
                  case 'beginning':
                    adjustedYear = flow.year - 1;
                    break;
                  case 'middle':
                    adjustedYear = flow.year - 0.5;
                    break;
                  case 'end':
                  default:
                    adjustedYear = flow.year;
                    break;
                }
                
                adjustedYear = Math.max(0, adjustedYear);
                const presentValue = flow.amount / Math.pow(1 + discountRate / 100, adjustedYear);
                
                return (
                  <div key={flow.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-gray-700">Year {flow.year}</span>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        +{formatCurrency(presentValue)}
                      </div>
                      <div className="text-xs text-gray-500">
                        (Future: {formatCurrency(flow.amount)})
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-80">
              <ChartContainer config={chartConfig}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="year" 
                    tick={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={false}
                    axisLine={false}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value, name) => [
                        formatCurrency(Number(value)), 
                        name === 'presentValue' ? 'Present Value' : 'Future Value'
                      ]}
                    />} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="presentValue" 
                    stroke="var(--color-presentValue)" 
                    strokeWidth={3}
                    dot={{ fill: "var(--color-presentValue)", strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="futureValue" 
                    stroke="var(--color-futureValue)" 
                    strokeWidth={3}
                    dot={{ fill: "var(--color-futureValue)", strokeWidth: 2, r: 4 }}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </LineChart>
              </ChartContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Custom comparison function for React.memo
const arePropsEqual = (prevProps: ResultsDisplayProps, nextProps: ResultsDisplayProps) => {
  return (
    prevProps.npv === nextProps.npv &&
    prevProps.totalHectares === nextProps.totalHectares &&
    prevProps.discountRate === nextProps.discountRate &&
    prevProps.baseCashFlow === nextProps.baseCashFlow &&
    prevProps.increaseValue === nextProps.increaseValue &&
    prevProps.increaseType === nextProps.increaseType &&
    prevProps.increaseFrequency === nextProps.increaseFrequency &&
    prevProps.paymentTiming === nextProps.paymentTiming &&
    prevProps.cashFlows.length === nextProps.cashFlows.length &&
    prevProps.cashFlows.every((flow, index) => 
      flow.id === nextProps.cashFlows[index]?.id &&
      flow.year === nextProps.cashFlows[index]?.year &&
      flow.amount === nextProps.cashFlows[index]?.amount
    )
  );
};

export default React.memo(ResultsDisplay, arePropsEqual);

