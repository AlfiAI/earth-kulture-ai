
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { carbonService } from "@/services/carbon/carbonService";
import { complianceService } from "@/services/compliance/complianceService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const ConnectionTester = () => {
  const [carbonStatus, setCarbonStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [complianceStatus, setComplianceStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [authStatus, setAuthStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const { isAuthenticated } = useAuth();

  const testAllConnections = async () => {
    setIsTesting(true);
    setCarbonStatus(null);
    setComplianceStatus(null);
    setAuthStatus(null);
    
    try {
      // Test auth connection
      const { data: session, error: authError } = await supabase.auth.getSession();
      setAuthStatus({
        success: !authError,
        message: authError 
          ? `Auth error: ${authError.message}` 
          : `Auth connection successful. Session: ${session.session ? 'Active' : 'None'}`
      });
      
      // Test carbon service
      const carbonResult = await carbonService.testConnection();
      setCarbonStatus(carbonResult);
      
      // Test compliance service
      const complianceResult = await complianceService.testConnection();
      setComplianceStatus(complianceResult);
    } catch (error) {
      console.error("Test connection error:", error);
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    // Automatically run tests when component mounts
    testAllConnections();
  }, []);

  const renderStatus = (status: { success: boolean; message: string } | null) => {
    if (!status) return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
    
    return (
      <div className="flex items-center gap-2">
        {status.success ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-500" />
        )}
        <span className={status.success ? "text-green-700" : "text-red-700"}>
          {status.message}
        </span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Connection Tester</CardTitle>
        <CardDescription>Test connections to Supabase tables and services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isAuthenticated && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Warning</AlertTitle>
            <AlertDescription>
              You are not authenticated. Some tests may fail due to missing authentication.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="font-medium">Authentication Status:</span>
            {renderStatus(authStatus)}
          </div>
          
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="font-medium">Carbon Emissions Table:</span>
            {renderStatus(carbonStatus)}
          </div>
          
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="font-medium">Compliance Frameworks Table:</span>
            {renderStatus(complianceStatus)}
          </div>
        </div>
        
        <Button 
          className="w-full mt-4" 
          onClick={testAllConnections}
          disabled={isTesting}
        >
          {isTesting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connections...
            </>
          ) : (
            'Test All Connections'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConnectionTester;
