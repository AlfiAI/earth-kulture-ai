
import { useState, useCallback } from 'react';
import { Supplier, SustainabilityMetrics } from '../types';
import { toast } from 'sonner';

// Mock data for demonstration
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'EcoGreen Materials',
    location: 'Austin, TX',
    region: 'North America',
    country: 'USA',
    tier: 'tier1',
    sustainabilityScore: 85,
    verified: true,
    products: ['Recycled Packaging', 'Sustainable Paper'],
    certifications: ['ISO 14001', 'Green Seal']
  },
  {
    id: '2',
    name: 'SustainTech Solutions',
    location: 'Berlin, Germany',
    region: 'Europe',
    country: 'Germany',
    tier: 'tier1',
    sustainabilityScore: 92,
    verified: true,
    products: ['Energy Systems', 'Smart Grids'],
    certifications: ['ISO 14001', 'B Corp']
  },
  {
    id: '3',
    name: 'GlobalTex Industries',
    location: 'Dhaka, Bangladesh',
    region: 'Asia',
    country: 'Bangladesh',
    tier: 'tier2',
    sustainabilityScore: 58,
    verified: false,
    products: ['Textiles', 'Fabrics'],
    certifications: ['OEKO-TEX']
  },
  {
    id: '4',
    name: 'Pacific Resource Materials',
    location: 'Singapore',
    region: 'Asia',
    country: 'Singapore',
    tier: 'tier2',
    sustainabilityScore: 72,
    verified: true,
    products: ['Raw Materials', 'Chemicals'],
    certifications: ['ISO 14001']
  },
  {
    id: '5',
    name: 'AfriSustain Cooperative',
    location: 'Nairobi, Kenya',
    region: 'Africa',
    country: 'Kenya',
    tier: 'tier1',
    sustainabilityScore: 79,
    verified: true,
    products: ['Agricultural Products', 'Fair Trade Goods'],
    certifications: ['Fair Trade', 'Rainforest Alliance']
  }
];

const mockMetrics: SustainabilityMetrics = {
  overall: 76,
  environmental: 82,
  social: 74,
  governance: 69,
  carbonEmissions: 65,
  waterUsage: 78,
  wasteManagement: 83,
  laborPractices: 71
};

export function useSupplyChainData() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [metrics, setMetrics] = useState<SustainabilityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSuppliers = useCallback(async (query?: string, filterType?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call the Open Supply Hub API
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

      // Filter mock data based on query and filter type
      let filteredSuppliers = [...mockSuppliers];
      
      if (query) {
        const lowerQuery = query.toLowerCase();
        filteredSuppliers = filteredSuppliers.filter(
          supplier => 
            supplier.name.toLowerCase().includes(lowerQuery) ||
            supplier.location.toLowerCase().includes(lowerQuery)
        );
      }
      
      if (filterType && filterType !== 'all') {
        filteredSuppliers = filteredSuppliers.filter(
          supplier => supplier.tier === filterType
        );
      }

      setSuppliers(filteredSuppliers);
      setMetrics(mockMetrics);
    } catch (err) {
      console.error('Error fetching supply chain data:', err);
      setError(err as Error);
      toast.error('Failed to fetch supply chain data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    suppliers,
    metrics,
    isLoading,
    error,
    fetchSuppliers
  };
}
