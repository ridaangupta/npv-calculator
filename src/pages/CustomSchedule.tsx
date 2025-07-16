import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowLeft } from "lucide-react";
import { CustomPaymentScheduleCalculator } from "@/components/CustomPaymentScheduleCalculator";

const CustomSchedule = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Standard Calculator
            </Link>
          </Button>
        </div>
        
        <CustomPaymentScheduleCalculator />
      </div>
    </div>
  );
};

export default CustomSchedule;