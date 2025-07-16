import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Mail, MessageSquare, Download } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useToast } from '@/hooks/use-toast';
import html2pdf from 'html2pdf.js';

interface ExportResultsProps {
  leaseValue: number;
  totalHectares: number;
  baseCashFlow: number;
  increaseValue: number;
  increaseType: 'amount' | 'percent';
  paymentTiming: 'beginning' | 'middle' | 'end';
}

const ExportResults: React.FC<ExportResultsProps> = ({
  leaseValue,
  totalHectares,
  baseCashFlow,
  increaseValue,
  increaseType,
  paymentTiming
}) => {
  const { formatCurrency } = useCurrency();
  const { toast } = useToast();

  const formatExportText = () => {
    const valuePerSquareMeter = leaseValue / 10000;
    const totalInvestment = leaseValue * totalHectares;
    
    return `UPFRONT LEASE VALUATION ANALYSIS

EXECUTIVE SUMMARY
This analysis presents the present value of projected lease payments for informed investment decision-making.

KEY FINANCIAL METRICS
Deal Value per Square Meter: ${formatCurrency(Math.max(0, valuePerSquareMeter))}
Deal Value per Hectare: ${formatCurrency(Math.max(0, leaseValue))}
Total Investment Required: ${formatCurrency(Math.max(0, totalInvestment))}

LEASE STRUCTURE
Property Size: ${totalHectares} hectare(s)
Initial Annual Payment: ${formatCurrency(baseCashFlow)} per square meter
Annual Escalation: ${increaseType === 'percent' ? `${increaseValue}% annually` : `${formatCurrency(increaseValue)} per square meter annually`}
Payment Schedule: ${paymentTiming.charAt(0).toUpperCase() + paymentTiming.slice(1)} of year

INVESTMENT OVERVIEW
The calculated upfront lease value represents the net present value of all future lease payments, providing a comprehensive assessment of the investment opportunity based on current market conditions and projected cash flows.`;
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formatExportText());
      toast({
        title: "Copied to clipboard",
        description: "Results have been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(formatExportText());
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent('Upfront Lease Valuation Results');
    const body = encodeURIComponent(formatExportText());
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleGeneratePDF = async () => {
    try {
      const valuePerSquareMeter = leaseValue / 10000;
      const totalInvestment = leaseValue * totalHectares;
      
      // Create a temporary div with the content
      const element = document.createElement('div');
      element.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6;">
          <div style="text-align: center; color: #2563eb; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 24px;">Upfront Lease Valuation Analysis</h1>
            <p style="margin: 10px 0; font-size: 16px;">Executive Investment Summary</p>
          </div>
          
          <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #2563eb;">
            <h2 style="color: #1f2937; margin: 0 0 10px 0;">Executive Summary</h2>
            <p style="margin: 0;">This analysis presents the present value of projected lease payments for informed investment decision-making.</p>
          </div>
          
          <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #2563eb;">
            <h2 style="color: #1f2937; margin: 0 0 10px 0;">Key Financial Metrics</h2>
            <p style="margin: 5px 0;"><span style="color: #4b5563; margin-right: 10px;">Deal Value per Square Meter:</span><span style="font-weight: bold; color: #059669;">${formatCurrency(Math.max(0, valuePerSquareMeter))}</span></p>
            <p style="margin: 5px 0;"><span style="color: #4b5563; margin-right: 10px;">Deal Value per Hectare:</span><span style="font-weight: bold; color: #059669;">${formatCurrency(Math.max(0, leaseValue))}</span></p>
            <p style="margin: 5px 0;"><span style="color: #4b5563; margin-right: 10px;">Total Investment Required:</span><span style="font-weight: bold; color: #059669;">${formatCurrency(Math.max(0, totalInvestment))}</span></p>
          </div>
          
          <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #2563eb;">
            <h2 style="color: #1f2937; margin: 0 0 10px 0;">Lease Structure</h2>
            <p style="margin: 5px 0;"><span style="color: #4b5563; margin-right: 10px;">Property Size:</span><span style="font-weight: bold; color: #059669;">${totalHectares} hectare(s)</span></p>
            <p style="margin: 5px 0;"><span style="color: #4b5563; margin-right: 10px;">Initial Annual Payment:</span><span style="font-weight: bold; color: #059669;">${formatCurrency(baseCashFlow)} per square meter</span></p>
            <p style="margin: 5px 0;"><span style="color: #4b5563; margin-right: 10px;">Annual Escalation:</span><span style="font-weight: bold; color: #059669;">${increaseType === 'percent' ? `${increaseValue}% annually` : `${formatCurrency(increaseValue)} per square meter annually`}</span></p>
            <p style="margin: 5px 0;"><span style="color: #4b5563; margin-right: 10px;">Payment Schedule:</span><span style="font-weight: bold; color: #059669;">${paymentTiming.charAt(0).toUpperCase() + paymentTiming.slice(1)} of year</span></p>
          </div>
          
          <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #2563eb;">
            <h2 style="color: #1f2937; margin: 0 0 10px 0;">Investment Overview</h2>
            <p style="margin: 0;">The calculated upfront lease value represents the net present value of all future lease payments, providing a comprehensive assessment of the investment opportunity based on current market conditions and projected cash flows.</p>
          </div>
        </div>
      `;

      const opt = {
        margin: 1,
        filename: `lease-valuation-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      
      toast({
        title: "PDF Report Generated",
        description: "Your lease valuation report has been downloaded",
      });
    } catch (error) {
      toast({
        title: "PDF Generation Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Share2 className="w-5 h-5" />
          Export Results
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleCopyToClipboard}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy to Clipboard
          </Button>
          
          <Button
            onClick={handleShareWhatsApp}
            variant="outline"
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Share via WhatsApp
          </Button>
          
          <Button
            onClick={handleShareEmail}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Share via Email
          </Button>
          
          <Button
            onClick={handleGeneratePDF}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Generate PDF Report
          </Button>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Preview of export format:</p>
          <div className="text-xs text-gray-500 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
            {formatExportText().substring(0, 200)}...
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportResults;