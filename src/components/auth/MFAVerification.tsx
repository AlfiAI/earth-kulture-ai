
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { motion } from "framer-motion";

const mfaSchema = z.object({
  token: z.string().min(6, "Token must be at least 6 digits").max(6, "Token cannot exceed 6 digits")
});

type MFAVerificationProps = {
  onBack: () => void;
  factorId?: string;
};

const MFAVerification = ({ onBack, factorId }: MFAVerificationProps) => {
  const { verifyMFA } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof mfaSchema>>({
    resolver: zodResolver(mfaSchema),
    defaultValues: {
      token: '',
    },
  });
  
  const onSubmit = async (values: z.infer<typeof mfaSchema>) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const success = await verifyMFA(values.token);
      
      if (!success) {
        setError("Invalid verification code. Please try again.");
        form.reset();
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify MFA token");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Two-Factor Verification</h2>
        <p className="text-sm text-muted-foreground">
          Enter the verification code from your authenticator app
        </p>
      </div>
      
      {error && (
        <div className="px-3 py-2 rounded-md text-sm bg-destructive/15 text-destructive">
          {error}
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter 6-digit code" 
                    {...field} 
                    maxLength={6}
                    className="text-center tracking-widest font-mono text-lg"
                    autoComplete="one-time-code"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col gap-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onBack}
              disabled={isSubmitting}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default MFAVerification;
