
import { Shield, CheckCircle, Clock, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ComplianceAlert, ResolutionStep, complianceAlertService } from "@/services/compliance/alertService";

interface ComplianceAlertCardProps {
  alert: ComplianceAlert;
  onStatusChange: () => void;
}

const ComplianceAlertCard = ({ alert, onStatusChange }: ComplianceAlertCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [resolutionSteps, setResolutionSteps] = useState<ResolutionStep[]>(
    alert.resolutionSteps || []
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusColor = (status: 'active' | 'resolved' | 'ignored') => {
    switch (status) {
      case 'active': return 'bg-red-50 text-red-700 border-red-300';
      case 'resolved': return 'bg-green-50 text-green-700 border-green-300';
      case 'ignored': return 'bg-gray-50 text-gray-700 border-gray-300';
    }
  };

  const handleResolve = async () => {
    setIsUpdating(true);
    const success = await complianceAlertService.updateAlertStatus(alert.id, 'resolved');
    if (success) {
      onStatusChange();
    }
    setIsUpdating(false);
  };

  const handleIgnore = async () => {
    setIsUpdating(true);
    const success = await complianceAlertService.updateAlertStatus(alert.id, 'ignored');
    if (success) {
      onStatusChange();
    }
    setIsUpdating(false);
  };

  const handleStepChange = async (index: number, completed: boolean) => {
    const updatedSteps = [...resolutionSteps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      completed
    };
    
    setResolutionSteps(updatedSteps);
    
    await complianceAlertService.updateResolutionSteps(alert.id, updatedSteps);
    
    // If all steps are completed, ask if the user wants to mark the alert as resolved
    const allCompleted = updatedSteps.every(step => step.completed);
    if (allCompleted) {
      const shouldResolve = window.confirm('All steps completed. Mark alert as resolved?');
      if (shouldResolve) {
        handleResolve();
      }
    }
  };

  return (
    <Card className={`border-l-4 ${getStatusColor(alert.status)}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <Shield className="h-5 w-5 mt-0.5 text-primary" />
            <div>
              <CardTitle className="text-base">{alert.message}</CardTitle>
              <div className="flex gap-2 mt-1 text-xs">
                <span className={`px-2 py-0.5 rounded-full ${getSeverityColor(alert.severity)}`}>
                  {alert.severity} severity
                </span>
                {alert.framework && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {alert.framework}
                  </span>
                )}
                <span className="text-muted-foreground">
                  Detected: {formatDate(alert.createdAt)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            {alert.status === 'resolved' && (
              <div className="flex items-center text-xs text-green-600 mr-2">
                <CheckCircle className="h-3 w-3 mr-1" />
                <span>Resolved</span>
              </div>
            )}
            {alert.status === 'ignored' && (
              <div className="flex items-center text-xs text-muted-foreground mr-2">
                <X className="h-3 w-3 mr-1" />
                <span>Ignored</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {resolutionSteps.length > 0 && (
          <div className="mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-auto mb-2 text-sm font-medium"
              onClick={() => setShowSteps(!showSteps)}
            >
              <span>Resolution Steps</span>
              {showSteps ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              )}
            </Button>
            
            {showSteps && (
              <div className="space-y-2 mt-2">
                {resolutionSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-2 bg-muted/40 p-2 rounded-md">
                    <Checkbox 
                      id={`step-${alert.id}-${index}`}
                      checked={step.completed}
                      onCheckedChange={(checked) => handleStepChange(index, Boolean(checked))}
                      disabled={alert.status !== 'active'}
                    />
                    <div className="space-y-1">
                      <label 
                        htmlFor={`step-${alert.id}-${index}`}
                        className={`text-sm font-medium ${step.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {step.step}
                      </label>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {alert.status === 'active' && (
        <CardFooter className="pt-0 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleIgnore}
            disabled={isUpdating}
          >
            Ignore
          </Button>
          <Button
            size="sm"
            onClick={handleResolve}
            disabled={isUpdating}
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Mark Resolved
          </Button>
        </CardFooter>
      )}
      
      {alert.status === 'resolved' && alert.resolvedAt && (
        <CardFooter className="pt-0">
          <div className="text-xs text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Resolved on {formatDate(alert.resolvedAt)}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ComplianceAlertCard;
