
import { deepseekR1Service } from '@/services/ai/deepseekR1Service';

export interface ComplianceResult {
  isCompliant: boolean;
  details: string;
}

export interface RegulatoryComplianceAgent {
  analyzeCompliance(data: any, regulations: string[]): Promise<ComplianceResult>;
  processWithLocalAI?(payload: any): Promise<any>;
  processWithCloudAI?(payload: any): Promise<any>;
}

class RegulatoryComplianceAgentImpl implements RegulatoryComplianceAgent {
  // Required by orchestrator
  async processWithLocalAI(payload: any): Promise<any> {
    if (payload.data && payload.regulations) {
      return this.analyzeCompliance(payload.data, payload.regulations);
    }
    return { isCompliant: false, details: "Invalid payload for local AI processing" };
  }

  // Required by orchestrator
  async processWithCloudAI(payload: any): Promise<any> {
    if (payload.data && payload.regulations) {
      return this.analyzeCompliance(payload.data, payload.regulations);
    }
    return { isCompliant: false, details: "Invalid payload for cloud AI processing" };
  }

  async analyzeCompliance(data: any, regulations: string[]): Promise<ComplianceResult> {
    try {
      // Analyze compliance using AI
      const complianceAnalysis = await deepseekR1Service.processQuery(
        `Analyze the compliance of the following data: ${JSON.stringify(data)}. Regulations: ${JSON.stringify(regulations)}`
      );
      
      // Interpret the AI's analysis
      const isCompliant = complianceAnalysis.toLowerCase().includes("compliant");
      const details = complianceAnalysis;

      return {
        isCompliant,
        details,
      };
    } catch (error) {
      console.error("Error in regulatory compliance agent:", error);
      throw error;
    }
  }
}

export const regulatoryComplianceAgent: RegulatoryComplianceAgent = new RegulatoryComplianceAgentImpl();
