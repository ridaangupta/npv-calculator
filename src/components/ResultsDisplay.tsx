
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';

interface CashFlow {
  id: string;
  year: number;
  amount: number;
}

interface ResultsDisplayProps {
  npv: number;
  initialInvestment: number;
  discountRate: number;
  cashFlows: CashFlow[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  npv,
  initialInvestment,
  discountRate,
  cashFlows
}) => {
  const isPositiveNPV = npv > 0;
  const totalCashFlows = cashFlows.reduce((sum, flow) => sum + flow.amount, 0);
  const roiPercentage = initialInvestment > 0 ? ((totalCashFlows - initialInvestment) / initialInvestment) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Main NPV Result */}
      <Card className={`shadow-lg border-0 ${isPositiveNPV ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-red-50 to-rose-50'}`}>
        <CardHeader className={`${isPositiveNPV ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-rose-600'} text-white rounded-t-lg`}>
          <CardTitle className="flex items-center gap-2">
            {isPositiveNPV ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
            Net Present Value
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${isPositiveNPV ? 'text-green-700' : 'text-red-700'}`}>
              {formatCurrency(npv)}
            </div>
            <div className={`text-lg font-medium ${isPositiveNPV ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveNPV ? 'Profitable Investment' : 'Unprofitable Investment'}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {isPositiveNPV 
                ? 'This investment is expected to generate positive returns.'
                : 'This investment is expected to generate negative returns.'
              }
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Investment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Initial Investment</div>
              <div className="text-xl font-semibold text-blue-700">
                {formatCurrency(initialInvestment)}
              </div>
            </div>
            
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
            
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Simple ROI</div>
              <div className="text-xl font-semibold text-indigo-700 flex items-center justify-center gap-1">
                {roiPercentage.toFixed(1)}
                <Percent className="w-4 h-4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Breakdown */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
          <CardTitle>Present Value Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="font-medium text-gray-700">Year 0 (Initial Investment)</span>
              <span className="font-semibold text-red-600">
                -{formatCurrency(initialInvestment)}
              </span>
            </div>
            
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
