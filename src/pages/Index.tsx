
import NPVCalculator from "@/components/NPVCalculator";
import CurrencySelector from "@/components/CurrencySelector";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <CurrencySelector />
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            NPV Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate the Net Present Value of your investments and projects. 
            Make informed financial decisions with precise NPV analysis.
          </p>
        </div>
        
        <NPVCalculator />
      </div>
    </div>
  );
};

export default Index;
