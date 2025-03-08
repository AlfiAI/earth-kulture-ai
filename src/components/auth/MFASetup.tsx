
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shield, CheckCircle, XCircle, LucideLoader } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { motion } from "framer-motion";

const verificationSchema = z.object({
  token: z.string().min(6, "Token must be at least 6 digits").max(6, "Token cannot exceed 6 digits")
});

type MFASetupProps = {
  onComplete: () => void;
};

const MFASetup = ({ onComplete }: MFASetupProps) => {
  const { setupMFA, verifyMFA } = useAuth();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  const form = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      token: '',
    },
  });

  const initializeSetup = async () => {
    setLoading(true);
    const result = await setupMFA();
    if (result) {
      setQrCode(result.qr);
      setSecret(result.secret);
    }
    setLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof verificationSchema>) => {
    setVerifying(true);
    const success = await verifyMFA(values.token);
    if (success) {
      setSetupComplete(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
    setVerifying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="text-primary h-5 w-5" />
            Multi-Factor Authentication
          </CardTitle>
          <CardDescription>
            Enhance your account security by enabling MFA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!qrCode && !setupComplete && (
            <div className="text-center py-6">
              <p className="mb-4 text-sm text-muted-foreground">
                Multi-factor authentication adds an extra layer of security to your account by requiring a verification code in addition to your password.
              </p>
              <Button 
                onClick={initializeSetup} 
                disabled={loading} 
                className="w-full"
              >
                {loading ? (
                  <>
                    <LucideLoader className="mr-2 h-4 w-4 animate-spin" />
                    Setting up MFA...
                  </>
                ) : (
                  'Set up MFA'
                )}
              </Button>
            </div>
          )}

          {qrCode && !setupComplete && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-sm text-center">
                  Scan this QR code with your authenticator app (like Google Authenticator, Authy, or similar).
                </p>
                <div className="bg-white p-2 rounded-md">
                  <img src={qrCode} alt="QR Code for MFA setup" className="w-48 h-48" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Or enter this code manually:</p>
                  <code className="bg-muted p-2 rounded text-xs font-mono">
                    {secret}
                  </code>
                </div>
              </div>
              
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
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the 6-digit code from your authenticator app
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={verifying}
                  >
                    {verifying ? (
                      <>
                        <LucideLoader className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify and Enable MFA'
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          )}

          {setupComplete && (
            <div className="py-8 text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-lg font-medium">MFA Setup Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Your account is now protected with multi-factor authentication.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MFASetup;
