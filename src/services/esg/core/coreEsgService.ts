
import { ESGDataPoint } from '../../types/esgTypes';
import { esgDataCoreService } from '../../core/esgDataService';

class CoreEsgService {
  // Core ESG Data Methods
  getAllESGData(): Promise<ESGDataPoint[]> {
    return esgDataCoreService.getAllESGData();
  }

  processESGData(data: Partial<ESGDataPoint>): Promise<ESGDataPoint> {
    return esgDataCoreService.processESGData(data);
  }
}

export const coreEsgService = new CoreEsgService();
