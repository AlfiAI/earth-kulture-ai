
import { Component, ErrorInfo, ReactNode } from "react";
import { useNavigate, useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | null;
}

// Used as errorElement in route definitions
export function RouteErrorDisplay() {
  const error = useRouteError();
  const navigate = useNavigate();
  
  const errorMessage = isRouteErrorResponse(error)
    ? `${error.status} - ${error.statusText}`
    : error instanceof Error
    ? error.message
    : "Unknown error occurred";
    
  const errorDetails = isRouteErrorResponse(error)
    ? error.data?.message
    : error instanceof Error
    ? error.stack
    : JSON.stringify(error);
    
  return (
    <ErrorDisplay 
      message={errorMessage} 
      details={errorDetails} 
      onReset={() => navigate(0)} 
      onHome={() => navigate("/")} 
    />
  );
}

// Standalone error display component
export function ErrorDisplay({ 
  message, 
  details, 
  onReset, 
  onHome 
}: { 
  message: string; 
  details?: string;
  onReset?: () => void;
  onHome?: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-5 flex flex-col items-center">
          <div className="bg-red-50 p-3 rounded-full mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-red-700 mb-2">Something went wrong</h1>
          <p className="text-gray-600 text-center mb-6">{message}</p>
          
          {details && import.meta.env.DEV && (
            <div className="w-full bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40 mb-6">
              <pre>{details}</pre>
            </div>
          )}
          
          <div className="flex gap-4">
            {onReset && (
              <Button onClick={onReset} variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" /> Try Again
              </Button>
            )}
            {onHome && (
              <Button onClick={onHome} className="flex items-center gap-2 bg-primary">
                <Home className="h-4 w-4" /> Go Home
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Class component error boundary for catching errors in children
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to monitoring service
    console.error("Error caught by boundary:", error, errorInfo);
    
    // Could send to error monitoring service here
    // captureException(error, { errorInfo });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorDisplay 
          message={this.state.error?.message || "An unexpected error occurred"} 
          details={this.state.error?.stack}
          onReset={() => this.setState({ hasError: false, error: null })} 
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
