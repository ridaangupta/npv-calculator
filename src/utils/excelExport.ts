
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
  
  // Create the main consolidated worksheet and instructions
  createConsolidatedSheet(workbook, data);
  createInstructionsSheet(workbook, data);
  
  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const filename = `NPV_Analysis_${data.currency.code}_${timestamp}.xlsx`;
  
  // Write and download the file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, filename);
};

const createConsolidatedSheet = (workbook: ExcelJS.Workbook, data: ExportData) => {
  const worksheet = workbook.addWorksheet('NPV Analysis');
  
  // ==================== SECTION A: INPUT PARAMETERS (Rows 1-15) ====================
  worksheet.addRow(['NPV Calculator - Complete Analysis']);
  worksheet.addRow(['']);
  worksheet.addRow(['=== INPUT PARAMETERS ===']);
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
  worksheet.addRow(['']);
  
  // ==================== SECTION B: CASH FLOW CALCULATIONS (Rows 17+) ====================
  const calculationsStartRow = 17;
  worksheet.addRow(['=== CASH FLOW CALCULATIONS ===']);
  worksheet.addRow(['Year', 'Cash Flow (per m²)', 'Cash Flow (per hectare)', 'Present Value', 'Cumulative PV']);
  
  // Add calculation rows with Excel formulas using direct cell references
  for (let year = 1; year <= data.timePeriod; year++) {
    const row = worksheet.addRow([]);
    const currentRow = calculationsStartRow + 1 + year;
    
    // Year
    row.getCell(1).value = year;
    
    // Cash flow per m² with formula using direct cell references
    if (year === 1) {
      row.getCell(2).value = { formula: '$B$7' }; // Reference to Initial Lease Rent
    } else {
      const prevRow = currentRow - 1;
      // Check increase type using cell reference
      row.getCell(2).value = { 
        formula: `IF($B$9="Percentage",B${prevRow}*(1+$B$8/$B$10/100),B${prevRow}+$B$8/$B$10)` 
      };
    }
    
    // Cash flow per hectare (multiply by 10,000)
    row.getCell(3).value = { formula: `B${currentRow}*10000` };
    
    // Present Value using direct cell reference to discount rate
    row.getCell(4).value = { formula: `C${currentRow}/POWER(1+$B$6/100,A${currentRow})` };
    
    // Cumulative Present Value
    if (year === 1) {
      row.getCell(5).value = { formula: `D${currentRow}` };
    } else {
      const prevRow = currentRow - 1;
      row.getCell(5).value = { formula: `E${prevRow}+D${currentRow}` };
    }
  }
  
  // Add spacing and totals
  const totalsRow = calculationsStartRow + 2 + data.timePeriod;
  worksheet.addRow(['']);
  const totalRowData = worksheet.addRow(['TOTALS:', '', '', { formula: `SUM(D${calculationsStartRow + 2}:D${calculationsStartRow + 1 + data.timePeriod})` }, '']);
  totalRowData.font = { bold: true };
  
  // ==================== SECTION C: RESULTS SUMMARY (Starting after calculations) ====================
  const resultsStartRow = totalsRow + 3;
  worksheet.addRow(['']);
  worksheet.addRow(['=== RESULTS SUMMARY ===']);
  worksheet.addRow(['Metric', 'Value', 'Unit', 'Status']);
  
  const npvRow = resultsStartRow + 3;
  const totalNpvRow = resultsStartRow + 4;
  
  worksheet.addRow(['NPV per Hectare', { formula: `D${totalsRow}` }, data.currency.symbol, { formula: `IF(B${npvRow}>0,"Profitable","Unprofitable")` }]);
  worksheet.addRow(['Total Project NPV', { formula: `B${npvRow}*$B$12` }, data.currency.symbol, { formula: `IF(B${totalNpvRow}>0,"Profitable","Unprofitable")` }]);
  worksheet.addRow(['']);
  worksheet.addRow(['Project Details', '', '', '']);
  worksheet.addRow(['Total Hectares', { formula: '$B$12' }, 'hectares', '']);
  worksheet.addRow(['Analysis Period', { formula: '$B$11' }, 'years', '']);
  worksheet.addRow(['Discount Rate', { formula: '$B$6' }, '%', '']);
  worksheet.addRow(['']);
  worksheet.addRow(['Cash Flow Summary', '', '', '']);
  worksheet.addRow(['Total Future Cash Flows', { formula: `SUM(C${calculationsStartRow + 2}:C${calculationsStartRow + 1 + data.timePeriod})` }, `${data.currency.symbol}/hectare`, '']);
  worksheet.addRow(['Total Present Value', { formula: `D${totalsRow}` }, `${data.currency.symbol}/hectare`, '']);
  worksheet.addRow(['Average Annual Cash Flow', { formula: `AVERAGE(C${calculationsStartRow + 2}:C${calculationsStartRow + 1 + data.timePeriod})` }, `${data.currency.symbol}/hectare`, '']);
  worksheet.addRow(['Final Year Cash Flow', { formula: `C${calculationsStartRow + 1 + data.timePeriod}` }, `${data.currency.symbol}/hectare`, '']);
  
  // ==================== SECTION D: CHART DATA (Starting after results) ====================
  const chartStartRow = resultsStartRow + 16;
  worksheet.addRow(['']);
  worksheet.addRow(['=== CHART DATA ===']);
  worksheet.addRow(['Year', 'Future Value', 'Present Value', 'Cumulative PV']);
  
  // Add chart data with direct references to calculation section
  for (let year = 1; year <= data.timePeriod; year++) {
    const calcRow = calculationsStartRow + 1 + year;
    const chartRow = worksheet.addRow([
      { formula: `A${calcRow}` },
      { formula: `C${calcRow}` },
      { formula: `D${calcRow}` },
      { formula: `E${calcRow}` }
    ]);
  }
  
  // ==================== FORMATTING ====================
  // Set column widths
  worksheet.getColumn(1).width = 25;
  worksheet.getColumn(2).width = 20;
  worksheet.getColumn(3).width = 20;
  worksheet.getColumn(4).width = 20;
  worksheet.getColumn(5).width = 18;
  
  // Style headers
  worksheet.getRow(1).font = { bold: true, size: 16 };
  worksheet.getRow(3).font = { bold: true, size: 12, color: { argb: 'FF0066CC' } };
  worksheet.getRow(4).font = { bold: true };
  worksheet.getRow(calculationsStartRow).font = { bold: true, size: 12, color: { argb: 'FF0066CC' } };
  worksheet.getRow(calculationsStartRow + 1).font = { bold: true };
  worksheet.getRow(resultsStartRow + 1).font = { bold: true, size: 12, color: { argb: 'FF0066CC' } };
  worksheet.getRow(resultsStartRow + 2).font = { bold: true };
  worksheet.getRow(chartStartRow).font = { bold: true, size: 12, color: { argb: 'FF0066CC' } };
  worksheet.getRow(chartStartRow + 1).font = { bold: true };
  
  // Add borders and shading to input parameters section
  for (let row = 4; row <= 12; row++) {
    const currentRow = worksheet.getRow(row);
    currentRow.eachCell((cell, colNumber) => {
      if (colNumber <= 4) {
        cell.border = {
          top: {style:'thin'},
          left: {style:'thin'},
          bottom: {style:'thin'},
          right: {style:'thin'}
        };
        if (colNumber === 2) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF0F8FF' }
          };
        }
      }
    });
  }
  
  // Add borders to calculation section
  for (let year = 1; year <= data.timePeriod; year++) {
    const currentRow = worksheet.getRow(calculationsStartRow + 1 + year);
    currentRow.eachCell((cell, colNumber) => {
      if (colNumber <= 5) {
        cell.border = {
          top: {style:'thin'},
          left: {style:'thin'},
          bottom: {style:'thin'},
          right: {style:'thin'}
        };
        cell.numFmt = colNumber === 1 ? '0' : '#,##0.00';
      }
    });
  }
};

const createInstructionsSheet = (workbook: ExcelJS.Workbook, data: ExportData) => {
  const worksheet = workbook.addWorksheet('Instructions');
  
  const instructions = [
    ['NPV Calculator - User Instructions'],
    [''],
    ['How to Use This Excel File:'],
    [''],
    ['1. MODIFYING INPUTS:'],
    ['   • Go to the "NPV Analysis" sheet'],
    ['   • Change any values in column B (rows 6-12) in the INPUT PARAMETERS section'],
    ['   • All calculations will update automatically throughout the sheet'],
    [''],
    ['2. VIEWING RESULTS:'],
    ['   • Scroll down to the RESULTS SUMMARY section for key metrics'],
    ['   • Review the CASH FLOW CALCULATIONS section for detailed annual flows'],
    ['   • All sections are on the same sheet for easy reference'],
    [''],
    ['3. CREATING CHARTS:'],
    ['   • Use data from the CHART DATA section at the bottom'],
    ['   • Recommended chart types:'],
    ['     - Line chart for cash flow trends over time'],
    ['     - Column chart for present value vs future value comparison'],
    ['     - Area chart for cumulative present value growth'],
    [''],
    ['4. SCENARIO ANALYSIS:'],
    ['   • Create multiple copies of this file'],
    ['   • Modify input parameters for different scenarios'],
    ['   • Compare NPV results across scenarios'],
    [''],
    ['5. KEY FORMULAS USED:'],
    ['   • Present Value = Future Value / (1 + Discount Rate)^Year'],
    ['   • NPV = Sum of all Present Values'],
    ['   • Cash Flow per Hectare = Cash Flow per m² × 10,000'],
    ['   • Annual Increase = Base Increase ÷ Increase Frequency'],
    [''],
    ['6. IMPORTANT NOTES:'],
    ['   • Only modify values in the INPUT PARAMETERS section (column B, rows 6-12)'],
    ['   • Do not change formulas in other sections'],
    ['   • All calculations are on one sheet to ensure reliability'],
    ['   • Currency conversions are not automatic - use web app for currency changes'],
    [''],
    ['7. TROUBLESHOOTING:'],
    ['   • If calculations seem wrong, check the Increase Type value (row 9)'],
    ['   • Ensure all input values are positive numbers'],
    ['   • Time Period and Increase Frequency must be whole numbers'],
    [''],
    ['Generated by NPV Calculator Web Application'],
    [`Report Date: ${new Date().toLocaleDateString()}`],
    [`Currency: ${data.currency.name} (${data.currency.code})`],
    [`Analysis covers ${data.timePeriod} years with ${data.totalHectares} hectares`],
  ];
  
  instructions.forEach(instruction => {
    worksheet.addRow(instruction);
  });
  
  // Set column width
  worksheet.getColumn(1).width = 80;
  
  // Style the header
  worksheet.getRow(1).font = { bold: true, size: 14 };
  
  // Style section headers
  [3, 5, 10, 18, 25, 32, 38].forEach(rowNumber => {
    const row = worksheet.getRow(rowNumber);
    if (row.getCell(1).value) {
      row.font = { bold: true, color: { argb: 'FF0066CC' } };
    }
  });
};
