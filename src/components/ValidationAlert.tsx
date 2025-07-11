import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ValidationAlertProps {
  type: 'error' | 'warning' | 'success' | 'info';
  title?: string;
  message: string;
  className?: string;
}

const ValidationAlert: React.FC<ValidationAlertProps> = ({
  type,
  title,
  message,
  className = ''
}) => {
  const getAlertConfig = () => {
    switch (type) {
      case 'error':
        return {
          icon: AlertTriangle,
          className: 'border-red-200 bg-red-50 text-red-800',
          iconColor: 'text-red-600'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          className: 'border-orange-200 bg-orange-50 text-orange-800',
          iconColor: 'text-orange-600'
        };
      case 'success':
        return {
          icon: CheckCircle,
          className: 'border-green-200 bg-green-50 text-green-800',
          iconColor: 'text-green-600'
        };
      case 'info':
      default:
        return {
          icon: Info,
          className: 'border-blue-200 bg-blue-50 text-blue-800',
          iconColor: 'text-blue-600'
        };
    }
  };

  const config = getAlertConfig();
  const Icon = config.icon;

  return (
    <Alert className={`${config.className} ${className}`}>
      <Icon className={`h-4 w-4 ${config.iconColor}`} />
      <div>
        {title && <div className="font-medium mb-1">{title}</div>}
        <AlertDescription className="text-sm">
          {message}
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default ValidationAlert;