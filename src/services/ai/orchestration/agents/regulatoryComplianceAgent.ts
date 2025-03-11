import { deepseekR1Service } from '@/services/ai/deepseekR1Service';

export interface ComplianceResult {
  isCompliant: boolean;
  details: string;
}

export interface RegulatoryComplianceAgent {
  analyzeCompliance(data: any, regulations: string[]): Promise<ComplianceResult>;
}

class RegulatoryComplianceAgentImpl implements RegulatoryComplianceAgent {
  async analyzeCompliance(data: any, regulations: string[]): Promise<ComplianceResult> {
    try {
      // Analyze compliance using AI
      const complianceAnalysis = await deepseekR1Service.processQuery(
        `Analyze the compliance of the following data: ${JSON.stringify(data)}. Regulations: ${JSON.stringify(regulations)}`,
        []  // Empty conversation context
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
