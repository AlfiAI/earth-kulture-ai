
// Update the existing AlertTypes file to add the message field

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertType = 'compliance' | 'performance' | 'forecast' | 'regulatory' | 'news';

export interface ESGAlert {
  id: string;
  title: string;
  type: AlertType;
  severity: AlertSeverity;
  timestamp: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  message?: string; // Add this optional field
  // Additional fields needed by alertService
  userId?: string;
  description?: string;
  category?: string;
  source?: string;
  relatedData?: any;
  recommendedActions?: string[];
  createdAt?: Date;
}

// Add the database representation type
export interface ESGAlertDB {
  id: string;
  user_id: string;
  message: string;
  alert_type: string;
  severity: string;
  compliance_framework?: string;
  status: string;
  created_at: string;
  source_data?: any;
  resolution_steps?: any;
}
