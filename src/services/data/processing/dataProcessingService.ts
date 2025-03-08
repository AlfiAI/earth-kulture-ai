
import { ESGDataPoint } from '../../types/esgTypes';
import { toast } from "sonner";

export class DataProcessingService {
  // Process a data point using mock service
  async processMockData(dataPoint: Partial<ESGDataPoint>): Promise<ESGDataPoint> {
    try {
      const { esgDataCoreService } = await import('../../core/esgDataService');
      return await esgDataCoreService.processESGData(dataPoint);
    } catch (error) {
      console.error("Error processing mock data:", error);
      toast.error("Failed to process mock data");
      throw error;
    }
  }
}

export const dataProcessingService = new DataProcessingService();
