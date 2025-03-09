
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

type StatusIconProps = {
  status: string;
};

const StatusIcon = ({ status }: StatusIconProps) => {
  switch (status) {
    case 'Compliant':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'In Progress':
      return <Clock className="h-5 w-5 text-blue-600" />;
    case 'Attention Needed':
      return <AlertTriangle className="h-5 w-5 text-amber-600" />;
    default:
      return null;
  }
};

export default StatusIcon;
