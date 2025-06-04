
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Percent, MapPin, Table, ChartLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useCurrency } from '@/contexts/CurrencyContext';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import ExcelExportButton from './ExcelExportButton';

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
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  npv,
  totalHectares,
  discountRate,
  cashFlows,
  baseCashFlow,
  increaseValue,
  increaseType,
  increaseFrequency
}) => {
  const { formatCurrency } = useCurrency();
  const [viewMode, setViewMode] = useState<'table' | 'graph'>('table');
  
  // Memoized calculations to prevent recalculation on every render
  const calculatedValues = useMemo(() => {
    const isPositiveNPV = npv > 0;
    const totalNPV = npv * totalHectares;
    const isPositiveTotalNPV = totalNPV > 0;
    const totalCashFlows = cashFlows.reduce((sum, flow) => sum + flow.amount, 0);
    
    return {
      isPositiveNPV,
      totalNPV,
      isPositiveTotalNPV,
      totalCashFlows
    };
  }, [npv, totalHectares, cashFlows]);

  // Memoized chart data preparation
  const chartData = useMemo(() => {
    return cashFlows.map((flow) => {
      const presentValue = flow.amount / Math.pow(1 + discountRate / 100, flow.year);
      return {
        year: flow.year,
        presentValue: presentValue,
        futureValue: flow.amount,
      };
    });
  }, [cashFlows, discountRate]);

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

  const { isPositiveNPV, totalNPV, isPositiveTotalNPV, totalCashFlows } = calculatedValues;

  return (
    <div className="space-y-6">
      {/* Per Hectare NPV Result */}
      <Card className={`shadow-lg border-0 ${isPositiveNPV ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-red-50 to-rose-50'}`}>
        <CardHeader className={`${isPositiveNPV ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-rose-600'} text-white rounded-t-lg`}>
          <CardTitle className="flex items-center gap-2">
            {isPositiveNPV ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
            NPV Per Hectare
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${isPositiveNPV ? 'text-green-700' : 'text-red-700'}`}>
              {formatCurrency(npv)}
            </div>
            <div className={`text-lg font-medium ${isPositiveNPV ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveNPV ? 'Profitable Per Hectare' : 'Unprofitable Per Hectare'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Project NPV */}
      <Card className={`shadow-lg border-0 ${isPositiveTotalNPV ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-gradient-to-br from-orange-50 to-red-50'}`}>
        <CardHeader className={`${isPositiveTotalNPV ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-orange-600 to-red-600'} text-white rounded-t-lg`}>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Total Project Value
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center">
            <div className={`text-5xl font-bold mb-2 ${isPositiveTotalNPV ? 'text-blue-700' : 'text-orange-700'}`}>
              {formatCurrency(totalNPV)}
            </div>
            <div className={`text-lg font-medium ${isPositiveTotalNPV ? 'text-blue-600' : 'text-orange-600'}`}>
              {totalHectares} Hectare{totalHectares !== 1 ? 's' : ''} Total
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {formatCurrency(npv)} × {totalHectares} hectare{totalHectares !== 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Excel Export Button */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Export Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <p className="text-gray-600">
              Generate a comprehensive Excel report with interactive formulas
            </p>
            <p className="text-sm text-gray-500">
              Modify inputs in Excel and see results update automatically
            </p>
            <ExcelExportButton
              discountRate={discountRate}
              baseCashFlow={baseCashFlow}
              increaseValue={increaseValue}
              increaseType={increaseType}
              increaseFrequency={increaseFrequency}
              timePeriod={cashFlows.length}
              totalHectares={totalHectares}
              cashFlows={cashFlows}
              npvPerHectare={npv}
            />
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
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Total Cash Inflows</div>
              <div className="text-xl font-semibold text-orange-700">
                {formatCurrency(totalCashFlows)}
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
                const presentValue = flow.amount / Math.pow(1 + discountRate / 100, flow.year);
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
    prevProps.cashFlows.length === nextProps.cashFlows.length &&
    prevProps.cashFlows.every((flow, index) => 
      flow.id === nextProps.cashFlows[index]?.id &&
      flow.year === nextProps.cashFlows[index]?.year &&
      flow.amount === nextProps.cashFlows[index]?.amount
    )
  );
};

export default React.memo(ResultsDisplay, arePropsEqual);
