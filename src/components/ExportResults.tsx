import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Mail, MessageSquare, Download } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useToast } from '@/hooks/use-toast';

interface ExportResultsProps {
  npv: number;
  totalHectares: number;
  baseCashFlow: number;
  increaseValue: number;
  increaseType: 'amount' | 'percent';
  paymentTiming: 'beginning' | 'middle' | 'end';
}

const ExportResults: React.FC<ExportResultsProps> = ({
  npv,
  totalHectares,
  baseCashFlow,
  increaseValue,
  increaseType,
  paymentTiming
}) => {
  const { formatCurrency } = useCurrency();
  const { toast } = useToast();

  const formatExportText = () => {
    const npvPerSquareMeter = npv / 10000;
    const totalInvestment = npv * totalHectares;
    
    return `UPFRONT LEASE VALUATION ANALYSIS

EXECUTIVE SUMMARY
This analysis presents the present value of projected lease payments for informed investment decision-making.

KEY FINANCIAL METRICS
Deal Value per Square Meter: ${formatCurrency(Math.max(0, npvPerSquareMeter))}
Deal Value per Hectare: ${formatCurrency(Math.max(0, npv))}
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

  const handleGeneratePDF = () => {
    // Create a simple HTML document for PDF generation
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Upfront Lease Valuation Results</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; color: #2563eb; margin-bottom: 30px; }
          .section { margin: 20px 0; padding: 15px; border-left: 4px solid #2563eb; }
          .value { font-weight: bold; color: #059669; }
          .label { color: #4b5563; margin-right: 10px; }
          .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Upfront Lease Valuation Analysis</h1>
          <p>Executive Investment Summary</p>
        </div>
        
        <div class="section">
          <h2>Executive Summary</h2>
          <p>This analysis presents the present value of projected lease payments for informed investment decision-making.</p>
        </div>
        
        <div class="section">
          <h2>Key Financial Metrics</h2>
          <p><span class="label">Deal Value per Square Meter:</span><span class="value">${formatCurrency(Math.max(0, npv / 10000))}</span></p>
          <p><span class="label">Deal Value per Hectare:</span><span class="value">${formatCurrency(Math.max(0, npv))}</span></p>
          <p><span class="label">Total Investment Required:</span><span class="value">${formatCurrency(Math.max(0, npv * totalHectares))}</span></p>
        </div>
        
        <div class="section">
          <h2>Lease Structure</h2>
          <p><span class="label">Property Size:</span><span class="value">${totalHectares} hectare(s)</span></p>
          <p><span class="label">Initial Annual Payment:</span><span class="value">${formatCurrency(baseCashFlow)} per square meter</span></p>
          <p><span class="label">Annual Escalation:</span><span class="value">${increaseType === 'percent' ? `${increaseValue}% annually` : `${formatCurrency(increaseValue)} per square meter annually`}</span></p>
          <p><span class="label">Payment Schedule:</span><span class="value">${paymentTiming.charAt(0).toUpperCase() + paymentTiming.slice(1)} of year</span></p>
        </div>
        
        <div class="section">
          <h2>Investment Overview</h2>
          <p>The calculated upfront lease value represents the net present value of all future lease payments, providing a comprehensive assessment of the investment opportunity based on current market conditions and projected cash flows.</p>
        </div>
        
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lease-valuation-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "PDF Report Generated",
      description: "Your lease valuation report has been downloaded",
    });
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