
import ESGBenchmarkCard from "@/components/external/ESGBenchmarkCard";

// Mock data for benchmark cards
const benchmarkData = [
  {
    title: "Technology Sector ESG Performance",
    metrics: {
      environmental: 72,
      social: 68,
      governance: 81
    },
    companies: 145,
    updated: "2025-01-15"
  },
  {
    title: "Manufacturing Industry Carbon Metrics",
    metrics: {
      environmental: 65,
      social: 70,
      governance: 75
    },
    companies: 212,
    updated: "2025-02-03"
  },
  {
    title: "Financial Services Governance Standards",
    metrics: {
      environmental: 61,
      social: 73,
      governance: 85
    },
    companies: 178,
    updated: "2025-01-28"
  },
  {
    title: "Healthcare Social Responsibility Metrics",
    metrics: {
      environmental: 68,
      social: 81,
      governance: 77
    },
    companies: 98,
    updated: "2025-02-10"
  },
  {
    title: "Energy Sector Transition Benchmark",
    metrics: {
      environmental: 59,
      social: 65,
      governance: 72
    },
    companies: 87,
    updated: "2025-01-20"
  },
  {
    title: "Retail Industry Supply Chain Ethics",
    metrics: {
      environmental: 64,
      social: 76,
      governance: 70
    },
    companies: 156,
    updated: "2025-02-05"
  }
];

const BenchmarksTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {benchmarkData.map((_, index) => (
        <ESGBenchmarkCard key={index} />
      ))}
    </div>
  );
};

export default BenchmarksTab;
