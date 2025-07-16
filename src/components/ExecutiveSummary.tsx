import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Target, Clock, CheckCircle } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ExecutiveSummaryProps {
  leaseValue: number;
  totalHectares: number;
  totalInvestment: number;
  paymentScheduleComplete: boolean;
  percentageAllocated: number;
  paymentCount: number;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  leaseValue,
  totalHectares,
  totalInvestment,
  paymentScheduleComplete,
  percentageAllocated,
  paymentCount
}) => {
  const { formatCurrency } = useCurrency();

  const getStatusColor = (percentage: number) => {
    if (percentage >= 95) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 95) return 'Ready for Execution';
    if (percentage >= 75) return 'Needs Completion';
    return 'Requires Configuration';
  };

  const summaryCards = [
    {
      title: 'Investment Value',
      value: formatCurrency(Math.max(0, leaseValue)),
      subtitle: 'Per hectare lease value',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      textColor: 'text-green-100'
    },
    {
      title: 'Total Investment',
      value: formatCurrency(Math.max(0, totalInvestment)),
      subtitle: `${totalHectares} hectare${totalHectares !== 1 ? 's' : ''} total`,
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-100'
    },
    {
      title: 'Payment Schedule',
      value: `${paymentCount} Payment${paymentCount !== 1 ? 's' : ''}`,
      subtitle: `${percentageAllocated.toFixed(1)}% allocated`,
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-100'
    },
    {
      title: 'Deal Status',
      value: getStatusText(percentageAllocated),
      subtitle: paymentScheduleComplete ? 'Complete' : 'In Progress',
      icon: CheckCircle,
      color: 'from-gray-500 to-gray-600',
      textColor: 'text-gray-100'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Executive Summary</h2>
        <p className="text-gray-600">Key metrics for your investment decision</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <Card key={index} className={`shadow-lg border-0 bg-gradient-to-br ${card.color} text-white`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${card.textColor} text-sm font-medium`}>{card.title}</p>
                  <p className="text-lg font-bold truncate">{card.value}</p>
                  <p className={`${card.textColor} text-xs mt-1`}>{card.subtitle}</p>
                </div>
                <card.icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <TrendingUp className="w-5 h-5" />
            Deal Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Configuration Progress</span>
              <Badge 
                variant={percentageAllocated >= 95 ? 'default' : 'secondary'}
                className={`${getStatusColor(percentageAllocated)} text-white`}
              >
                {percentageAllocated.toFixed(1)}%
              </Badge>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getStatusColor(percentageAllocated)}`}
                style={{ width: `${Math.min(percentageAllocated, 100)}%` }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-800">{formatCurrency(Math.max(0, leaseValue))}</div>
                <div className="text-gray-600">Value per Hectare</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-800">{paymentCount}</div>
                <div className="text-gray-600">Payment Installments</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-800">{totalHectares}</div>
                <div className="text-gray-600">Total Hectares</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveSummary;