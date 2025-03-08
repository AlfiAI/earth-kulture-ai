
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Check } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import MFASetup from "@/components/auth/MFASetup";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";

const MFASettings = () => {
  const { userProfile, disableMFA } = useAuth();
  const [showSetup, setShowSetup] = useState(false);
  const [disabling, setDisabling] = useState(false);
  
  const handleDisableMFA = async () => {
    setDisabling(true);
    await disableMFA();
    setDisabling(false);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Multi-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showSetup ? (
            <MFASetup onComplete={() => setShowSetup(false)} />
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${userProfile?.mfa_enabled ? 'bg-green-100' : 'bg-amber-100'}`}>
                  {userProfile?.mfa_enabled ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium">
                    {userProfile?.mfa_enabled ? 'MFA is enabled' : 'MFA is not enabled'}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {userProfile?.mfa_enabled 
                      ? 'Your account is protected with multi-factor authentication.' 
                      : 'Enable multi-factor authentication to add an extra layer of security to your account.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {userProfile?.mfa_enabled ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Disable MFA</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Disabling multi-factor authentication will reduce the security of your account. Are you sure you want to continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDisableMFA}
                    disabled={disabling}
                  >
                    {disabling ? 'Disabling...' : 'Disable MFA'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button 
              onClick={() => setShowSetup(true)}
              disabled={showSetup}
            >
              Setup MFA
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MFASettings;
