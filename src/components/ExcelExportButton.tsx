
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Download, AlertCircle } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useToast } from '@/hooks/use-toast';

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
  const [isLoadingExcelLibrary, setIsLoadingExcelLibrary] = useState(false);
  const { selectedCurrency } = useCurrency();
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    setIsLoadingExcelLibrary(true);
    
    try {
      // Dynamic import - loads Excel functionality only when needed
      console.log('Loading Excel export library...');
      const { generateExcelReport } = await import('@/utils/excelExport');
      
      setIsLoadingExcelLibrary(false);
      console.log('Excel library loaded, generating report...');
      
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
      
      toast({
        title: "Export Successful",
        description: "Your Excel report has been downloaded successfully.",
      });
      
    } catch (error) {
      console.error('Error during Excel export:', error);
      
      toast({
        title: "Export Failed",
        description: "There was an error generating the Excel report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setIsLoadingExcelLibrary(false);
    }
  };

  const getButtonText = () => {
    if (isLoadingExcelLibrary) return 'Loading Excel Library...';
    if (isExporting) return 'Generating Excel...';
    return 'Export to Excel';
  };

  const getButtonIcon = () => {
    if (isLoadingExcelLibrary) {
      return <Download className="w-4 h-4 mr-2 animate-pulse" />;
    }
    if (isExporting) {
      return <Download className="w-4 h-4 mr-2 animate-spin" />;
    }
    return <FileSpreadsheet className="w-4 h-4 mr-2" />;
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting || isLoadingExcelLibrary}
      className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
      size="lg"
    >
      {getButtonIcon()}
      {getButtonText()}
    </Button>
  );
};

export default ExcelExportButton;
