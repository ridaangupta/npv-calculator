
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
  createMainAnalysisSheet(workbook, data);
  createCalculationDetailsSheet(workbook, data);
  createInstructionsSheet(workbook, data);
  
  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const filename = `NPV_Analysis_${data.currency.code}_${timestamp}.xlsx`;
  
  // Write and download the file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, filename);
};

const createMainAnalysisSheet = (workbook: ExcelJS.Workbook, data: ExportData) => {
  const worksheet = workbook.addWorksheet('NPV Analysis');
  
  // ==================== SECTION A: INPUT PARAMETERS ====================
  worksheet.addRow(['NPV Calculator - Complete Analysis']);
  worksheet.addRow(['']);
  worksheet.addRow(['=== INPUT PARAMETERS ===']);
  worksheet.addRow(['Parameter', 'Value', 'Unit', 'Description']);
  worksheet.addRow(['Currency', data.currency.code, '', data.currency.name]);
  worksheet.addRow(['Discount Rate', data.discountRate, '%', 'Annual discount rate for NPV calculation']);
  worksheet.addRow(['Initial Lease Rent', data.baseCashFlow, `${data.currency.symbol}/m²/year`, 'Base cash flow per square meter per year']);
  worksheet.addRow(['Increase Value', data.increaseValue, data.increaseType === 'percent' ? '%' : `${data.currency.symbol}/m²`, `Applied every ${data.increaseFrequency} year(s)`]);
  worksheet.addRow(['Increase Type', data.increaseType === 'percent' ? 'Percentage' : 'Fixed Amount', '', 'Type of cash flow increase']);
  worksheet.addRow(['Increase Frequency', data.increaseFrequency, 'years', 'How often increases are applied']);
  worksheet.addRow(['Time Period', data.timePeriod, 'years', 'Total analysis period']);
  worksheet.addRow(['Total Hectares', data.totalHectares, 'hectares', 'Total project area']);
  worksheet.addRow(['']);
  worksheet.addRow(['Generated on:', new Date().toLocaleString()]);
  worksheet.addRow(['']);

  // ==================== SECTION B: WEB APP RESULTS (Reference) ====================
  const webAppStartRow = 16;
  worksheet.addRow(['=== WEB APPLICATION RESULTS (Reference) ===']);
  worksheet.addRow(['Year', 'Cash Flow (per m²)', 'Cash Flow (per hectare)', 'Present Value', 'Cumulative PV']);
  
  // Add the actual calculated values from the web app as reference
  data.cashFlows.forEach((flow, index) => {
    const presentValue = flow.amount / Math.pow(1 + data.discountRate / 100, flow.year);
    const cumulativePV = data.cashFlows.slice(0, index + 1).reduce((sum, f) => {
      return sum + f.amount / Math.pow(1 + data.discountRate / 100, f.year);
    }, 0);
    
    worksheet.addRow([
      flow.year,
      flow.amount / 10000, // Convert back to per m²
      flow.amount,
      presentValue,
      cumulativePV
    ]);
  });

  const webAppTotalRow = webAppStartRow + 2 + data.cashFlows.length;
  worksheet.addRow(['TOTALS:', '', '', data.npvPerHectare, '']);

  // ==================== SECTION C: EDITABLE CALCULATIONS ====================
  const editableStartRow = webAppTotalRow + 3;
  worksheet.addRow(['']);
  worksheet.addRow(['=== EDITABLE CALCULATIONS (Modify parameters above) ===']);
  worksheet.addRow(['Year', 'Cash Flow (per m²)', 'Cash Flow (per hectare)', 'Present Value', 'Cumulative PV', 'Increase Applied?']);
  
  // Add calculation rows with corrected formulas
  for (let year = 1; year <= data.timePeriod; year++) {
    const row = worksheet.addRow([]);
    const currentRow = editableStartRow + 2 + year;
    
    // Year
    row.getCell(1).value = year;
    
    // Cash flow per m² with proper discrete increase logic
    if (year === 1) {
      row.getCell(2).value = { formula: '$B$7' }; // Initial cash flow
    } else {
      // Check if this year should have an increase applied
      // Increases are applied at the END of each increase period
      const shouldIncrease = `MOD(A${currentRow}-1,$B$10)=0`;
      const prevCashFlow = `B${currentRow-1}`;
      
      if (data.increaseType === 'percent') {
        row.getCell(2).value = { 
          formula: `IF(${shouldIncrease},${prevCashFlow}*(1+$B$8/100),${prevCashFlow})` 
        };
      } else {
        row.getCell(2).value = { 
          formula: `IF(${shouldIncrease},${prevCashFlow}+$B$8,${prevCashFlow})` 
        };
      }
    }
    
    // Cash flow per hectare (multiply by 10,000)
    row.getCell(3).value = { formula: `B${currentRow}*10000` };
    
    // Present Value
    row.getCell(4).value = { formula: `C${currentRow}/POWER(1+$B$6/100,A${currentRow})` };
    
    // Cumulative Present Value
    if (year === 1) {
      row.getCell(5).value = { formula: `D${currentRow}` };
    } else {
      row.getCell(5).value = { formula: `E${currentRow-1}+D${currentRow}` };
    }
    
    // Increase Applied indicator
    if (year === 1) {
      row.getCell(6).value = 'Initial Year';
    } else {
      row.getCell(6).value = { formula: `IF(MOD(A${currentRow}-1,$B$10)=0,"YES","NO")` };
    }
  }

  // Add totals for editable section
  const editableTotalRow = editableStartRow + 3 + data.timePeriod;
  const totalRowData = worksheet.addRow(['TOTALS:', '', '', 
    { formula: `SUM(D${editableStartRow + 3}:D${editableStartRow + 2 + data.timePeriod})` }, 
    '', ''
  ]);
  totalRowData.font = { bold: true };

  // ==================== SECTION D: RESULTS SUMMARY ====================
  const resultsStartRow = editableTotalRow + 3;
  worksheet.addRow(['']);
  worksheet.addRow(['=== RESULTS SUMMARY ===']);
  worksheet.addRow(['Metric', 'Web App Value', 'Excel Value', 'Match?', 'Unit']);
  
  worksheet.addRow([
    'NPV per Hectare', 
    data.npvPerHectare, 
    { formula: `D${editableTotalRow}` }, 
    { formula: `IF(ABS(B${resultsStartRow + 3}-C${resultsStartRow + 3})<1,"✓","✗")` },
    data.currency.symbol
  ]);
  
  worksheet.addRow([
    'Total Project NPV', 
    data.totalNPV, 
    { formula: `C${resultsStartRow + 3}*$B$12` }, 
    { formula: `IF(ABS(B${resultsStartRow + 4}-C${resultsStartRow + 4})<1,"✓","✗")` },
    data.currency.symbol
  ]);

  // Add validation summary
  worksheet.addRow(['']);
  worksheet.addRow(['Validation Summary', '', '', '', '']);
  worksheet.addRow(['All calculations match?', '', 
    { formula: `IF(AND(E${resultsStartRow + 3}="✓",E${resultsStartRow + 4}="✓"),"YES - Excel calculations are correct","NO - Check formulas")` }, 
    '', ''
  ]);

  // ==================== FORMATTING ====================
  // Set column widths
  worksheet.getColumn(1).width = 25;
  worksheet.getColumn(2).width = 20;
  worksheet.getColumn(3).width = 20;
  worksheet.getColumn(4).width = 20;
  worksheet.getColumn(5).width = 18;
  worksheet.getColumn(6).width = 18;
  
  // Style headers and sections
  worksheet.getRow(1).font = { bold: true, size: 16 };
  worksheet.getRow(3).font = { bold: true, size: 12, color: { argb: 'FF0066CC' } };
  worksheet.getRow(4).font = { bold: true };
  worksheet.getRow(webAppStartRow).font = { bold: true, size: 12, color: { argb: 'FF008000' } };
  worksheet.getRow(webAppStartRow + 1).font = { bold: true };
  worksheet.getRow(editableStartRow + 1).font = { bold: true, size: 12, color: { argb: 'FFFF6600' } };
  worksheet.getRow(editableStartRow + 2).font = { bold: true };
  worksheet.getRow(resultsStartRow + 1).font = { bold: true, size: 12, color: { argb: 'FF0066CC' } };
  worksheet.getRow(resultsStartRow + 2).font = { bold: true };

  // Add borders to input parameters
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
            fgColor: { argb: 'FFFFF0F0' }
          };
        }
      }
    });
  }

  // Format calculation sections
  const formatCalculationSection = (startRow: number, endRow: number, bgColor: string) => {
    for (let row = startRow; row <= endRow; row++) {
      const currentRow = worksheet.getRow(row);
      currentRow.eachCell((cell, colNumber) => {
        if (colNumber <= 6) {
          cell.border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
          };
          if (row === startRow + 1) { // Header row
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: bgColor }
            };
          }
          cell.numFmt = colNumber === 1 ? '0' : '#,##0.00';
        }
      });
    }
  };

  formatCalculationSection(webAppStartRow + 1, webAppTotalRow, 'FFE6F7E6'); // Light green for reference
  formatCalculationSection(editableStartRow + 2, editableTotalRow, 'FFFFF0E6'); // Light orange for editable
};

const createCalculationDetailsSheet = (workbook: ExcelJS.Workbook, data: ExportData) => {
  const worksheet = workbook.addWorksheet('Calculation Details');
  
  worksheet.addRow(['Cash Flow Calculation Logic - Step by Step']);
  worksheet.addRow(['']);
  worksheet.addRow(['This sheet shows exactly how cash flows are calculated:']);
  worksheet.addRow(['']);
  worksheet.addRow(['Parameters Used:']);
  worksheet.addRow([`Initial Cash Flow: ${data.baseCashFlow} ${data.currency.symbol}/m²/year`]);
  worksheet.addRow([`Increase Value: ${data.increaseValue} ${data.increaseType === 'percent' ? '%' : data.currency.symbol + '/m²'}`]);
  worksheet.addRow([`Increase Type: ${data.increaseType === 'percent' ? 'Percentage' : 'Fixed Amount'}`]);
  worksheet.addRow([`Increase Frequency: Every ${data.increaseFrequency} year(s)`]);
  worksheet.addRow([`Time Period: ${data.timePeriod} years`]);
  worksheet.addRow(['']);
  worksheet.addRow(['Step-by-Step Calculation:']);
  worksheet.addRow(['Year', 'Cash Flow/m²', 'Calculation Used', 'Increase Applied?', 'Notes']);
  
  let currentCashFlowPerM2 = data.baseCashFlow;
  
  for (let year = 1; year <= data.timePeriod; year++) {
    let calculation = '';
    let increaseApplied = 'No';
    let notes = '';
    
    if (year === 1) {
      calculation = `Initial: ${data.baseCashFlow}`;
      notes = 'Starting value';
    } else {
      // Check if increase should be applied
      if ((year - 1) % data.increaseFrequency === 0) {
        increaseApplied = 'Yes';
        if (data.increaseType === 'percent') {
          const prevValue = currentCashFlowPerM2;
          currentCashFlowPerM2 = currentCashFlowPerM2 * (1 + data.increaseValue / 100);
          calculation = `${prevValue} × (1 + ${data.increaseValue}%) = ${currentCashFlowPerM2}`;
        } else {
          const prevValue = currentCashFlowPerM2;
          currentCashFlowPerM2 = currentCashFlowPerM2 + data.increaseValue;
          calculation = `${prevValue} + ${data.increaseValue} = ${currentCashFlowPerM2}`;
        }
        notes = `Increase applied at end of year ${year - 1}`;
      } else {
        calculation = `Same as previous: ${currentCashFlowPerM2}`;
        notes = `No increase (next increase in year ${year + (data.increaseFrequency - ((year - 1) % data.increaseFrequency))})`;
      }
    }
    
    worksheet.addRow([year, currentCashFlowPerM2.toFixed(4), calculation, increaseApplied, notes]);
  }
  
  worksheet.addRow(['']);
  worksheet.addRow(['Key Points:']);
  worksheet.addRow(['• Increases are applied at discrete intervals, not gradually']);
  worksheet.addRow(['• The increase is applied at the END of each increase period']);
  worksheet.addRow(['• Cash flow per hectare = Cash flow per m² × 10,000']);
  worksheet.addRow(['• Present Value = Future Value ÷ (1 + discount rate)^year']);
  
  // Set column widths
  worksheet.getColumn(1).width = 10;
  worksheet.getColumn(2).width = 15;
  worksheet.getColumn(3).width = 30;
  worksheet.getColumn(4).width = 15;
  worksheet.getColumn(5).width = 40;
  
  // Style headers
  worksheet.getRow(1).font = { bold: true, size: 14 };
  worksheet.getRow(13).font = { bold: true };
};

const createInstructionsSheet = (workbook: ExcelJS.Workbook, data: ExportData) => {
  const worksheet = workbook.addWorksheet('Instructions');
  
  const instructions = [
    ['NPV Calculator - Excel Export Instructions'],
    [''],
    ['IMPORTANT: How to Use This Excel File'],
    [''],
    ['1. UNDERSTANDING THE SHEETS:'],
    ['   • "NPV Analysis" - Main sheet with calculations and results'],
    ['   • "Calculation Details" - Step-by-step explanation of cash flow logic'],
    ['   • "Instructions" - This sheet'],
    [''],
    ['2. MODIFYING INPUTS (NPV Analysis Sheet):'],
    ['   • Only change values in column B, rows 6-12 (highlighted in red)'],
    ['   • Discount Rate (B6): Enter as percentage (e.g., 10 for 10%)'],
    ['   • Initial Lease Rent (B7): Cash flow per m² per year'],
    ['   • Increase Value (B8): Amount or percentage increase'],
    ['   • Increase Type (B9): Type "Percentage" or "Fixed Amount" exactly'],
    ['   • Increase Frequency (B10): How often increases apply (years)'],
    ['   • Time Period (B11): Total analysis period (years)'],
    ['   • Total Hectares (B12): Project size'],
    [''],
    ['3. VALIDATION:'],
    ['   • Green section shows original web app results (reference only)'],
    ['   • Orange section shows Excel calculations (updates when you change inputs)'],
    ['   • Results Summary compares both and shows if they match'],
    ['   • Look for ✓ or ✗ symbols to verify accuracy'],
    [''],
    ['4. KEY FORMULAS EXPLAINED:'],
    ['   • Cash Flow Increases: Applied discretely every X years, not gradually'],
    ['   • MOD function determines when increases are applied'],
    ['   • Present Value = Future Value ÷ (1 + discount rate)^year'],
    ['   • NPV = Sum of all Present Values'],
    [''],
    ['5. TROUBLESHOOTING:'],
    ['   • If calculations show ✗, check input format in B9 (Increase Type)'],
    ['   • Ensure all numeric inputs are positive numbers'],
    ['   • Increase Frequency and Time Period must be whole numbers'],
    ['   • If formulas break, refer to "Calculation Details" sheet'],
    [''],
    ['6. CREATING SCENARIOS:'],
    ['   • Save multiple copies with different parameters'],
    ['   • Use Excel\'s Scenario Manager for advanced analysis'],
    ['   • Compare NPV results across different assumptions'],
    [''],
    ['7. UNDERSTANDING DISCRETE INCREASES:'],
    ['   • Increases happen at the END of each period, not at the beginning'],
    ['   • Year 1 always uses the initial cash flow'],
    ['   • If frequency is 3 years, increases apply in years 4, 7, 10, etc.'],
    ['   • See "Calculation Details" sheet for step-by-step examples'],
    [''],
    ['Generated by NPV Calculator Web Application'],
    [`Report Date: ${new Date().toLocaleDateString()}`],
    [`Currency: ${data.currency.name} (${data.currency.code})`],
    [`Analysis Period: ${data.timePeriod} years, ${data.totalHectares} hectares`],
    [''],
    ['For support or questions about this calculator,'],
    ['refer back to the original web application.'],
  ];
  
  instructions.forEach(instruction => {
    worksheet.addRow(instruction);
  });
  
  // Set column width
  worksheet.getColumn(1).width = 80;
  
  // Style the header
  worksheet.getRow(1).font = { bold: true, size: 14 };
  
  // Style section headers
  [3, 5, 10, 18, 25, 32, 38, 45].forEach(rowNumber => {
    const row = worksheet.getRow(rowNumber);
    if (row.getCell(1).value) {
      row.font = { bold: true, color: { argb: 'FF0066CC' } };
    }
  });
};
