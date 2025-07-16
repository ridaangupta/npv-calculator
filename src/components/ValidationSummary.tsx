import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

interface ValidationSummaryProps {
  errors: ValidationError[];
  warnings: ValidationError[];
  className?: string;
}

const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  errors,
  warnings,
  className = ''
}) => {
  if (errors.length === 0 && warnings.length === 0) {
    return (
      <Alert className={`border-green-200 bg-green-50 text-green-800 ${className}`}>
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-sm">
          All validation checks passed. Configuration is ready for calculation.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Errors */}
      {errors.length > 0 && (
        <Alert className="border-red-200 bg-red-50 text-red-800">
          <XCircle className="h-4 w-4 text-red-600" />
          <div>
            <div className="font-medium mb-2">
              {errors.length} Error{errors.length !== 1 ? 's' : ''} Found
            </div>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm">
                    <strong>{error.field}:</strong> {error.message}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <div>
            <div className="font-medium mb-2">
              {warnings.length} Warning{warnings.length !== 1 ? 's' : ''} Found
            </div>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index} className="text-sm">
                    <strong>{warning.field}:</strong> {warning.message}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default ValidationSummary;