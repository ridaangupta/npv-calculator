
import ExcelJS from 'exceljs';
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

export const generateExcelReport = async (data: ExportData) => {
  const workbook = new ExcelJS.Workbook();
  
  // Create worksheets
  createInputSheet(workbook, data);
  createCalculationsSheet(workbook, data);
  createResultsSheet(workbook, data);
  createChartDataSheet(workbook, data);
  createInstructionsSheet(workbook, data);
  
  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const filename = `NPV_Analysis_${data.currency.code}_${timestamp}.xlsx`;
  
  // Write and download the file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, filename);
};

const createInputSheet = (workbook: ExcelJS.Workbook, data: ExportData) => {
  const worksheet = workbook.addWorksheet('Input Parameters');
  
  // Header
  worksheet.addRow(['NPV Calculator - Input Parameters']);
  worksheet.addRow(['']);
  worksheet.addRow(['Parameter', 'Value', 'Unit', 'Description']);
  worksheet.addRow(['Currency', data.currency.code, '', data.currency.name]);
  worksheet.addRow(['Discount Rate', data.discountRate, '%', 'Annual discount rate for NPV calculation']);
  worksheet.addRow(['Initial Lease Rent', data.baseCashFlow, `${data.currency.symbol}/m²/year`, 'Base cash flow per square meter per year']);
  worksheet.addRow(['Increase Value', data.increaseValue, data.increaseType === 'percent' ? '%' : `${data.currency.symbol}/m²`, `Total increase over ${data.increaseFrequency} year(s)`]);
  worksheet.addRow(['Increase Type', data.increaseType === 'percent' ? 'Percentage' : 'Fixed Amount', '', 'Type of cash flow increase']);
  worksheet.addRow(['Increase Frequency', data.increaseFrequency, 'years', 'Period over which increase is applied']);
  worksheet.addRow(['Time Period', data.timePeriod, 'years', 'Total analysis period']);
  worksheet.addRow(['Total Hectares', data.totalHectares, 'hectares', 'Total project area']);
  worksheet.addRow(['']);
  worksheet.addRow(['Generated on:', new Date().toLocaleString()]);
  
  // Set column widths
  worksheet.getColumn(1).width = 20;
  worksheet.getColumn(2).width = 15;
  worksheet.getColumn(3).width = 15;
  worksheet.getColumn(4).width = 40;
  
  // Style the header
  worksheet.getRow(1).font = { bold: true, size: 14 };
  worksheet.getRow(3).font = { bold: true };
  
  // Define named ranges for inputs
  workbook.definedNames.add('DiscountRate', `'Input Parameters'!$B$5`);
  workbook.definedNames.add('BaseCashFlow', `'Input Parameters'!$B$6`);
  workbook.definedNames.add('IncreaseValue', `'Input Parameters'!$B$7`);
  workbook.definedNames.add('IncreaseFrequency', `'Input Parameters'!$B$9`);
  workbook.definedNames.add('TimePeriod', `'Input Parameters'!$B$10`);
  workbook.definedNames.add('TotalHectares', `'Input Parameters'!$B$11`);
};

const createCalculationsSheet = (workbook: ExcelJS.Workbook, data: ExportData) => {
  const worksheet = workbook.addWorksheet('Calculations');
  
  // Header
  worksheet.addRow(['NPV Calculator - Cash Flow Calculations']);
  worksheet.addRow(['']);
  worksheet.addRow(['Year', 'Cash Flow (per m²)', 'Cash Flow (per hectare)', 'Present Value', 'Cumulative PV']);
  
  // Add calculation rows with Excel formulas
  for (let year = 1; year <= data.timePeriod; year++) {
    const row = worksheet.addRow([]);
    
    // Year
    row.getCell(1).value = year;
    
    // Cash flow per m² with formula
    if (year === 1) {
      row.getCell(2).value = { formula: 'BaseCashFlow' };
    } else {
      if (data.increaseType === 'amount') {
        row.getCell(2).value = { formula: `B${year + 2}+IncreaseValue/IncreaseFrequency` };
      } else {
        row.getCell(2).value = { formula: `B${year + 2}*(1+IncreaseValue/IncreaseFrequency/100)` };
      }
    }
    
    // Cash flow per hectare (multiply by 10,000)
    row.getCell(3).value = { formula: `B${year + 3}*10000` };
    
    // Present Value
    row.getCell(4).value = { formula: `C${year + 3}/POWER(1+DiscountRate/100,A${year + 3})` };
    
    // Cumulative Present Value
    if (year === 1) {
      row.getCell(5).value = { formula: `D${year + 3}` };
    } else {
      row.getCell(5).value = { formula: `E${year + 2}+D${year + 3}` };
    }
  }
  
  // Add totals row
  worksheet.addRow(['']);
  const totalRow = worksheet.addRow(['TOTALS:', '', '', { formula: `SUM(D4:D${data.timePeriod + 3})` }, '']);
  totalRow.font = { bold: true };
  
  // Set column widths
  worksheet.getColumn(1).width = 8;
  worksheet.getColumn(2).width = 18;
  worksheet.getColumn(3).width = 20;
  worksheet.getColumn(4).width = 18;
  worksheet.getColumn(5).width = 18;
  
  // Style the header
  worksheet.getRow(1).font = { bold: true, size: 14 };
  worksheet.getRow(3).font = { bold: true };
};

const createResultsSheet = (workbook: ExcelJS.Workbook, data: ExportData) => {
  const worksheet = workbook.addWorksheet('Results Summary');
  
  worksheet.addRow(['NPV Calculator - Results Summary']);
  worksheet.addRow(['']);
  worksheet.addRow(['Metric', 'Value', 'Unit', 'Status']);
  worksheet.addRow(['NPV per Hectare', { formula: `Calculations.D${data.timePeriod + 4}` }, data.currency.symbol, { formula: 'IF(B4>0,"Profitable","Unprofitable")' }]);
  worksheet.addRow(['Total Project NPV', { formula: 'B4*TotalHectares' }, data.currency.symbol, { formula: 'IF(B5>0,"Profitable","Unprofitable")' }]);
  worksheet.addRow(['']);
  worksheet.addRow(['Project Details', '', '', '']);
  worksheet.addRow(['Total Hectares', { formula: 'TotalHectares' }, 'hectares', '']);
  worksheet.addRow(['Analysis Period', { formula: 'TimePeriod' }, 'years', '']);
  worksheet.addRow(['Discount Rate', { formula: 'DiscountRate' }, '%', '']);
  worksheet.addRow(['']);
  worksheet.addRow(['Cash Flow Summary', '', '', '']);
  worksheet.addRow(['Total Future Cash Flows', { formula: `SUM(Calculations.C4:C${data.timePeriod + 3})` }, `${data.currency.symbol}/hectare`, '']);
  worksheet.addRow(['Total Present Value', { formula: `Calculations.D${data.timePeriod + 4}` }, `${data.currency.symbol}/hectare`, '']);
  worksheet.addRow(['']);
  worksheet.addRow(['Key Insights', '', '', '']);
  worksheet.addRow(['Break-even Year', 'See Chart Data', '', '']);
  worksheet.addRow(['Average Annual Cash Flow', { formula: `AVERAGE(Calculations.C4:C${data.timePeriod + 3})` }, `${data.currency.symbol}/hectare`, '']);
  worksheet.addRow(['Final Year Cash Flow', { formula: `Calculations.C${data.timePeriod + 3}` }, `${data.currency.symbol}/hectare`, '']);
  
  // Set column widths
  worksheet.getColumn(1).width = 25;
  worksheet.getColumn(2).width = 20;
  worksheet.getColumn(3).width = 15;
  worksheet.getColumn(4).width = 15;
  
  // Style the header
  worksheet.getRow(1).font = { bold: true, size: 14 };
  worksheet.getRow(3).font = { bold: true };
};

const createChartDataSheet = (workbook: ExcelJS.Workbook, data: ExportData) => {
  const worksheet = workbook.addWorksheet('Chart Data');
  
  worksheet.addRow(['Chart Data - Ready for Excel Charts']);
  worksheet.addRow(['']);
  worksheet.addRow(['Year', 'Future Value', 'Present Value', 'Cumulative PV']);
  
  // Add data references to calculations sheet
  for (let year = 1; year <= data.timePeriod; year++) {
    const row = worksheet.addRow([
      { formula: `Calculations.A${year + 3}` },
      { formula: `Calculations.C${year + 3}` },
      { formula: `Calculations.D${year + 3}` },
      { formula: `Calculations.E${year + 3}` }
    ]);
  }
  
  // Set column widths
  worksheet.getColumn(1).width = 8;
  worksheet.getColumn(2).width = 15;
  worksheet.getColumn(3).width = 15;
  worksheet.getColumn(4).width = 15;
  
  // Style the header
  worksheet.getRow(1).font = { bold: true, size: 14 };
  worksheet.getRow(3).font = { bold: true };
};

const createInstructionsSheet = (workbook: ExcelJS.Workbook, data: ExportData) => {
  const worksheet = workbook.addWorksheet('Instructions');
  
  const instructions = [
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
  ];
  
  instructions.forEach(instruction => {
    worksheet.addRow(instruction);
  });
  
  // Set column width
  worksheet.getColumn(1).width = 80;
  
  // Style the header
  worksheet.getRow(1).font = { bold: true, size: 14 };
};
