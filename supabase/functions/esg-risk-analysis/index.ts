
import { createClient } from "../esg-scraper/utils.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type RiskAnalysisRequest = {
  userId: string;
  category: string;
  dataPoints: Array<{
    metric: string;
    value: number;
    date: string;
  }>;
  complianceFrameworks: string[];
  industryBenchmarks?: Record<string, number>;
};

interface RiskPrediction {
  category: string;
  score: number;
  confidence: number;
  factors: Array<{
    name: string;
    impact: number;
    recommendation: string;
  }>;
  trend: 'improving' | 'declining' | 'stable';
  details: string;
  isCritical: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase credentials");
    }
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Parse request
    const requestData: RiskAnalysisRequest = await req.json();
    const { userId, category, dataPoints, complianceFrameworks } = requestData;
    
    if (!userId || !category || !dataPoints || dataPoints.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Analyzing risk for user ${userId} in category ${category}`);
    
    // In a real implementation, this would use a trained ML model.
    // For demonstration, we'll use a rule-based approach.
    const prediction = await analyzePrediction(
      category, 
      dataPoints, 
      complianceFrameworks,
      requestData.industryBenchmarks
    );
    
    // Store the prediction in the database
    const { data, error } = await supabase
      .from('esg_risk_predictions')
      .insert({
        user_id: userId,
        risk_category: category,
        risk_score: prediction.score,
        confidence_level: prediction.confidence,
        prediction_details: prediction,
        model_version: '1.0.0',
        is_critical: prediction.isCritical,
        training_data_range: {
          start: dataPoints[0].date,
          end: dataPoints[dataPoints.length - 1].date
        }
      })
      .select('id');
      
    if (error) {
      console.error("Error storing prediction:", error);
      throw error;
    }
    
    console.log(`Risk prediction stored with ID: ${data[0].id}`);
    
    // Return the prediction
    return new Response(
      JSON.stringify({ 
        prediction,
        predictionId: data[0].id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in ESG risk analysis:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Simplified rule-based prediction logic
// In a production environment, this would be replaced with a trained ML model
async function analyzePrediction(
  category: string,
  dataPoints: Array<{ metric: string; value: number; date: string }>,
  complianceFrameworks: string[],
  industryBenchmarks?: Record<string, number>
): Promise<RiskPrediction> {
  // Analyze the trend by comparing the first and last values of each metric
  const groupedByMetric: Record<string, Array<{ value: number; date: string }>> = {};
  
  dataPoints.forEach(dp => {
    if (!groupedByMetric[dp.metric]) {
      groupedByMetric[dp.metric] = [];
    }
    groupedByMetric[dp.metric].push({ value: dp.value, date: dp.date });
  });
  
  // Calculate trend for each metric
  const metricTrends: Record<string, { trend: 'improving' | 'declining' | 'stable'; change: number }> = {};
  
  Object.keys(groupedByMetric).forEach(metric => {
    const points = groupedByMetric[metric].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    if (points.length >= 2) {
      const first = points[0].value;
      const last = points[points.length - 1].value;
      const change = ((last - first) / first) * 100;
      
      let trend: 'improving' | 'declining' | 'stable';
      if (change > 5) {
        trend = category === 'carbon' ? 'declining' : 'improving';
      } else if (change < -5) {
        trend = category === 'carbon' ? 'improving' : 'declining';
      } else {
        trend = 'stable';
      }
      
      metricTrends[metric] = { trend, change };
    } else {
      metricTrends[metric] = { trend: 'stable', change: 0 };
    }
  });
  
  // Identify overall trend
  const trends = Object.values(metricTrends).map(t => t.trend);
  const improvingCount = trends.filter(t => t === 'improving').length;
  const decliningCount = trends.filter(t => t === 'declining').length;
  
  let overallTrend: 'improving' | 'declining' | 'stable';
  if (improvingCount > decliningCount * 1.5) {
    overallTrend = 'improving';
  } else if (decliningCount > improvingCount * 1.5) {
    overallTrend = 'declining';
  } else {
    overallTrend = 'stable';
  }
  
  // Calculate risk score (0-100, higher is riskier)
  let baseRiskScore = 50; // Start at medium risk
  
  // Adjust based on trend
  if (overallTrend === 'improving') {
    baseRiskScore -= 15;
  } else if (overallTrend === 'declining') {
    baseRiskScore += 20;
  }
  
  // Adjust based on compliance framework coverage
  const frameworkCoverage = Math.min(1, complianceFrameworks.length / 3) * 10;
  baseRiskScore -= frameworkCoverage;
  
  // Adjust based on industry benchmarks if available
  if (industryBenchmarks) {
    // Compare metrics to industry averages
    let benchmarkDeviations = 0;
    let comparedMetrics = 0;
    
    Object.keys(groupedByMetric).forEach(metric => {
      if (industryBenchmarks[metric]) {
        const latestValue = groupedByMetric[metric][groupedByMetric[metric].length - 1].value;
        const benchmark = industryBenchmarks[metric];
        
        // For carbon metrics, being higher than industry average increases risk
        // For other metrics, being lower than industry average increases risk
        const deviation = category === 'carbon' 
          ? (latestValue / benchmark) - 1
          : 1 - (latestValue / benchmark);
        
        benchmarkDeviations += deviation * 100;
        comparedMetrics++;
      }
    });
    
    if (comparedMetrics > 0) {
      const avgDeviation = benchmarkDeviations / comparedMetrics;
      baseRiskScore += avgDeviation * 0.5; // Scale the impact
    }
  }
  
  // Ensure score is within 0-100 range
  const riskScore = Math.max(0, Math.min(100, baseRiskScore));
  
  // Generate impact factors
  const factors = Object.entries(metricTrends)
    .sort((a, b) => Math.abs(b[1].change) - Math.abs(a[1].change))
    .slice(0, 3)
    .map(([metric, { trend, change }]) => {
      const impact = change / 100;
      let recommendation = '';
      
      if (category === 'carbon' && trend === 'declining') {
        recommendation = `Implement carbon reduction strategies for ${metric.toLowerCase()}`;
      } else if (category === 'carbon' && trend === 'improving') {
        recommendation = `Continue successful carbon reduction in ${metric.toLowerCase()}`;
      } else if (trend === 'declining') {
        recommendation = `Review and enhance ${metric.toLowerCase()} practices`;
      } else if (trend === 'improving') {
        recommendation = `Maintain successful ${metric.toLowerCase()} initiatives`;
      } else {
        recommendation = `Monitor ${metric.toLowerCase()} for potential changes`;
      }
      
      return {
        name: metric,
        impact,
        recommendation
      };
    });
  
  return {
    category,
    score: riskScore,
    confidence: 0.75, // Fixed confidence level for demo
    factors,
    trend: overallTrend,
    details: `Based on analysis of ${dataPoints.length} data points across ${Object.keys(groupedByMetric).length} metrics`,
    isCritical: riskScore > 75
  };
}
