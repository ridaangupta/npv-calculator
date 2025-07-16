
import UpfrontLeaseCalculator from "@/components/UpfrontLeaseCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Executive Lease Investment Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Strategic investment analysis for lease valuations. Calculate upfront lease amounts with 
            customizable payment schedules and make informed executive decisions with precision.
          </p>
        </div>
        
        <UpfrontLeaseCalculator />
      </div>
    </div>
  );
};

export default Index;
