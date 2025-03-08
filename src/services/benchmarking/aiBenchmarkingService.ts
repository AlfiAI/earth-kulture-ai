
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ESGBenchmark } from '@/services/external/types/externalTypes';

export interface AIBenchmarkResult {
  id: string;
  category: string;
  score: number;
  industryAverage: number;
  percentile?: number;
  trend: 'improving' | 'declining' | 'stable';
  date: string;
  recommendations: {
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }[];
  comparisonDetails: {
    metricName: string;
    yourValue: number;
    industryAvg: number;
    difference: number;
  }[];
}

export interface BenchmarkRequest {
  category: string;
  industry: string;
  metrics: {
    name: string;
    value: number;
  }[];
}

class AIBenchmarkingService {
  /**
   * Get benchmark results for the current user
   */
  async getBenchmarkResults(category?: string): Promise<AIBenchmarkResult[]> {
    try {
      let query = supabase
        .from('esg_benchmark_results')
        .select('*')
        .order('benchmark_date', { ascending: false });
        
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data.map(result => {
        const recommendations = Array.isArray(result.recommendations) 
          ? result.recommendations.map((rec: any) => ({
              title: rec.title || '',
              description: rec.description || '',
              impact: (rec.impact as 'high' | 'medium' | 'low') || 'medium'
            }))
          : [];
          
        const comparisonDetails = Array.isArray(result.comparison_details)
          ? result.comparison_details.map((detail: any) => ({
              metricName: detail.metricName || '',
              yourValue: detail.yourValue || 0,
              industryAvg: detail.industryAvg || 0,
              difference: detail.difference || 0
            }))
          : [];
          
        return {
          id: result.id,
          category: result.category,
          score: result.score,
          industryAverage: result.industry_average,
          percentile: result.percentile,
          trend: result.trend as 'improving' | 'declining' | 'stable',
          date: new Date(result.benchmark_date).toISOString(),
          recommendations,
          comparisonDetails
        };
      });
    } catch (error) {
      console.error('Error fetching benchmark results:', error);
      toast.error('Failed to load benchmark results');
      return [];
    }
  }

  /**
   * Run a new benchmark analysis
   */
  async runBenchmark(request: BenchmarkRequest): Promise<AIBenchmarkResult | null> {
    try {
      // In a real application, this would call an ML model to analyze the data
      // For this example, we'll use a simplified approach
      
      // Get industry benchmarks from external data
      const { data: benchmarks, error: benchmarkError } = await supabase
        .from('esg_benchmarks')
        .select('*')
        .eq('industry', request.industry)
        .eq('category', request.category);
        
      if (benchmarkError) {
        throw benchmarkError;
      }
      
      const benchmarkMap: Record<string, number> = {};
      benchmarks.forEach((benchmark: ESGBenchmark) => {
        benchmarkMap[benchmark.benchmark_name] = benchmark.benchmark_value || 0;
      });
      
      // Generate comparison details
      const comparisonDetails = request.metrics.map(metric => {
        const industryAvg = benchmarkMap[metric.name] || 0;
        return {
          metricName: metric.name,
          yourValue: metric.value,
          industryAvg,
          difference: metric.value - industryAvg
        };
      });
      
      // Calculate overall score
      const totalScore = request.metrics.reduce((sum, metric) => {
        const industryAvg = benchmarkMap[metric.name] || 0;
        if (industryAvg === 0) return sum;
        
        // For environmental metrics, lower is better
        const performanceRatio = request.category === 'environmental' 
          ? industryAvg / metric.value 
          : metric.value / industryAvg;
          
        return sum + (performanceRatio * 100);
      }, 0);
      
      const averageScore = totalScore / (request.metrics.length || 1);
      const normalizedScore = Math.min(100, Math.max(0, averageScore));
      
      // Calculate industry average
      const industryAverage = 65; // Simplified; would come from real data
      
      // Generate recommendations
      const recommendations = generateRecommendations(request.category, comparisonDetails);
      
      // Store the benchmark result
      const { data, error } = await supabase
        .from('esg_benchmark_results')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          category: request.category,
          score: normalizedScore,
          industry_average: industryAverage,
          percentile: normalizedScore > industryAverage ? 75 : 50, // Simplified
          trend: 'stable', // Would be determined from historical data
          comparison_details: comparisonDetails,
          recommendations
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      toast.success('Benchmark analysis completed');
      
      return {
        id: data.id,
        category: data.category,
        score: data.score,
        industryAverage: data.industry_average,
        percentile: data.percentile,
        trend: data.trend as 'improving' | 'declining' | 'stable',
        date: new Date(data.benchmark_date).toISOString(),
        recommendations: Array.isArray(data.recommendations) 
          ? data.recommendations
          : [],
        comparisonDetails: Array.isArray(data.comparison_details)
          ? data.comparison_details
          : []
      };
    } catch (error) {
      console.error('Error running benchmark analysis:', error);
      toast.error('Failed to run benchmark analysis');
      return null;
    }
  }
}

// Helper function to generate recommendations based on comparison details
function generateRecommendations(
  category: string, 
  comparisons: {metricName: string; yourValue: number; industryAvg: number; difference: number}[]
) {
  // Sort by largest relative difference from industry average
  const sortedComparisons = [...comparisons].sort((a, b) => {
    const aRatio = Math.abs(a.difference / (a.industryAvg || 1));
    const bRatio = Math.abs(b.difference / (b.industryAvg || 1));
    return bRatio - aRatio;
  });
  
  const recommendations = [];
  
  // Generate recommendations for the top 3 metrics
  for (let i = 0; i < Math.min(3, sortedComparisons.length); i++) {
    const comparison = sortedComparisons[i];
    
    // Skip if no industry average to compare against
    if (comparison.industryAvg === 0) continue;
    
    const isPerformingWorse = category === 'environmental' 
      ? comparison.yourValue > comparison.industryAvg
      : comparison.yourValue < comparison.industryAvg;
      
    if (isPerformingWorse) {
      const percentDifference = Math.abs(comparison.difference / comparison.industryAvg * 100).toFixed(1);
      
      let recommendation;
      let impact: 'high' | 'medium' | 'low';
      
      if (category === 'environmental') {
        recommendation = {
          title: `Reduce ${comparison.metricName}`,
          description: `Your ${comparison.metricName} is ${percentDifference}% higher than the industry average. Consider implementing reduction strategies.`
        };
      } else {
        recommendation = {
          title: `Improve ${comparison.metricName}`,
          description: `Your ${comparison.metricName} is ${percentDifference}% lower than the industry average. Focus on enhancing this metric.`
        };
      }
      
      // Determine impact level
      if (Math.abs(comparison.difference / comparison.industryAvg) > 0.3) {
        impact = 'high';
      } else if (Math.abs(comparison.difference / comparison.industryAvg) > 0.1) {
        impact = 'medium';
      } else {
        impact = 'low';
      }
      
      recommendations.push({
        ...recommendation,
        impact
      });
    }
  }
  
  // If no negative recommendations, add a positive one
  if (recommendations.length === 0 && sortedComparisons.length > 0) {
    const bestPerforming = sortedComparisons.find(c => {
      return category === 'environmental' 
        ? c.yourValue < c.industryAvg
        : c.yourValue > c.industryAvg;
    });
    
    if (bestPerforming) {
      const percentDifference = Math.abs(bestPerforming.difference / bestPerforming.industryAvg * 100).toFixed(1);
      
      recommendations.push({
        title: `Maintain ${bestPerforming.metricName} Excellence`,
        description: `Your ${bestPerforming.metricName} is ${percentDifference}% better than the industry average. Continue your successful strategies in this area.`,
        impact: 'medium'
      });
    }
  }
  
  return recommendations;
}

export const aiBenchmarkingService = new AIBenchmarkingService();
