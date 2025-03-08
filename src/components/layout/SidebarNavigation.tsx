
import { useLocation } from 'react-router-dom';
import NavItem from './NavItem';
import { 
  BarChart, 
  LineChart, 
  FileText, 
  Settings, 
  Database,
  GanttChart,
  ExternalLink,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

const SidebarNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="px-3 py-2">
      <div className="space-y-1">
        <NavItem 
          href="/" 
          active={isActive('/')} 
          icon={<BarChart className="h-4 w-4" />}
        >
          Dashboard
        </NavItem>
        
        <NavItem 
          href="/analytics" 
          active={isActive('/analytics')} 
          icon={<LineChart className="h-4 w-4" />}
        >
          Analytics
        </NavItem>
        
        <NavItem 
          href="/data" 
          active={isActive('/data')} 
          icon={<Database className="h-4 w-4" />}
        >
          Data
        </NavItem>
        
        <NavItem 
          href="/ai-insights" 
          active={isActive('/ai-insights')} 
          icon={<Lightbulb className="h-4 w-4" />}
        >
          AI Insights
        </NavItem>
        
        <NavItem 
          href="/reports" 
          active={isActive('/reports')} 
          icon={<FileText className="h-4 w-4" />}
        >
          Reports
        </NavItem>
        
        <NavItem 
          href="/goals" 
          active={isActive('/goals')} 
          icon={<GanttChart className="h-4 w-4" />}
        >
          Goals
        </NavItem>
        
        <NavItem 
          href="/compliance" 
          active={isActive('/compliance')} 
          icon={<AlertTriangle className="h-4 w-4" />}
        >
          Compliance
        </NavItem>
        
        <NavItem 
          href="/external-data" 
          active={isActive('/external-data')} 
          icon={<ExternalLink className="h-4 w-4" />}
        >
          External Data
        </NavItem>
      </div>

      <div className="pt-6">
        <NavItem 
          href="/settings" 
          active={isActive('/settings')} 
          icon={<Settings className="h-4 w-4" />}
        >
          Settings
        </NavItem>
      </div>
    </div>
  );
};

export default SidebarNavigation;
