
import { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  ListFilter, 
  Download, 
  Loader2,
  CheckCircle,
  Filter
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { esgDataService, ESGReport } from '@/services/esgDataService';

const ReportGenerator = () => {
  const [reportType, setReportType] = useState('esg');
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setMonth(new Date().getMonth() - 3))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(['GHG Protocol', 'TCFD']);
  const [focusAreas, setFocusAreas] = useState<string[]>(['carbon', 'energy', 'water']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<ESGReport | null>(null);
  
  // Framework options
  const frameworks = [
    { id: 'ghg', label: 'GHG Protocol' },
    { id: 'tcfd', label: 'TCFD' },
    { id: 'gri', label: 'GRI Standards' },
    { id: 'sasb', label: 'SASB' },
    { id: 'eu', label: 'EU Taxonomy' },
    { id: 'cdp', label: 'CDP Climate Change' },
  ];
  
  // Focus area options
  const areas = [
    { id: 'carbon', label: 'Carbon Emissions' },
    { id: 'energy', label: 'Energy Usage' },
    { id: 'water', label: 'Water Management' },
    { id: 'waste', label: 'Waste & Recycling' },
    { id: 'biodiversity', label: 'Biodiversity' },
    { id: 'social', label: 'Social Responsibility' },
    { id: 'governance', label: 'Governance' },
  ];
  
  const toggleFramework = (framework: string) => {
    setSelectedFrameworks(prev => 
      prev.includes(framework)
        ? prev.filter(f => f !== framework)
        : [...prev, framework]
    );
  };
  
  const toggleFocusArea = (area: string) => {
    setFocusAreas(prev => 
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };
  
  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    
    if (selectedFrameworks.length === 0) {
      toast.error('Please select at least one framework');
      return;
    }
    
    if (focusAreas.length === 0) {
      toast.error('Please select at least one focus area');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const report = await esgDataService.generateESGReport({
        dateRange: {
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0],
        },
        frameworks: selectedFrameworks,
        focusAreas: focusAreas,
      });
      
      setGeneratedReport(report);
      toast.success('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownload = (format: 'pdf' | 'csv' | 'excel') => {
    if (!generatedReport) return;
    
    // In a real app, this would call an API to generate the actual file
    toast.success(`Downloading report as ${format.toUpperCase()}`);
    
    // Simulate download delay
    setTimeout(() => {
      toast.success(`${format.toUpperCase()} report downloaded successfully`);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          AI-Generated ESG Reports
        </CardTitle>
        <CardDescription>
          Create customized sustainability reports powered by AI analytics
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!generatedReport ? (
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 w-auto mx-auto">
              <TabsTrigger value="settings">Report Settings</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Report Type</h3>
                  <Select defaultValue={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="esg">Comprehensive ESG Report</SelectItem>
                      <SelectItem value="carbon">Carbon Footprint Analysis</SelectItem>
                      <SelectItem value="compliance">Compliance Status Report</SelectItem>
                      <SelectItem value="benchmarking">Industry Benchmarking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Start Date
                    </h3>
                    <DatePicker
                      date={startDate}
                      setDate={setStartDate}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      End Date
                    </h3>
                    <DatePicker
                      date={endDate}
                      setDate={setEndDate}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <ListFilter className="h-4 w-4 mr-1" />
                    Frameworks
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {frameworks.map((framework) => (
                      <div key={framework.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`framework-${framework.id}`} 
                          checked={selectedFrameworks.includes(framework.label)}
                          onCheckedChange={() => toggleFramework(framework.label)}
                        />
                        <Label htmlFor={`framework-${framework.id}`}>{framework.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Filter className="h-4 w-4 mr-1" />
                    Focus Areas
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {areas.map((area) => (
                      <div key={area.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`area-${area.id}`} 
                          checked={focusAreas.includes(area.id)}
                          onCheckedChange={() => toggleFocusArea(area.id)}
                        />
                        <Label htmlFor={`area-${area.id}`}>{area.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="border rounded-md p-6 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Report Preview</h3>
                <p className="text-muted-foreground mb-6">
                  Generate the report to see a preview
                </p>
                <Button onClick={handleGenerateReport} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>Generate Report</>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-md">
              <h2 className="text-xl font-medium mb-2">{generatedReport.title}</h2>
              <p className="text-sm text-muted-foreground mb-2">
                Generated on {new Date(generatedReport.dateGenerated).toLocaleDateString()}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {generatedReport.frameworks.map((framework, i) => (
                  <span key={i} className="bg-primary/10 text-primary text-xs py-1 px-2 rounded-full">
                    {framework}
                  </span>
                ))}
              </div>
              <p className="text-sm">{generatedReport.summary}</p>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Key Findings
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                {generatedReport.keyFindings.map((finding, i) => (
                  <li key={i}>{finding}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Recommendations</h3>
              <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                {generatedReport.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div className="bg-muted/30 p-3 rounded-md">
                <p className="text-xs text-muted-foreground">Carbon Emissions</p>
                <p className="text-lg font-medium">{generatedReport.dataPoints.totalCarbonEmissions} tCO2e</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-md">
                <p className="text-xs text-muted-foreground">Renewable Energy</p>
                <p className="text-lg font-medium">{generatedReport.dataPoints.renewableEnergyPercentage}%</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-md">
                <p className="text-xs text-muted-foreground">Recycling Rate</p>
                <p className="text-lg font-medium">{generatedReport.dataPoints.wasteRecyclingRate}%</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-md">
                <p className="text-xs text-muted-foreground">Water Usage</p>
                <p className="text-lg font-medium">{generatedReport.dataPoints.waterUsage} m³</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-md md:col-span-2">
                <p className="text-xs text-muted-foreground">Compliance Score</p>
                <p className="text-lg font-medium">{generatedReport.dataPoints.complianceScore}%</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {generatedReport ? (
          <>
            <Button variant="outline" onClick={() => setGeneratedReport(null)}>
              Back to Settings
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleDownload('csv')}>
                <Download className="h-4 w-4 mr-1" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDownload('excel')}>
                <Download className="h-4 w-4 mr-1" />
                Excel
              </Button>
              <Button onClick={() => handleDownload('pdf')}>
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          </>
        ) : (
          <Button 
            className="ml-auto" 
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ReportGenerator;
