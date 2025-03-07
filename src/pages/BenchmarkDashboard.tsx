import DashboardLayout from "@/components/layout/DashboardLayout";

const BenchmarkDashboard = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Industry Benchmarking</h1>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">ESG Performance Benchmarking</h2>
            <p className="text-muted-foreground mb-6">
              Compare your ESG performance against industry peers and standards
            </p>
            
            <div className="border border-dashed border-gray-300 rounded-md p-8 text-center">
              <p className="text-muted-foreground">Benchmarking tools are being loaded...</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BenchmarkDashboard;
