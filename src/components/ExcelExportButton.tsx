
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Download } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { generateExcelReport } from '@/utils/excelExport';

interface CashFlow {
  id: string;
  year: number;
  amount: number;
}

interface ExcelExportButtonProps {
  discountRate: number;
  baseCashFlow: number;
  increaseValue: number;
  increaseType: 'amount' | 'percent';
  increaseFrequency: number;
  timePeriod: number;
  totalHectares: number;
  cashFlows: CashFlow[];
  npvPerHectare: number;
}

const ExcelExportButton: React.FC<ExcelExportButtonProps> = ({
  discountRate,
  baseCashFlow,
  increaseValue,
  increaseType,
  increaseFrequency,
  timePeriod,
  totalHectares,
  cashFlows,
  npvPerHectare
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { selectedCurrency } = useCurrency();

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const exportData = {
        discountRate,
        baseCashFlow,
        increaseValue,
        increaseType,
        increaseFrequency,
        timePeriod,
        totalHectares,
        currency: selectedCurrency,
        cashFlows,
        npvPerHectare,
        totalNPV: npvPerHectare * totalHectares
      };
      
      await generateExcelReport(exportData);
    } catch (error) {
      console.error('Error generating Excel report:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      className="w-full bg-green-600 hover:bg-green-700 text-white"
      size="lg"
    >
      {isExporting ? (
        <Download className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <FileSpreadsheet className="w-4 h-4 mr-2" />
      )}
      {isExporting ? 'Generating Excel...' : 'Export to Excel'}
    </Button>
  );
};

export default ExcelExportButton;
