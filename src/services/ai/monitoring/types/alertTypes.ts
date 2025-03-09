
import { Json } from "@/integrations/supabase/types";

// Alert severity levels
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

// Alert types
export type AlertType = 'compliance' | 'risk' | 'opportunity' | 'trend' | 'recommendation';

// Alert interface
export interface ESGAlert {
  id?: string;
  userId: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  type: AlertType;
  source: string;
  category: string;
  createdAt: Date;
  isRead: boolean;
  relatedData?: any;
  recommendedActions?: string[];
}

// Database interface for the alerts table
// Make sure this matches the exact structure from the database
export interface ESGAlertDB {
  id: string;
  user_id: string;
  message: string;
  severity: string; // String in DB, cast to AlertSeverity in app
  alert_type: string; // String in DB, cast to AlertType in app
  compliance_framework?: string;
  source_data?: Json;
  created_at: string;
  status: string;
  resolution_steps?: string[] | Json;
  resolved_at?: string;
}
