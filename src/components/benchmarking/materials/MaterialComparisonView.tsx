
import { Material } from "./types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";

interface MaterialComparisonViewProps {
  materialIds: string[];
  materials: Material[];
  onDownload: () => void;
}

const MaterialComparisonView = ({ materialIds, materials, onDownload }: MaterialComparisonViewProps) => {
  const selectedMaterials = materials.filter(m => materialIds.includes(m.id));
  
  if (selectedMaterials.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Select materials to compare</p>
      </div>
    );
  }

  // Prepare bar chart data
  const barChartData = [
    {
      name: 'Carbon Footprint',
      unit: 'kg CO2e',
      ...selectedMaterials.reduce((acc, material, index) => {
        acc[`material${index + 1}`] = material.metrics.carbonFootprint;
        return acc;
      }, {} as Record<string, number>)
    },
    {
      name: 'Water Usage',
      unit: 'L',
      ...selectedMaterials.reduce((acc, material, index) => {
        acc[`material${index + 1}`] = material.metrics.waterUsage;
        return acc;
      }, {} as Record<string, number>)
    },
    {
      name: 'Energy Usage',
      unit: 'MJ',
      ...selectedMaterials.reduce((acc, material, index) => {
        acc[`material${index + 1}`] = material.metrics.energyUsage;
        return acc;
      }, {} as Record<string, number>)
    },
    {
      name: 'Overall Score',
      unit: '',
      ...selectedMaterials.reduce((acc, material, index) => {
        acc[`material${index + 1}`] = material.sustainabilityScore;
        return acc;
      }, {} as Record<string, number>)
    }
  ];
  
  // Prepare radar chart data for each material
  const radarChartData = [
    { subject: 'Carbon', fullMark: 100 },
    { subject: 'Water', fullMark: 100 },
    { subject: 'Energy', fullMark: 100 },
    { subject: 'Toxicity', fullMark: 100 },
    { subject: 'Renewability', fullMark: 100 }
  ].map(item => {
    const result = { ...item };
    
    selectedMaterials.forEach((material, index) => {
      if (item.subject === 'Carbon') {
        result[`material${index + 1}`] = normalize(material.metrics.carbonFootprint, 10, 0.1, 0, 100);
      } else if (item.subject === 'Water') {
        result[`material${index + 1}`] = normalize(material.metrics.waterUsage, 2000, 20, 0, 100);
      } else if (item.subject === 'Energy') {
        result[`material${index + 1}`] = normalize(material.metrics.energyUsage, 100, 1, 0, 100);
      } else if (item.subject === 'Toxicity') {
        result[`material${index + 1}`] = normalize(material.metrics.toxicityScore, 10, 0, 0, 100);
      } else if (item.subject === 'Renewability') {
        result[`material${index + 1}`] = material.metrics.renewabilityScore;
      }
    });
    
    return result;
  });
  
  // Colors for charts
  const colors = ['#3b82f6', '#ef4444', '#10b981'];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Comparing {selectedMaterials.length} Materials</h3>
        <Button variant="outline" onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Export Comparison
        </Button>
      </div>

      {/* Materials being compared */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {selectedMaterials.map((material, index) => (
          <Card key={material.id} className={`border-${colors[index].slice(1)}/50`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{material.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{material.category}</p>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Sustainability Score:</span>
                  <span style={{ color: colors[index] }}>{material.sustainabilityScore}</span>
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Carbon Footprint:</span>
                    <span>{material.metrics.carbonFootprint} kg CO2e</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Water Usage:</span>
                    <span>{material.metrics.waterUsage} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Energy Usage:</span>
                    <span>{material.metrics.energyUsage} MJ</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bar chart for direct comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Direct Comparison</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => {
                    const dataPoint = barChartData.find(d => name in d);
                    return [`${value} ${dataPoint?.unit || ''}`, selectedMaterials[parseInt(String(name).replace('material', '')) - 1]?.name];
                  }}
                />
                <Legend formatter={(value) => {
                  const index = parseInt(String(value).replace('material', '')) - 1;
                  return selectedMaterials[index]?.name || value;
                }} />
                {selectedMaterials.map((_, index) => (
                  <Bar 
                    key={index} 
                    dataKey={`material${index + 1}`} 
                    fill={colors[index]} 
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar chart for profile comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sustainability Profile Comparison</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={radarChartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                {selectedMaterials.map((material, index) => (
                  <Radar
                    key={index}
                    name={material.name}
                    dataKey={`material${index + 1}`}
                    stroke={colors[index]}
                    fill={colors[index]}
                    fillOpacity={0.2}
                  />
                ))}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sustainability Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            {generateRecommendations(selectedMaterials).map((rec, index) => (
              <p key={index} className="flex items-start">
                <span className="text-primary mr-2">•</span>
                {rec}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to normalize values for radar chart
function normalize(value: number, max: number, min: number, newMin: number, newMax: number): number {
  // Invert the scale since lower values are better for footprints
  const invertedValue = max - value + min;
  return newMin + (invertedValue - min) * (newMax - newMin) / (max - min);
}

// Generate recommendations based on materials being compared
function generateRecommendations(materials: Material[]): string[] {
  if (materials.length < 2) return [];
  
  const recommendations: string[] = [];
  
  // Find most sustainable option
  const mostSustainable = materials.reduce((prev, current) => 
    prev.sustainabilityScore > current.sustainabilityScore ? prev : current
  );
  
  recommendations.push(`${mostSustainable.name} has the highest overall sustainability score and should be prioritized where possible.`);
  
  // Carbon footprint comparison
  const lowestCarbon = materials.reduce((prev, current) => 
    prev.metrics.carbonFootprint < current.metrics.carbonFootprint ? prev : current
  );
  
  if (lowestCarbon !== mostSustainable) {
    recommendations.push(`If carbon footprint is your primary concern, consider ${lowestCarbon.name} which has the lowest emissions at ${lowestCarbon.metrics.carbonFootprint} kg CO2e.`);
  }
  
  // Water usage comparison
  const lowestWater = materials.reduce((prev, current) => 
    prev.metrics.waterUsage < current.metrics.waterUsage ? prev : current
  );
  
  if (lowestWater !== mostSustainable && lowestWater !== lowestCarbon) {
    recommendations.push(`For water conservation, ${lowestWater.name} performs best with only ${lowestWater.metrics.waterUsage} L water usage.`);
  }
  
  // Recyclability recommendation
  const recyclableMaterials = materials.filter(m => m.properties.recyclable);
  if (recyclableMaterials.length > 0 && recyclableMaterials.length < materials.length) {
    recommendations.push(`Prioritize ${recyclableMaterials.map(m => m.name).join(', ')} for better end-of-life recyclability.`);
  }
  
  return recommendations;
}

export default MaterialComparisonView;
