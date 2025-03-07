
import { Search, ShieldCheck, Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface ValidationFormProps {
  isValidating: boolean;
  progress: number;
  onValidate: () => void;
}

const ValidationForm = ({ isValidating, progress, onValidate }: ValidationFormProps) => {
  return (
    <div className="border rounded-lg p-6 text-center">
      <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-medium mb-2">Automated Data Validation</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        Our AI will scan your ESG data to identify inconsistencies, 
        missing values, and potential compliance issues.
      </p>
      
      {isValidating && (
        <div className="mb-4 space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Validating data... {progress}%
          </p>
        </div>
      )}
      
      <Button 
        onClick={onValidate} 
        disabled={isValidating}
        className="min-w-32"
      >
        {isValidating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Validating...
          </>
        ) : (
          <>
            <ShieldCheck className="h-4 w-4 mr-2" />
            Validate ESG Data
          </>
        )}
      </Button>
    </div>
  );
};

export default ValidationForm;
