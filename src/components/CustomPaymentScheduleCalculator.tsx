
import { useState } from "react";
import { Plus, BarChart3, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NativeDatePicker } from "./NativeDatePicker";
import { InstallmentRow } from "./InstallmentRow";
import { ScheduleSummaryTable } from "./ScheduleSummaryTable";
import { useInstallmentManager } from "@/hooks/useInstallmentManager";
import { useCustomScheduleCalculations } from "@/hooks/useCustomScheduleCalculations";
import { CustomScheduleInputs } from "@/types/CustomScheduleTypes";

interface CustomPaymentScheduleCalculatorProps {
  dealValue?: number;
  discountRate?: number;
  leaseStartDate?: Date;
  showComparison?: boolean;
  standardLeaseValue?: number;
  standardTotalHectares?: number;
}

export const CustomPaymentScheduleCalculator = ({
  dealValue: initialDealValue,
  discountRate: initialDiscountRate,
  leaseStartDate: initialLeaseStartDate,
  showComparison = false,
  standardLeaseValue = 0,
  standardTotalHectares = 0
}: CustomPaymentScheduleCalculatorProps = {}) => {
  const [inputs, setInputs] = useState<CustomScheduleInputs>({
    leaseStartDate: initialLeaseStartDate || undefined,
    numberOfInstallments: 3,
    discountRate: initialDiscountRate || 10,
    dealValue: initialDealValue || 1000000
  });

  const {
    installments,
    addInstallment,
    removeInstallment,
    updateInstallment,
    setNumberOfInstallments,
    distributePercentagesEvenly
  } = useInstallmentManager(inputs.numberOfInstallments, inputs.leaseStartDate);

  const { calculatedInstallments, totalNPV, validation } = useCustomScheduleCalculations(
    inputs.dealValue,
    inputs.leaseStartDate,
    inputs.discountRate,
    installments
  );

  const handleInputChange = (field: keyof CustomScheduleInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    
    if (field === 'numberOfInstallments') {
      setNumberOfInstallments(value);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {!showComparison && (
        <div className="text-center">
          <h1 className="text-3xl font-bold">Custom Lease Payment Schedule Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Create a custom payment schedule to achieve your target Net Present Value
          </p>
        </div>
      )}
      
      {showComparison && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Custom Payment Schedule</h2>
          <p className="text-gray-600">
            Create a custom payment schedule for your calculated lease value
          </p>
        </div>
      )}

      {/* Basic Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Configuration</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div>
            <Label htmlFor="leaseStartDate">Lease Start Date</Label>
            <NativeDatePicker
              date={inputs.leaseStartDate}
              onDateChange={(date) => handleInputChange('leaseStartDate', date)}
              placeholder="Select start date"
              className="mt-2"
            />
          </div>
          
          <div>
            <Label htmlFor="numberOfInstallments">Number of Installments</Label>
            <Input
              id="numberOfInstallments"
              type="text"
              value={inputs.numberOfInstallments === 0 ? '' : inputs.numberOfInstallments.toString()}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  handleInputChange('numberOfInstallments', 0);
                } else {
                  const numValue = parseInt(value);
                  if (!isNaN(numValue) && numValue >= 0) {
                    handleInputChange('numberOfInstallments', Math.min(20, numValue));
                  }
                }
              }}
              className="mt-2"
              placeholder="Enter number of installments"
            />
          </div>
          
          <div>
            <Label htmlFor="discountRate">Discount Rate (%)</Label>
            <Input
              id="discountRate"
              type="text"
              value={inputs.discountRate === 0 ? '' : inputs.discountRate.toString()}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  handleInputChange('discountRate', 0);
                } else {
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                    handleInputChange('discountRate', numValue);
                  }
                }
              }}
              className="mt-2"
              placeholder="Enter discount rate"
            />
          </div>
          
          <div>
            <Label htmlFor="dealValue">Target NPV (Deal Value)</Label>
            <Input
              id="dealValue"
              type="text"
              value={inputs.dealValue === 0 ? '' : inputs.dealValue.toString()}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  handleInputChange('dealValue', 0);
                } else {
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue) && numValue >= 0) {
                    handleInputChange('dealValue', numValue);
                  }
                }
              }}
              className="mt-2"
              placeholder="Enter target present value"
            />
            <p className="text-xs text-muted-foreground mt-1">
              The present value target for all payments
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Validation Errors */}
      {!validation.isValid && (
        <Alert variant="destructive">
          <AlertDescription>
            <ul className="list-disc pl-4">
              {validation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Installment Configuration */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg md:text-xl">Payment Installments</CardTitle>
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm"
                onClick={distributePercentagesEvenly}
                disabled={installments.length === 0}
                className="p-2 md:px-3"
                title="Distribute Evenly"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="sr-only">Distribute Evenly</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={addInstallment}
                className="p-2 md:px-3"
                title="Add Installment"
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add Installment</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Header - Hidden on mobile, shown on desktop */}
            <div className="hidden md:grid grid-cols-12 gap-4 items-center p-3 bg-muted rounded-lg text-sm font-medium">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Payment Date</div>
              <div className="col-span-3">NPV Percentage</div>
              <div className="col-span-2">Display %</div>
              <div className="col-span-1">Actions</div>
            </div>
            
            {/* Installment Rows */}
            {installments.map((installment, index) => (
              <InstallmentRow
                key={installment.id}
                installment={installment}
                index={index}
                leaseStartDate={inputs.leaseStartDate}
                onUpdate={updateInstallment}
                onRemove={removeInstallment}
                canRemove={installments.length > 1}
              />
            ))}
            
            {installments.length === 0 && (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No installments configured. Tap + to add.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Table */}
      <ScheduleSummaryTable 
        installments={calculatedInstallments}
        totalNPV={totalNPV}
        targetNPV={inputs.dealValue}
      />

      {/* Comparison with Standard Calculation */}
      {showComparison && standardLeaseValue > 0 && (
        <Card className="shadow-lg border-0 bg-blue-50/80 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <div className="w-5 h-5 bg-blue-600 rounded" />
              Standard vs Custom Schedule Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">
                  ${(standardLeaseValue * standardTotalHectares).toLocaleString()}
                </div>
                <div className="text-sm text-blue-600">Standard Calculation</div>
                <div className="text-xs text-blue-500 mt-1">Annual payment structure</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">
                  ${inputs.dealValue.toLocaleString()}
                </div>
                <div className="text-sm text-blue-600">Custom Schedule Target NPV</div>
                <div className="text-xs text-blue-500 mt-1">Present value of custom payments</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded">
              <div className="text-sm text-blue-800">
                <strong>Calculated NPV:</strong> ${totalNPV.toLocaleString()} 
                {Math.abs(totalNPV - inputs.dealValue) > 0.01 && (
                  <span className="text-yellow-700"> (Difference: ${Math.abs(totalNPV - inputs.dealValue).toLocaleString()})</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
