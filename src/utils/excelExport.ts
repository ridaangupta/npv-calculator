
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface CashFlow {
  id: string;
  year: number;
  amount: number;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimalDigits: number;
}

interface ExportData {
  // Input parameters
  discountRate: number;
  baseCashFlow: number;
  increaseValue: number;
  increaseType: 'amount' | 'percent';
  increaseFrequency: number;
  timePeriod: number;
  totalHectares: number;
  currency: Currency;
  
  // Calculated data
  cashFlows: CashFlow[];
  npvPerHectare: number;
  totalNPV: number;
}

export const generateExcelReport = (data: ExportData) => {
  const workbook = XLSX.utils.book_new();
  
  // Create Input Parameters worksheet
  createInputSheet(workbook, data);
  
  // Create Calculations worksheet
  createCalculationsSheet(workbook, data);
  
  // Create Results Summary worksheet
  createResultsSheet(workbook, data);
  
  // Create Chart Data worksheet
  createChartDataSheet(workbook, data);
  
  // Create Instructions worksheet
  createInstructionsSheet(workbook, data);
  
  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const filename = `NPV_Analysis_${data.currency.code}_${timestamp}.xlsx`;
  
  // Write and download the file
  XLSX.writeFile(workbook, filename);
};

const createInputSheet = (workbook: XLSX.WorkBook, data: ExportData) => {
  const ws = XLSX.utils.aoa_to_sheet([]);
  
  // Header
  XLSX.utils.sheet_add_aoa(ws, [
    ['NPV Calculator - Input Parameters'],
    [''],
    ['Parameter', 'Value', 'Unit', 'Description'],
    ['Currency', data.currency.code, '', data.currency.name],
    ['Discount Rate', data.discountRate, '%', 'Annual discount rate for NPV calculation'],
    ['Initial Lease Rent', data.baseCashFlow, `${data.currency.symbol}/m²/year`, 'Base cash flow per square meter per year'],
    ['Increase Value', data.increaseValue, data.increaseType === 'percent' ? '%' : `${data.currency.symbol}/m²`, `Total increase over ${data.increaseFrequency} year(s)`],
    ['Increase Type', data.increaseType === 'percent' ? 'Percentage' : 'Fixed Amount', '', 'Type of cash flow increase'],
    ['Increase Frequency', data.increaseFrequency, 'years', 'Period over which increase is applied'],
    ['Time Period', data.timePeriod, 'years', 'Total analysis period'],
    ['Total Hectares', data.totalHectares, 'hectares', 'Total project area'],
    [''],
    ['Generated on:', new Date().toLocaleString()],
  ], { origin: 'A1' });
  
  // Styling
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  
  // Set column widths
  ws['!cols'] = [
    { wch: 20 }, // Parameter
    { wch: 15 }, // Value
    { wch: 15 }, // Unit
    { wch: 40 }, // Description
  ];
  
  // Make values editable (named ranges for easy reference)
  ws['B5'] = { f: 'DiscountRate', t: 'n', v: data.discountRate };
  ws['B6'] = { f: 'BaseCashFlow', t: 'n', v: data.baseCashFlow };
  ws['B7'] = { f: 'IncreaseValue', t: 'n', v: data.increaseValue };
  ws['B9'] = { f: 'IncreaseFrequency', t: 'n', v: data.increaseFrequency };
  ws['B10'] = { f: 'TimePeriod', t: 'n', v: data.timePeriod };
  ws['B11'] = { f: 'TotalHectares', t: 'n', v: data.totalHectares };
  
  XLSX.utils.book_append_sheet(workbook, ws, 'Input Parameters');
};

const createCalculationsSheet = (workbook: XLSX.WorkBook, data: ExportData) => {
  const ws = XLSX.utils.aoa_to_sheet([]);
  
  // Header
  XLSX.utils.sheet_add_aoa(ws, [
    ['NPV Calculator - Cash Flow Calculations'],
    [''],
    ['Year', 'Cash Flow (per m²)', 'Cash Flow (per hectare)', 'Present Value', 'Cumulative PV'],
    // Data rows will be added with formulas
  ], { origin: 'A1' });
  
  // Calculate annual increase
  const annualIncrease = data.increaseValue / data.increaseFrequency;
  
  // Add calculation rows with Excel formulas
  for (let year = 1; year <= data.timePeriod; year++) {
    const row = year + 3;
    
    // Year
    XLSX.utils.sheet_add_aoa(ws, [[year]], { origin: `A${row}` });
    
    // Cash flow per m² with formula
    if (year === 1) {
      XLSX.utils.sheet_add_aoa(ws, [[{ f: 'BaseCashFlow' }]], { origin: `B${row}` });
    } else {
      if (data.increaseType === 'amount') {
        XLSX.utils.sheet_add_aoa(ws, [[{ f: `B${row-1}+IncreaseValue/IncreaseFrequency` }]], { origin: `B${row}` });
      } else {
        XLSX.utils.sheet_add_aoa(ws, [[{ f: `B${row-1}*(1+IncreaseValue/IncreaseFrequency/100)` }]], { origin: `B${row}` });
      }
    }
    
    // Cash flow per hectare (multiply by 10,000)
    XLSX.utils.sheet_add_aoa(ws, [[{ f: `B${row}*10000` }]], { origin: `C${row}` });
    
    // Present Value
    XLSX.utils.sheet_add_aoa(ws, [[{ f: `C${row}/POWER(1+DiscountRate/100,A${row})` }]], { origin: `D${row}` });
    
    // Cumulative Present Value
    if (year === 1) {
      XLSX.utils.sheet_add_aoa(ws, [[{ f: `D${row}` }]], { origin: `E${row}` });
    } else {
      XLSX.utils.sheet_add_aoa(ws, [[{ f: `E${row-1}+D${row}` }]], { origin: `E${row}` });
    }
  }
  
  // Add totals row
  const totalRow = data.timePeriod + 5;
  XLSX.utils.sheet_add_aoa(ws, [
    [''],
    ['TOTALS:', '', '', { f: `SUM(D4:D${data.timePeriod + 3})` }, '']
  ], { origin: `A${totalRow}` });
  
  // Set column widths
  ws['!cols'] = [
    { wch: 8 },  // Year
    { wch: 18 }, // Cash Flow per m²
    { wch: 20 }, // Cash Flow per hectare
    { wch: 18 }, // Present Value
    { wch: 18 }, // Cumulative PV
  ];
  
  XLSX.utils.book_append_sheet(workbook, ws, 'Calculations');
};

const createResultsSheet = (workbook: XLSX.WorkBook, data: ExportData) => {
  const ws = XLSX.utils.aoa_to_sheet([]);
  
  XLSX.utils.sheet_add_aoa(ws, [
    ['NPV Calculator - Results Summary'],
    [''],
    ['Metric', 'Value', 'Unit', 'Status'],
    ['NPV per Hectare', { f: `Calculations.D${data.timePeriod + 4}` }, data.currency.symbol, { f: `IF(B4>0,"Profitable","Unprofitable")` }],
    ['Total Project NPV', { f: 'B4*TotalHectares' }, data.currency.symbol, { f: `IF(B5>0,"Profitable","Unprofitable")` }],
    [''],
    ['Project Details', '', '', ''],
    ['Total Hectares', { f: 'TotalHectares' }, 'hectares', ''],
    ['Analysis Period', { f: 'TimePeriod' }, 'years', ''],
    ['Discount Rate', { f: 'DiscountRate' }, '%', ''],
    [''],
    ['Cash Flow Summary', '', '', ''],
    ['Total Future Cash Flows', { f: `SUM(Calculations.C4:C${data.timePeriod + 3})` }, `${data.currency.symbol}/hectare`, ''],
    ['Total Present Value', { f: `Calculations.D${data.timePeriod + 4}` }, `${data.currency.symbol}/hectare`, ''],
    [''],
    ['Key Insights', '', '', ''],
    ['Break-even Year', 'See Chart Data', '', ''],
    ['Average Annual Cash Flow', { f: `AVERAGE(Calculations.C4:C${data.timePeriod + 3})` }, `${data.currency.symbol}/hectare`, ''],
    ['Final Year Cash Flow', { f: `Calculations.C${data.timePeriod + 3}` }, `${data.currency.symbol}/hectare`, ''],
  ], { origin: 'A1' });
  
  // Set column widths
  ws['!cols'] = [
    { wch: 25 }, // Metric
    { wch: 20 }, // Value
    { wch: 15 }, // Unit
    { wch: 15 }, // Status
  ];
  
  XLSX.utils.book_append_sheet(workbook, ws, 'Results Summary');
};

const createChartDataSheet = (workbook: XLSX.WorkBook, data: ExportData) => {
  const ws = XLSX.utils.aoa_to_sheet([]);
  
  XLSX.utils.sheet_add_aoa(ws, [
    ['Chart Data - Ready for Excel Charts'],
    [''],
    ['Year', 'Future Value', 'Present Value', 'Cumulative PV'],
  ], { origin: 'A1' });
  
  // Add data references to calculations sheet
  for (let year = 1; year <= data.timePeriod; year++) {
    const row = year + 3;
    XLSX.utils.sheet_add_aoa(ws, [[
      { f: `Calculations.A${row}` },    // Year
      { f: `Calculations.C${row}` },    // Future Value
      { f: `Calculations.D${row}` },    // Present Value
      { f: `Calculations.E${row}` },    // Cumulative PV
    ]], { origin: `A${row}` });
  }
  
  // Set column widths
  ws['!cols'] = [
    { wch: 8 },  // Year
    { wch: 15 }, // Future Value
    { wch: 15 }, // Present Value
    { wch: 15 }, // Cumulative PV
  ];
  
  XLSX.utils.book_append_sheet(workbook, ws, 'Chart Data');
};

const createInstructionsSheet = (workbook: XLSX.WorkBook, data: ExportData) => {
  const ws = XLSX.utils.aoa_to_sheet([]);
  
  XLSX.utils.sheet_add_aoa(ws, [
    ['NPV Calculator - User Instructions'],
    [''],
    ['How to Use This Excel File:'],
    [''],
    ['1. MODIFYING INPUTS:'],
    ['   • Go to the "Input Parameters" sheet'],
    ['   • Change any values in column B (rows 5-11)'],
    ['   • All calculations will update automatically'],
    [''],
    ['2. VIEWING RESULTS:'],
    ['   • Check the "Results Summary" sheet for key metrics'],
    ['   • Review the "Calculations" sheet for detailed cash flows'],
    ['   • All values are linked with Excel formulas'],
    [''],
    ['3. CREATING CHARTS:'],
    ['   • Use data from the "Chart Data" sheet'],
    ['   • Recommended chart types:'],
    ['     - Line chart for cash flow trends'],
    ['     - Column chart for present value comparison'],
    ['     - Area chart for cumulative present value'],
    [''],
    ['4. SCENARIO ANALYSIS:'],
    ['   • Create multiple copies of this file'],
    ['   • Modify inputs for different scenarios'],
    ['   • Compare NPV results across scenarios'],
    [''],
    ['5. KEY FORMULAS USED:'],
    ['   • Present Value = Future Value / (1 + Discount Rate)^Year'],
    ['   • NPV = Sum of all Present Values'],
    ['   • Cash Flow per Hectare = Cash Flow per m² × 10,000'],
    [''],
    ['6. IMPORTANT NOTES:'],
    ['   • Do not modify formulas in the Calculations sheet'],
    ['   • Only change values in the Input Parameters sheet'],
    ['   • Currency conversions are not automatic - use web app for currency changes'],
    [''],
    ['Generated by NPV Calculator Web Application'],
    [`Report Date: ${new Date().toLocaleDateString()}`],
    [`Currency: ${data.currency.name} (${data.currency.code})`],
  ], { origin: 'A1' });
  
  // Set column width
  ws['!cols'] = [{ wch: 80 }];
  
  XLSX.utils.book_append_sheet(workbook, ws, 'Instructions');
};
