import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DataSource } from './types';
import { User } from '@supabase/supabase-js';

export const useDataSources = (isAuthenticated: boolean, user: User | null) => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDataSources = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('last_updated', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const formattedData: DataSource[] = data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          lastUpdated: new Date(item.last_updated).toISOString().split('T')[0],
          status: item.status as 'active' | 'needs-update',
          format: item.format,
          recordCount: item.record_count || 0
        }));
        
        setDataSources(formattedData);
      } else {
        // Set sample data
        setDataSources([
          {
            id: '1',
            name: 'Energy Consumption',
            category: 'environmental',
            lastUpdated: '2023-08-15',
            status: 'active',
            format: 'excel',
            recordCount: 1245
          },
          {
            id: '2',
            name: 'Water Usage',
            category: 'environmental',
            lastUpdated: '2023-08-10',
            status: 'active',
            format: 'csv',
            recordCount: 890
          },
          {
            id: '3',
            name: 'GHG Emissions',
            category: 'carbon',
            lastUpdated: '2023-08-05',
            status: 'active',
            format: 'excel',
            recordCount: 1520
          },
          {
            id: '4',
            name: 'Supplier Data',
            category: 'supply-chain',
            lastUpdated: '2023-07-28',
            status: 'needs-update',
            format: 'csv',
            recordCount: 342
          },
          {
            id: '5',
            name: 'Waste Management',
            category: 'environmental',
            lastUpdated: '2023-07-25',
            status: 'active',
            format: 'excel',
            recordCount: 765
          },
          {
            id: '6',
            name: 'Employee Demographics',
            category: 'social',
            lastUpdated: '2023-07-20',
            status: 'active',
            format: 'excel',
            recordCount: 412
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching data sources:', error);
      toast.error('Failed to load data sources');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataSources();
  }, [isAuthenticated, user]);

  return { dataSources, setDataSources, isLoading, fetchDataSources };
};
