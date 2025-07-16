import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CustomScheduleDatePicker } from "./CustomScheduleDatePicker";
import { InstallmentRow } from "./InstallmentRow";
import { ScheduleSummaryTable } from "./ScheduleSummaryTable";
import { useInstallmentManager } from "@/hooks/useInstallmentManager";
import { useCustomScheduleCalculations } from "@/hooks/useCustomScheduleCalculations";
import { CustomScheduleInputs } from "@/types/CustomScheduleTypes";

export const CustomPaymentScheduleCalculator = () => {
  const [inputs, setInputs] = useState<CustomScheduleInputs>({
    leaseStartDate: undefined,
    numberOfInstallments: 3,
    discountRate: 10,
    dealValue: 1000000
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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Custom Lease Payment Schedule Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Create a custom payment schedule and calculate the Net Present Value
        </p>
      </div>

      {/* Basic Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Configuration</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="leaseStartDate">Lease Start Date</Label>
            <CustomScheduleDatePicker
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
              type="number"
              value={inputs.numberOfInstallments}
              onChange={(e) => handleInputChange('numberOfInstallments', parseInt(e.target.value) || 1)}
              min="1"
              max="20"
              className="mt-2"
            />
          </div>
          
          <div>
            <Label htmlFor="discountRate">Discount Rate (%)</Label>
            <Input
              id="discountRate"
              type="number"
              value={inputs.discountRate}
              onChange={(e) => handleInputChange('discountRate', parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="0.01"
              className="mt-2"
            />
          </div>
          
          <div>
            <Label htmlFor="dealValue">Deal Value</Label>
            <Input
              id="dealValue"
              type="number"
              value={inputs.dealValue}
              onChange={(e) => handleInputChange('dealValue', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
              className="mt-2"
            />
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
            <CardTitle>Payment Installments</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={distributePercentagesEvenly}
                disabled={installments.length === 0}
              >
                Distribute Evenly
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={addInstallment}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Installment
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 items-center p-4 bg-muted rounded-lg text-sm font-medium">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Payment Date</div>
              <div className="col-span-3">Percentage</div>
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
              <div className="text-center py-8 text-muted-foreground">
                No installments configured. Click "Add Installment" to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Table */}
      <ScheduleSummaryTable 
        installments={calculatedInstallments}
        totalNPV={totalNPV}
      />
    </div>
  );
};