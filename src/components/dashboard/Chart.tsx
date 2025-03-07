
import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChartProps {
  data: any[];
  type?: 'line' | 'bar' | 'pie';
  dataKey: string;
  secondaryDataKey?: string;
  xAxisKey?: string;
  height?: number;
  colors?: string[];
  showTabs?: boolean;
}

const Chart = ({
  data,
  type = 'line',
  dataKey,
  secondaryDataKey,
  xAxisKey = 'name',
  height = 300,
  colors = ['#5a9c69', '#3d8eff', '#f59e0b', '#8b5cf6'],
  showTabs = false,
}: ChartProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'line' | 'bar' | 'pie'>(type);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return <div style={{ height }}></div>;
  
  const renderChart = (chartType: 'line' | 'bar' | 'pie') => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey={xAxisKey} 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                width={isMobile ? 30 : 40}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }} 
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={colors[0]} 
                strokeWidth={2} 
                dot={{ r: 3, strokeWidth: 2 }} 
                activeDot={{ r: 5 }} 
                isAnimationActive={true} 
                animationDuration={1000}
              />
              {secondaryDataKey && (
                <Line 
                  type="monotone" 
                  dataKey={secondaryDataKey} 
                  stroke={colors[1]} 
                  strokeWidth={2} 
                  dot={{ r: 3, strokeWidth: 2 }} 
                  activeDot={{ r: 5 }} 
                  isAnimationActive={true} 
                  animationDuration={1000}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey={xAxisKey} 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                width={isMobile ? 30 : 40}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }} 
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar 
                dataKey={dataKey} 
                fill={colors[0]} 
                radius={[4, 4, 0, 0]} 
                isAnimationActive={true} 
                animationDuration={1000}
              />
              {secondaryDataKey && (
                <Bar 
                  dataKey={secondaryDataKey} 
                  fill={colors[1]} 
                  radius={[4, 4, 0, 0]} 
                  isAnimationActive={true} 
                  animationDuration={1000}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={30}
                fill="#8884d8"
                dataKey={dataKey}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                isAnimationActive={true}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  if (!showTabs) {
    return renderChart(type);
  }

  return (
    <Tabs defaultValue={activeTab} onValueChange={(val: string) => setActiveTab(val as any)}>
      <TabsList className="grid grid-cols-3 mb-2">
        <TabsTrigger value="line">Line</TabsTrigger>
        <TabsTrigger value="bar">Bar</TabsTrigger>
        <TabsTrigger value="pie">Pie</TabsTrigger>
      </TabsList>
      
      <TabsContent value="line" className="pt-2">
        {renderChart('line')}
      </TabsContent>
      
      <TabsContent value="bar" className="pt-2">
        {renderChart('bar')}
      </TabsContent>
      
      <TabsContent value="pie" className="pt-2">
        {renderChart('pie')}
      </TabsContent>
    </Tabs>
  );
};

export default Chart;
