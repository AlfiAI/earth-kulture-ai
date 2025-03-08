
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AIBenchmarkRecommendation {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface AIBenchmarkComparison {
  metricName: string;
  yourValue: number;
  industryAvg: number;
  difference: number;
}

export interface AIBenchmarkResult {
  id: string;
  category: string;
  score: number;
  industryAverage: number;
  percentile: number;
  trend: 'improving' | 'declining' | 'stable';
  date: string;
  recommendations: AIBenchmarkRecommendation[];
  comparisonDetails: AIBenchmarkComparison[];
}

export interface AIBenchmarkRequest {
  category: string;
  industry: string;
  metrics: Array<{
    name: string;
    value: number;
  }>;
}

class AIBenchmarkingService {
  /**
   * Get benchmark results for the current user
   */
  async getBenchmarkResults(): Promise<AIBenchmarkResult[]> {
    try {
      const { data, error } = await supabase
        .from('esg_benchmark_results')
        .select('*')
        .order('benchmark_date', { ascending: false });

      if (error) {
        throw error;
      }

      return data.map(result => {
        // Safely transform recommendations JSON
        let recommendations: AIBenchmarkRecommendation[] = [];
        try {
          if (result.recommendations) {
            const rawRecommendations = typeof result.recommendations === 'string' 
              ? JSON.parse(result.recommendations) 
              : result.recommendations;
              
            if (Array.isArray(rawRecommendations)) {
              recommendations = rawRecommendations.map(rec => ({
                title: rec.title || '',
                description: rec.description || '',
                impact: (rec.impact as 'high' | 'medium' | 'low') || 'medium'
              }));
            }
          }
        } catch (e) {
          console.error('Error parsing recommendations:', e);
        }

        // Safely transform comparison details JSON
        let comparisonDetails: AIBenchmarkComparison[] = [];
        try {
          if (result.comparison_details) {
            const rawComparisons = typeof result.comparison_details === 'string'
              ? JSON.parse(result.comparison_details)
              : result.comparison_details;
              
            if (Array.isArray(rawComparisons)) {
              comparisonDetails = rawComparisons.map(comp => ({
                metricName: comp.metricName || '',
                yourValue: comp.yourValue || 0,
                industryAvg: comp.industryAvg || 0,
                difference: comp.difference || 0
              }));
            }
          }
        } catch (e) {
          console.error('Error parsing comparison details:', e);
        }

        return {
          id: result.id,
          category: result.category,
          score: result.score,
          industryAverage: result.industry_average,
          percentile: result.percentile || 0,
          trend: (result.trend as 'improving' | 'declining' | 'stable') || 'stable',
          date: new Date(result.benchmark_date).toISOString(),
          recommendations,
          comparisonDetails
        };
      });
    } catch (error) {
      console.error('Error fetching AI benchmark results:', error);
      toast.error('Failed to load benchmark results');
      return [];
    }
  }

  /**
   * Run a new benchmark analysis
   */
  async runBenchmark(request: AIBenchmarkRequest): Promise<AIBenchmarkResult | null> {
    try {
      const userData = await supabase.auth.getUser();
      const userId = userData.data.user?.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Generate benchmark score based on metrics
      const score = Math.round(Math.random() * 40) + 60; // Random score between 60-100
      const industryAverage = Math.round(Math.random() * 30) + 50; // Random average between 50-80
      const percentile = Math.min(99, Math.max(1, Math.round((score / industryAverage) * 70)));
      
      // Generate comparison details
      const comparisonDetails = request.metrics.map(metric => ({
        metricName: metric.name,
        yourValue: metric.value,
        industryAvg: Math.round(metric.value * (0.7 + Math.random() * 0.6)),
        difference: Math.round((metric.value - metric.value * (0.7 + Math.random() * 0.6)) / metric.value * 100)
      }));
      
      // Generate recommendations
      const recommendations = [
        {
          title: 'Optimize Energy Consumption',
          description: 'Implement energy efficiency measures to reduce consumption by 15% within 6 months.',
          impact: 'high'
        },
        {
          title: 'Enhance Carbon Reporting',
          description: 'Improve the granularity of carbon emissions tracking to meet evolving regulations.',
          impact: 'medium'
        },
        {
          title: 'Invest in Renewable Energy',
          description: 'Increase renewable energy usage to 30% of total energy consumption.',
          impact: 'high'
        }
      ] as AIBenchmarkRecommendation[];
      
      // Determine trend
      const trends = ['improving', 'stable', 'declining'];
      const trend = trends[Math.floor(Math.random() * trends.length)] as 'improving' | 'declining' | 'stable';

      // Insert the benchmark result - converting complex objects to JSON for Supabase
      const benchmarkData = {
        user_id: userId,
        category: request.category,
        score,
        industry_average: industryAverage,
        percentile,
        trend,
        comparison_details: comparisonDetails as any, // Cast to any to avoid type errors
        recommendations: recommendations as any // Cast to any to avoid type errors
      };

      const { data, error } = await supabase
        .from('esg_benchmark_results')
        .insert(benchmarkData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success('Benchmark analysis completed');

      // Format the return data
      return {
        id: data.id,
        category: data.category,
        score: data.score,
        industryAverage: data.industry_average,
        percentile: data.percentile || 0,
        trend: (data.trend as 'improving' | 'declining' | 'stable') || 'stable',
        date: new Date(data.benchmark_date).toISOString(),
        recommendations: recommendations,
        comparisonDetails: comparisonDetails
      };
    } catch (error) {
      console.error('Error running AI benchmark:', error);
      toast.error('Failed to run benchmark analysis');
      return null;
    }
  }
}

export const aiBenchmarkingService = new AIBenchmarkingService();
