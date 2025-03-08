
interface BenchmarkFooterProps {
  sourceText: string;
  metricUnit: string;
  performanceText: string;
  selectedMetricName: string;
}

const BenchmarkFooter = ({ 
  sourceText, 
  metricUnit, 
  performanceText,
  selectedMetricName
}: BenchmarkFooterProps) => {
  return (
    <div className="mt-4 text-sm">
      <div className="flex justify-between text-muted-foreground">
        <span>{sourceText}</span>
        <span>
          Unit: {metricUnit}
        </span>
      </div>
      
      <p className="mt-2">
        Your company is <span className="font-semibold text-green-600">12% better</span> than 
        the industry average for {selectedMetricName}.
      </p>
    </div>
  );
};

export default BenchmarkFooter;
