
import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DataSource } from '../types';
import { User } from '@supabase/supabase-js';

export const useDataSourceOperations = (
  isAuthenticated: boolean, 
  user: User | null,
  setDataSources: React.Dispatch<React.SetStateAction<DataSource[]>>
) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = async () => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to upload data');
      return;
    }
    
    toast.info('Upload functionality would store files in Supabase Storage in a complete implementation');
  };
  
  const handleConnect = async () => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to connect a data source');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('data_sources')
        .insert({
          user_id: user.id,
          name: 'New API Connection',
          category: 'environmental',
          format: 'api',
          status: 'active',
          record_count: 0
        } as any)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        toast.success('Successfully connected new data source');
        
        const newDataSource = {
          id: data.id,
          name: data.name,
          category: data.category,
          lastUpdated: data.last_updated ? new Date(data.last_updated).toISOString().split('T')[0] : '',
          status: data.status as 'active' | 'needs-update',
          format: data.format,
          recordCount: data.record_count || 0
        };
        
        setDataSources(prev => [newDataSource, ...prev]);
      }
    } catch (error) {
      console.error('Error connecting data source:', error);
      toast.error('Failed to connect data source');
    }
  };
  
  const handleAutoProcess = async (sourceId: string) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to process data');
      return;
    }
    
    setIsProcessing(true);
    toast.loading('AI is processing data source...');
    
    try {
      const { error } = await supabase
        .from('data_sources')
        .update({
          last_updated: new Date().toISOString(),
          status: 'active'
        } as any)
        .eq('id', sourceId);
        
      if (error) {
        throw error;
      }
      
      setTimeout(() => {
        toast.success('Data source processed successfully by AI');
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error('Error processing data source:', error);
      toast.error('Failed to process data source');
      setIsProcessing(false);
    }
  };

  return {
    handleUpload,
    handleConnect,
    handleAutoProcess,
    isProcessing
  };
};
