
import { useState, useCallback } from 'react';
import { Material, MaterialFilters } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useMaterialsData() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMaterials = useCallback(async (query: string, filters: MaterialFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the edge function for 2050 Materials API
      const { data, error: functionError } = await supabase.functions.invoke('materials-api', {
        body: { query, filters }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data || !data.materials) {
        throw new Error('No materials data found');
      }

      setMaterials(data.materials);
      
    } catch (err) {
      console.error('Error fetching materials data:', err);
      setError((err instanceof Error) ? err.message : 'Failed to fetch materials data');
      toast.error('Failed to fetch materials data');
      
      // Use mock data as fallback
      setMaterials(getMockMaterials(query, filters));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Helper function to get comparison data
  const getComparisonData = useCallback((materialIds: string[]) => {
    const selectedMaterials = materials.filter(m => materialIds.includes(m.id));
    return selectedMaterials;
  }, [materials]);

  return {
    materials,
    isLoading,
    error,
    searchMaterials,
    getComparisonData
  };
}

// Mock data for demonstration and fallback
function getMockMaterials(query: string, filters: MaterialFilters): Material[] {
  const mockMaterials: Material[] = [
    {
      id: 'recycled-pet',
      name: 'Recycled PET',
      description: 'Polyethylene terephthalate (PET) plastic that has been recycled from post-consumer waste, primarily from plastic bottles.',
      category: 'Plastics',
      sustainabilityScore: 76,
      metrics: {
        carbonFootprint: 1.8,
        waterUsage: 80,
        energyUsage: 45,
        toxicityScore: 2.1,
        renewabilityScore: 85
      },
      properties: {
        recyclable: true,
        biodegradable: false,
        lowCarbon: true,
        certificated: true
      },
      alternatives: [
        {
          id: 'bio-pet',
          name: 'Bio-based PET',
          description: 'PET made partially from renewable plant sources instead of petroleum.',
          sustainabilityScore: 72
        },
        {
          id: 'pla',
          name: 'PLA (Polylactic Acid)',
          description: 'Biodegradable thermoplastic derived from renewable resources like corn starch.',
          sustainabilityScore: 68
        }
      ],
      certifications: ['GRS Certified', 'ISCC PLUS']
    },
    {
      id: 'bamboo-fiber',
      name: 'Bamboo Fiber',
      description: 'Natural fiber extracted from bamboo plants, known for its fast renewability and biodegradability.',
      category: 'Natural Fibers',
      sustainabilityScore: 82,
      metrics: {
        carbonFootprint: 1.2,
        waterUsage: 450,
        energyUsage: 27,
        toxicityScore: 1.0,
        renewabilityScore: 95
      },
      properties: {
        recyclable: false,
        biodegradable: true,
        lowCarbon: true,
        certificated: true
      },
      alternatives: [
        {
          id: 'organic-cotton',
          name: 'Organic Cotton',
          description: 'Cotton grown without synthetic fertilizers or pesticides.',
          sustainabilityScore: 71
        },
        {
          id: 'hemp-fiber',
          name: 'Hemp Fiber',
          description: 'Durable natural fiber with low environmental impact.',
          sustainabilityScore: 78
        }
      ],
      certifications: ['OEKO-TEX', 'FSC']
    },
    {
      id: 'recycled-aluminum',
      name: 'Recycled Aluminum',
      description: 'Aluminum produced from scrap and post-consumer waste, requiring significantly less energy than virgin production.',
      category: 'Metals',
      sustainabilityScore: 85,
      metrics: {
        carbonFootprint: 1.5,
        waterUsage: 30,
        energyUsage: 25,
        toxicityScore: 1.8,
        renewabilityScore: 92
      },
      properties: {
        recyclable: true,
        biodegradable: false,
        lowCarbon: true,
        certificated: true
      },
      alternatives: [
        {
          id: 'stainless-steel',
          name: 'Stainless Steel',
          description: 'Highly durable and recyclable metal alloy.',
          sustainabilityScore: 70
        }
      ],
      certifications: ['ASI Certified']
    },
    {
      id: 'virgin-polyester',
      name: 'Virgin Polyester',
      description: 'Synthetic polymer derived from petroleum, widely used in textiles and packaging.',
      category: 'Plastics',
      sustainabilityScore: 35,
      metrics: {
        carbonFootprint: 5.8,
        waterUsage: 180,
        energyUsage: 95,
        toxicityScore: 5.2,
        renewabilityScore: 0
      },
      properties: {
        recyclable: true,
        biodegradable: false,
        lowCarbon: false,
        certificated: false
      },
      alternatives: [
        {
          id: 'recycled-pet',
          name: 'Recycled PET',
          description: 'PET plastic recycled from post-consumer waste.',
          sustainabilityScore: 76
        },
        {
          id: 'bio-pet',
          name: 'Bio-based PET',
          description: 'PET made partially from renewable plant sources.',
          sustainabilityScore: 72
        }
      ],
      certifications: []
    },
    {
      id: 'FSC-certified-wood',
      name: 'FSC-Certified Wood',
      description: 'Wood from forests that are responsibly managed according to Forest Stewardship Council standards.',
      category: 'Wood',
      sustainabilityScore: 88,
      metrics: {
        carbonFootprint: 0.8,
        waterUsage: 60,
        energyUsage: 15,
        toxicityScore: 0.5,
        renewabilityScore: 90
      },
      properties: {
        recyclable: false,
        biodegradable: true,
        lowCarbon: true,
        certificated: true
      },
      alternatives: [
        {
          id: 'reclaimed-wood',
          name: 'Reclaimed Wood',
          description: 'Wood recovered from old buildings, furniture, or other sources.',
          sustainabilityScore: 92
        }
      ],
      certifications: ['FSC', 'PEFC']
    },
    {
      id: 'cork',
      name: 'Cork',
      description: 'Natural, renewable material harvested from the cork oak tree without harming the tree.',
      category: 'Natural Materials',
      sustainabilityScore: 90,
      metrics: {
        carbonFootprint: 0.5,
        waterUsage: 120,
        energyUsage: 10,
        toxicityScore: 0.2,
        renewabilityScore: 98
      },
      properties: {
        recyclable: true,
        biodegradable: true,
        lowCarbon: true,
        certificated: true
      },
      alternatives: [
        {
          id: 'natural-rubber',
          name: 'Natural Rubber',
          description: 'Elastic material harvested from rubber trees.',
          sustainabilityScore: 75
        }
      ],
      certifications: ['FSC']
    }
  ];
  
  // Apply filters
  let filteredMaterials = mockMaterials;
  
  if (filters.recyclable) {
    filteredMaterials = filteredMaterials.filter(m => m.properties.recyclable);
  }
  
  if (filters.biodegradable) {
    filteredMaterials = filteredMaterials.filter(m => m.properties.biodegradable);
  }
  
  if (filters.lowCarbon) {
    filteredMaterials = filteredMaterials.filter(m => m.properties.lowCarbon);
  }
  
  if (filters.certificated) {
    filteredMaterials = filteredMaterials.filter(m => m.properties.certificated);
  }
  
  // Apply search query
  if (query && query.trim() !== '') {
    const lowerQuery = query.toLowerCase();
    filteredMaterials = filteredMaterials.filter(
      m => m.name.toLowerCase().includes(lowerQuery) ||
           m.description.toLowerCase().includes(lowerQuery) ||
           m.category.toLowerCase().includes(lowerQuery)
    );
  }
  
  return filteredMaterials;
}
