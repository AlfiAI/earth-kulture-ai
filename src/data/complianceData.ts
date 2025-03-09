
import { ComplianceItemType } from "@/components/compliance/ComplianceItemCard";

// Sample compliance items
export const complianceItems: ComplianceItemType[] = [
  {
    name: 'GHG Protocol',
    status: 'Compliant',
    score: 92,
    lastUpdated: '2 days ago',
    deadline: null,
    description: 'The Greenhouse Gas Protocol provides standards, guidance, tools, and training for business and government to measure and manage climate-warming emissions.'
  },
  {
    name: 'TCFD Reporting',
    status: 'In Progress',
    score: 68,
    lastUpdated: '5 days ago',
    deadline: 'Sep 30, 2023',
    description: 'The Task Force on Climate-related Financial Disclosures provides a framework for companies to disclose climate-related financial information.'
  },
  {
    name: 'EU Taxonomy',
    status: 'Attention Needed',
    score: 45,
    lastUpdated: '12 days ago',
    deadline: 'Oct 15, 2023',
    description: 'The EU Taxonomy is a classification system establishing a list of environmentally sustainable economic activities to help scale up sustainable investment.'
  },
  {
    name: 'CDP Climate Change',
    status: 'Compliant',
    score: 88,
    lastUpdated: '1 month ago',
    deadline: null,
    description: 'CDP is a global disclosure system for investors, companies, cities, states, and regions to manage their environmental impacts.'
  },
  {
    name: 'Science Based Targets',
    status: 'In Progress',
    score: 72,
    lastUpdated: '2 weeks ago',
    deadline: 'Nov 30, 2023',
    description: 'Science-based targets show companies how much and how quickly they need to reduce their greenhouse gas emissions to prevent the worst effects of climate change.'
  },
  {
    name: 'GRI Standards',
    status: 'Compliant',
    score: 85,
    lastUpdated: '3 weeks ago',
    deadline: null,
    description: 'The GRI Standards create a common language for organizations to report on their sustainability impacts in a consistent and credible way.'
  }
];
