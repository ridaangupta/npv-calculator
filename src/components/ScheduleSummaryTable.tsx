
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomLeaseInstallment } from "@/types/CustomScheduleTypes";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ScheduleSummaryTableProps {
  installments: CustomLeaseInstallment[];
  totalNPV: number;
  targetNPV?: number;
}

export const ScheduleSummaryTable = ({ installments, totalNPV, targetNPV }: ScheduleSummaryTableProps) => {
  const { formatCurrency } = useCurrency();

  if (installments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Schedule Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No installments configured</p>
        </CardContent>
      </Card>
    );
  }

  const npvDifference = targetNPV ? Math.abs(totalNPV - targetNPV) : 0;
  const isNPVMatching = targetNPV ? npvDifference < (targetNPV * 0.0001) : true;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Schedule Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment Date</TableHead>
              <TableHead>NPV %</TableHead>
              <TableHead>Days from Start</TableHead>
              <TableHead>Future Payment</TableHead>
              <TableHead>Present Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {installments.map((installment) => (
              <TableRow key={installment.id}>
                <TableCell>
                  {format(installment.paymentDate, "PPP")}
                </TableCell>
                <TableCell>
                  {installment.percentage.toFixed(2)}%
                </TableCell>
                <TableCell>
                  {installment.daysFromStart}
                </TableCell>
                <TableCell>
                  {formatCurrency(installment.amount)}
                </TableCell>
                <TableCell>
                  {formatCurrency(installment.presentValue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="mt-4 space-y-2">
          <div className={`p-4 rounded-lg ${isNPVMatching ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Calculated Net Present Value:</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(totalNPV)}
              </span>
            </div>
            
            {targetNPV && (
              <div className="mt-2 text-sm">
                <div className="flex justify-between">
                  <span>Target NPV:</span>
                  <span>{formatCurrency(targetNPV)}</span>
                </div>
                {!isNPVMatching && (
                  <div className="flex justify-between text-yellow-700">
                    <span>Difference:</span>
                    <span>{formatCurrency(npvDifference)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
            <strong>Note:</strong> Future Payment amounts are calculated to achieve the specified present value contributions. 
            The sum of all present values equals your target NPV.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
