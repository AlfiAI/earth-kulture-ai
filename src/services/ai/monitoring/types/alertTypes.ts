
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
}
