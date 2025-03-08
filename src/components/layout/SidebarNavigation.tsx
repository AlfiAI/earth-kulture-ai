
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

interface SidebarNavigationProps {
  open: boolean;
  onToggle: () => void;
}

const SidebarNavigation = ({ open, onToggle }: SidebarNavigationProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const expanded = open;

  return (
    <div className="px-3 py-2">
      <div className="space-y-1">
        <NavItem 
          to="/" 
          active={isActive('/')} 
          icon={<BarChart className="h-4 w-4" />}
          label="Dashboard"
          expanded={expanded}
        />
        
        <NavItem 
          to="/analytics" 
          active={isActive('/analytics')} 
          icon={<LineChart className="h-4 w-4" />}
          label="Analytics"
          expanded={expanded}
        />
        
        <NavItem 
          to="/data" 
          active={isActive('/data')} 
          icon={<Database className="h-4 w-4" />}
          label="Data"
          expanded={expanded}
        />
        
        <NavItem 
          to="/ai-insights" 
          active={isActive('/ai-insights')} 
          icon={<Lightbulb className="h-4 w-4" />}
          label="AI Insights"
          expanded={expanded}
        />
        
        <NavItem 
          to="/reports" 
          active={isActive('/reports')} 
          icon={<FileText className="h-4 w-4" />}
          label="Reports"
          expanded={expanded}
        />
        
        <NavItem 
          to="/goals" 
          active={isActive('/goals')} 
          icon={<GanttChart className="h-4 w-4" />}
          label="Goals"
          expanded={expanded}
        />
        
        <NavItem 
          to="/compliance" 
          active={isActive('/compliance')} 
          icon={<AlertTriangle className="h-4 w-4" />}
          label="Compliance"
          expanded={expanded}
        />
        
        <NavItem 
          to="/external-data" 
          active={isActive('/external-data')} 
          icon={<ExternalLink className="h-4 w-4" />}
          label="External Data"
          expanded={expanded}
        />
      </div>

      <div className="pt-6">
        <NavItem 
          to="/settings" 
          active={isActive('/settings')} 
          icon={<Settings className="h-4 w-4" />}
          label="Settings"
          expanded={expanded}
        />
      </div>
    </div>
  );
};

export default SidebarNavigation;
