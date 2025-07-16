import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomLeaseInstallment } from "@/types/CustomScheduleTypes";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ScheduleSummaryTableProps {
  installments: CustomLeaseInstallment[];
  totalNPV: number;
}

export const ScheduleSummaryTable = ({ installments, totalNPV }: ScheduleSummaryTableProps) => {
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
              <TableHead>Percentage</TableHead>
              <TableHead>Days from Start</TableHead>
              <TableHead>Amount</TableHead>
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
        
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Net Present Value (NPV):</span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(totalNPV)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};