import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface ProgressIndicatorProps {
  completionPercentage: number;
  totalSteps: number;
  completedSteps: number;
  currentStep: string;
  errors: number;
  warnings: number;
  isValid: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  completionPercentage,
  totalSteps,
  completedSteps,
  currentStep,
  errors,
  warnings,
  isValid
}) => {
  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = () => {
    if (isValid) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (errors > 0) return <AlertCircle className="w-5 h-5 text-red-600" />;
    return <Clock className="w-5 h-5 text-yellow-600" />;
  };

  const getStatusText = () => {
    if (isValid) return 'Ready to Calculate';
    if (errors > 0) return 'Requires Attention';
    return 'In Progress';
  };

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          {getStatusIcon()}
          Configuration Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Status Summary */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-800">{completedSteps}/{totalSteps}</div>
              <div className="text-gray-600">Steps Complete</div>
            </div>
            <div className="text-center">
              <div className={`font-semibold ${getStatusColor(completionPercentage)}`}>
                {getStatusText()}
              </div>
              <div className="text-gray-600">Status</div>
            </div>
          </div>

          {/* Error/Warning Summary */}
          {(errors > 0 || warnings > 0) && (
            <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
              {errors > 0 && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors} Error{errors !== 1 ? 's' : ''}</span>
                </div>
              )}
              {warnings > 0 && (
                <div className="flex items-center gap-1 text-yellow-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{warnings} Warning{warnings !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          )}

          {/* Current Step */}
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
            Current focus: {currentStep}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressIndicator;