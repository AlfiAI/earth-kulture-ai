
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import InsightCard from "./InsightCard";
import { IndustryType } from '@/services/ai/orchestration/types/agentTypes';
import { aiContext } from '@/services/ai/context/aiContext';

interface Insight {
  type: 'trend' | 'recommendation' | 'alert' | 'info';
  title: string;
  description: string;
  indicator?: 'up' | 'down' | 'neutral';
  percentageChange?: number;
  date: string;
}

// Industry-specific insights
const industryInsights: Record<IndustryType, Insight[]> = {
  corporate: [
    {
      type: 'trend',
      title: 'Carbon intensity decreasing',
      description: 'Your carbon intensity per revenue has decreased by 12% compared to last quarter, putting you ahead of industry average.',
      indicator: 'down',
      percentageChange: -12,
      date: 'August 15, 2023'
    },
    {
      type: 'recommendation',
      title: 'Renewable energy opportunity',
      description: 'Based on your energy usage patterns, switching to renewable sources for your main facility could reduce Scope 2 emissions by up to 35% and generate ROI within 3 years.',
      date: 'August 10, 2023'
    },
    {
      type: 'alert',
      title: 'Compliance risk detected',
      description: 'New ESG reporting requirements will become mandatory in your region by Q1 next year. 3 of your current metrics need adjustments to comply.',
      date: 'August 5, 2023'
    },
    {
      type: 'info',
      title: 'Industry benchmark update',
      description: "Your sector's average ESG performance has improved by 5% this quarter. Your company maintains a position in the top quartile.",
      indicator: 'up',
      percentageChange: 8,
      date: 'July 28, 2023'
    }
  ],
  sme: [
    {
      type: 'recommendation',
      title: 'SME funding opportunity',
      description: 'New sustainability grants for SMEs are available in your region. Based on your profile, you could qualify for up to $50k for green initiatives.',
      date: 'August 15, 2023'
    },
    {
      type: 'trend',
      title: 'Energy efficiency improving',
      description: 'Your energy usage per employee has decreased by 8% since implementing new office policies.',
      indicator: 'down',
      percentageChange: -8,
      date: 'August 10, 2023'
    },
    {
      type: 'info',
      title: 'SME certification available',
      description: 'A new SME-focused sustainability certification program has launched that matches your business profile.',
      date: 'August 5, 2023'
    },
    {
      type: 'alert',
      title: 'Supply chain risk',
      description: 'Two of your key suppliers have poor sustainability ratings, which may impact your B Corp certification status.',
      date: 'July 28, 2023'
    }
  ],
  government: [
    {
      type: 'alert',
      title: 'Policy compliance gap',
      description: 'Municipal energy efficiency targets are 15% below the new federal guidelines published last month.',
      indicator: 'down',
      percentageChange: -15,
      date: 'August 15, 2023'
    },
    {
      type: 'info',
      title: 'Citizen engagement opportunity',
      description: 'Analyzing citizen feedback reveals strong interest in community solar programs. Consider expanding your current initiative.',
      date: 'August 10, 2023'
    },
    {
      type: 'trend',
      title: 'Public transportation emissions',
      description: 'Public transit emissions per capita have decreased by 10% year-over-year due to electric bus implementation.',
      indicator: 'down',
      percentageChange: -10,
      date: 'August 5, 2023'
    },
    {
      type: 'recommendation',
      title: 'Federal funding alignment',
      description: 'Your current climate action plan qualifies for three new federal grants. Application deadline is next quarter.',
      date: 'July 28, 2023'
    }
  ],
  individual: [
    {
      type: 'trend',
      title: 'Personal carbon footprint',
      description: 'Your carbon footprint is 12% lower than the average in your area, primarily due to your transportation choices.',
      indicator: 'down',
      percentageChange: -12,
      date: 'August 15, 2023'
    },
    {
      type: 'recommendation',
      title: 'Home energy savings',
      description: 'Switching to LED lighting could reduce your electricity usage by up to 15% and save approximately $120 annually.',
      date: 'August 10, 2023'
    },
    {
      type: 'info',
      title: 'Local recycling update',
      description: 'Your municipality has expanded the types of plastics accepted for recycling. Check the new guidelines.',
      date: 'August 5, 2023'
    },
    {
      type: 'recommendation',
      title: 'Seasonal food choices',
      description: 'Choosing locally grown produce this season could reduce your food-related carbon footprint by up to 25%.',
      indicator: 'down',
      percentageChange: -25,
      date: 'July 28, 2023'
    }
  ],
  technology: [
    {
      type: 'trend',
      title: 'Data center efficiency',
      description: 'Your PUE (Power Usage Effectiveness) has improved by 18% following the server consolidation project.',
      indicator: 'down',
      percentageChange: -18,
      date: 'August 15, 2023'
    },
    {
      type: 'alert',
      title: 'E-waste compliance',
      description: 'New e-waste regulations will affect your hardware lifecycle management. Policy updates required by Q4.',
      date: 'August 10, 2023'
    },
    {
      type: 'recommendation',
      title: 'Green AI implementation',
      description: 'Implementing ML optimization techniques could reduce your cloud computing carbon footprint by 35%.',
      indicator: 'down',
      percentageChange: -35,
      date: 'August 5, 2023'
    },
    {
      type: 'info',
      title: 'Tech sector benchmarking',
      description: 'Your company ranks in the top 20% for sustainability among mid-sized tech companies globally.',
      date: 'July 28, 2023'
    }
  ],
  financial: [
    {
      type: 'trend',
      title: 'Financed emissions decreasing',
      description: 'Your portfolio\'s financed emissions have decreased by 7% this quarter, aligning with your 2030 net-zero targets.',
      indicator: 'down',
      percentageChange: -7,
      date: 'August 15, 2023'
    },
    {
      type: 'alert',
      title: 'SFDR compliance risk',
      description: 'Three investment products may not meet updated SFDR requirements. Review needed before next disclosure period.',
      date: 'August 10, 2023'
    },
    {
      type: 'recommendation',
      title: 'Green bond opportunity',
      description: 'Market analysis suggests favorable conditions for a new green bond issuance this quarter.',
      date: 'August 5, 2023'
    },
    {
      type: 'info',
      title: 'ESG integration progress',
      description: 'ESG factors now incorporated into 78% of AUM, up from 65% last year.',
      indicator: 'up',
      percentageChange: 13,
      date: 'July 28, 2023'
    }
  ],
  education: [
    {
      type: 'trend',
      title: 'Campus energy usage',
      description: 'Campus-wide energy consumption decreased 11% year-over-year following HVAC upgrades.',
      indicator: 'down',
      percentageChange: -11,
      date: 'August 15, 2023'
    },
    {
      type: 'recommendation',
      title: 'Curriculum integration',
      description: 'Analysis shows opportunity to incorporate sustainability themes into 35% more courses across departments.',
      indicator: 'up',
      percentageChange: 35,
      date: 'August 10, 2023'
    },
    {
      type: 'info',
      title: 'STARS rating improvement',
      description: 'Recent initiatives have improved your STARS sustainability rating from Silver to Gold status.',
      date: 'August 5, 2023'
    },
    {
      type: 'alert',
      title: 'Food waste metrics',
      description: 'Dining hall food waste remains 22% above peer institution benchmarks. Consider implementing tracking system.',
      indicator: 'up',
      percentageChange: 22,
      date: 'July 28, 2023'
    }
  ],
  healthcare: [
    {
      type: 'alert',
      title: 'Medical waste compliance',
      description: 'Hazardous waste segregation protocols in east wing don\'t meet updated regulations. Training recommended.',
      date: 'August 15, 2023'
    },
    {
      type: 'trend',
      title: 'Energy intensity improving',
      description: 'Energy usage per patient-day down 9% following efficiency upgrades, exceeding regional healthcare average.',
      indicator: 'down',
      percentageChange: -9,
      date: 'August 10, 2023'
    },
    {
      type: 'recommendation',
      title: 'Sustainable procurement',
      description: 'Switching to reusable medical items in 5 departments could reduce waste by 30% and save $45k annually.',
      indicator: 'down',
      percentageChange: -30,
      date: 'August 5, 2023'
    },
    {
      type: 'info',
      title: 'Healthcare climate pledge',
      description: 'Your organization qualifies for the Healthcare Climate Challenge leadership circle based on recent initiatives.',
      date: 'July 28, 2023'
    }
  ],
  energy: [
    {
      type: 'trend',
      title: 'Renewable generation mix',
      description: 'Renewable sources now comprise 42% of your generation mix, up 15% from previous year.',
      indicator: 'up',
      percentageChange: 15,
      date: 'August 15, 2023'
    },
    {
      type: 'alert',
      title: 'Methane emissions risk',
      description: 'Satellite data detected potential methane leak at northern facility. On-site investigation recommended.',
      date: 'August 10, 2023'
    },
    {
      type: 'recommendation',
      title: 'Grid resilience opportunity',
      description: 'Integrating battery storage at 3 key substations would improve resilience and reduce peak emissions by 25%.',
      indicator: 'down',
      percentageChange: -25,
      date: 'August 5, 2023'
    },
    {
      type: 'info',
      title: 'Transition plan alignment',
      description: 'Your current transition plan aligns with 2°C scenario but requires adjustments to reach 1.5°C pathway.',
      date: 'July 28, 2023'
    }
  ],
  manufacturing: [
    {
      type: 'trend',
      title: 'Production efficiency',
      description: 'Resource efficiency improved 8% following lean manufacturing implementation. Carbon per unit down 12%.',
      indicator: 'down',
      percentageChange: -12,
      date: 'August 15, 2023'
    },
    {
      type: 'recommendation',
      title: 'Circular material flows',
      description: 'Implementing closed-loop system for aluminum scrap could reduce raw material costs by 22% annually.',
      indicator: 'down',
      percentageChange: -22,
      date: 'August 10, 2023'
    },
    {
      type: 'alert',
      title: 'Supply chain emissions gap',
      description: 'Scope 3 supplier emissions reporting incomplete for 35% of tier 1 suppliers. May affect disclosure compliance.',
      indicator: 'up',
      percentageChange: 35,
      date: 'August 5, 2023'
    },
    {
      type: 'info',
      title: 'Industry certification',
      description: 'Your facility now ranks in the top quartile for ISO 14001 implementation in your sector.',
      date: 'July 28, 2023'
    }
  ],
  retail: [
    {
      type: 'trend',
      title: 'Packaging waste reduction',
      description: 'New packaging initiatives reduced plastic usage by 27% compared to same period last year.',
      indicator: 'down',
      percentageChange: -27,
      date: 'August 15, 2023'
    },
    {
      type: 'recommendation',
      title: 'Last-mile delivery optimization',
      description: 'Implementing route optimization could reduce delivery emissions by 18% while improving delivery times.',
      indicator: 'down',
      percentageChange: -18,
      date: 'August 10, 2023'
    },
    {
      type: 'info',
      title: 'Consumer sentiment analysis',
      description: '72% of your customers now rank sustainability as "important" in purchase decisions, up from 58% last year.',
      indicator: 'up',
      percentageChange: 14,
      date: 'August 5, 2023'
    },
    {
      type: 'alert',
      title: 'Product compliance risk',
      description: 'Upcoming chemical regulations will affect 15% of your SKUs. Reformulation planning recommended.',
      date: 'July 28, 2023'
    }
  ],
  other: [
    {
      type: 'trend',
      title: 'Carbon intensity decreasing',
      description: 'Your carbon intensity per revenue has decreased by 12% compared to last quarter, putting you ahead of industry average.',
      indicator: 'down',
      percentageChange: -12,
      date: 'August 15, 2023'
    },
    {
      type: 'recommendation',
      title: 'Renewable energy opportunity',
      description: 'Based on your energy usage patterns, switching to renewable sources for your main facility could reduce Scope 2 emissions by up to 35% and generate ROI within 3 years.',
      date: 'August 10, 2023'
    },
    {
      type: 'alert',
      title: 'Compliance risk detected',
      description: 'New ESG reporting requirements will become mandatory in your region by Q1 next year. 3 of your current metrics need adjustments to comply.',
      date: 'August 5, 2023'
    },
    {
      type: 'info',
      title: 'Industry benchmark update',
      description: "Your sector's average ESG performance has improved by 5% this quarter. Your company maintains a position in the top quartile.",
      indicator: 'up',
      percentageChange: 8,
      date: 'July 28, 2023'
    }
  ]
};

// Sample insights as fallback
const sampleInsights: Insight[] = [
  {
      type: 'trend',
      title: 'Carbon intensity decreasing',
      description: 'Your carbon intensity per revenue has decreased by 12% compared to last quarter, putting you ahead of industry average.',
      indicator: 'down',
      percentageChange: -12,
      date: 'August 15, 2023'
  },
  {
      type: 'recommendation',
      title: 'Renewable energy opportunity',
      description: 'Based on your energy usage patterns, switching to renewable sources for your main facility could reduce Scope 2 emissions by up to 35% and generate ROI within 3 years.',
      date: 'August 10, 2023'
  },
  {
      type: 'alert',
      title: 'Compliance risk detected',
      description: 'New ESG reporting requirements will become mandatory in your region by Q1 next year. 3 of your current metrics need adjustments to comply.',
      date: 'August 5, 2023'
  },
  {
      type: 'info',
      title: 'Industry benchmark update',
      description: "Your sector's average ESG performance has improved by 5% this quarter. Your company maintains a position in the top quartile.",
      indicator: 'up',
      percentageChange: 8,
      date: 'July 28, 2023'
  }
];

const AIInsights = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [insights, setInsights] = useState<Insight[]>(sampleInsights);
  
  useEffect(() => {
    if (userProfile?.industry) {
      const industry = userProfile.industry as IndustryType;
      const relevantInsights = industryInsights[industry] || sampleInsights;
      setInsights(relevantInsights);
    }
  }, [userProfile]);
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">AI-Generated Insights</h2>
        <div className="flex items-center gap-2">
          {userProfile?.industry && (
            <span className="text-xs text-muted-foreground">
              Tailored for {userProfile.industry.charAt(0).toUpperCase() + userProfile.industry.slice(1)}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={() => navigate('/insights')}>View all insights</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.slice(0, 4).map((insight, index) => (
          <InsightCard
            key={index}
            type={insight.type}
            title={insight.title}
            description={insight.description}
            indicator={insight.indicator}
            percentageChange={insight.percentageChange}
            date={insight.date}
            onClick={() => navigate('/insights')}
          />
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
