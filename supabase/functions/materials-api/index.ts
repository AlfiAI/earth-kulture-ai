
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { query, filters } = await req.json();
    
    console.log(`Searching for materials: ${query} with filters:`, filters);
    
    // In a production implementation, this would use the actual 2050 Materials API
    // const MATERIALS_API_KEY = Deno.env.get('MATERIALS_API_KEY');
    
    // Add a slight delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Get mock materials data
    const materials = getMockMaterials(query, filters);
    
    return new Response(
      JSON.stringify({ materials }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in materials-api function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

// Mock materials data
function getMockMaterials(query: string, filters: any): any[] {
  const mockMaterials = [
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
    // Additional mock materials would be included here
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
    }
  ];
  
  // Apply filters
  let filteredMaterials = [...mockMaterials];
  
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
