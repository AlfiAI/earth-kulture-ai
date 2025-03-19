
import { Material } from "./types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Info, Leaf, Droplet, Zap, Recycle } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface MaterialDetailViewProps {
  material: Material;
  onBack: () => void;
  onDownload: () => void;
}

const MaterialDetailView = ({ material, onBack, onDownload }: MaterialDetailViewProps) => {
  const {
    name,
    description,
    category,
    sustainabilityScore,
    properties,
    metrics,
    alternatives,
    certifications
  } = material;

  // Prepare radar chart data
  const radarData = [
    {
      subject: 'Carbon',
      score: normalize(metrics.carbonFootprint, 10, 0.1, 0, 100),
      fullMark: 100,
    },
    {
      subject: 'Water',
      score: normalize(metrics.waterUsage, 2000, 20, 0, 100),
      fullMark: 100,
    },
    {
      subject: 'Energy',
      score: normalize(metrics.energyUsage, 100, 1, 0, 100),
      fullMark: 100,
    },
    {
      subject: 'Toxicity',
      score: normalize(metrics.toxicityScore, 10, 0, 0, 100),
      fullMark: 100,
    },
    {
      subject: 'Renewability',
      score: metrics.renewabilityScore,
      fullMark: 100,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="pl-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Materials
        </Button>
        <Button variant="outline" onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main info card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{category}</p>
              </div>
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-md text-2xl font-bold">
                {sustainabilityScore}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">{description}</p>
            
            <div className="flex flex-wrap gap-2">
              {properties.recyclable && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  Recyclable
                </Badge>
              )}
              {properties.biodegradable && (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  Biodegradable
                </Badge>
              )}
              {properties.lowCarbon && (
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                  Low Carbon
                </Badge>
              )}
              {certifications.map((cert, index) => (
                <Badge key={index} className="bg-violet-100 text-violet-800 hover:bg-violet-200">
                  {cert}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <MetricCard 
                icon={<Leaf className="h-4 w-4 text-green-600" />}
                label="Carbon Footprint"
                value={`${metrics.carbonFootprint} kg CO2e`}
              />
              <MetricCard 
                icon={<Droplet className="h-4 w-4 text-blue-600" />}
                label="Water Usage"
                value={`${metrics.waterUsage} L`}
              />
              <MetricCard 
                icon={<Zap className="h-4 w-4 text-amber-600" />}
                label="Energy Usage"
                value={`${metrics.energyUsage} MJ`}
              />
              <MetricCard 
                icon={<Recycle className="h-4 w-4 text-emerald-600" />}
                label="Renewability"
                value={`${metrics.renewabilityScore}%`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Radar chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sustainability Profile</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name={name}
                  dataKey="score"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alternatives and recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Info className="h-4 w-4 mr-2" />
            Sustainable Alternatives & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Alternative Materials</h4>
              <ul className="space-y-2">
                {alternatives.map((alt, index) => (
                  <li key={index} className="text-sm border-l-2 border-primary pl-3 py-1">
                    <span className="font-medium">{alt.name}</span> - {alt.description}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Sustainability Recommendations</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Consider transitioning to alternatives with lower carbon footprints
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Implement recycling programs specific to this material type
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Reduce water usage in production through process optimization
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Engage with suppliers to improve material sourcing sustainability
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const MetricCard = ({ icon, label, value }: MetricCardProps) => (
  <div className="bg-muted/20 rounded-md p-3">
    <div className="flex items-center mb-1">
      {icon}
      <span className="text-xs ml-1">{label}</span>
    </div>
    <div className="font-medium">{value}</div>
  </div>
);

// Helper function to normalize values for radar chart
function normalize(value: number, max: number, min: number, newMin: number, newMax: number): number {
  // Invert the scale since lower values are better for footprints
  const invertedValue = max - value + min;
  return newMin + (invertedValue - min) * (newMax - newMin) / (max - min);
}

export default MaterialDetailView;
