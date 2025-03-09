
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { profileService } from '@/services/profiles/profileService';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ArrowRight, CheckCircle, User, Building, BarChart } from 'lucide-react';
import { IndustryType, UserRoleType } from '@/services/ai/orchestration/types/agentTypes';

const onboardingSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  company: z.string().optional(),
  role: z.string().optional(),
  industry: z.string().optional(),
  dashboard_preference: z.enum(['individual', 'business', 'enterprise']).optional(),
  data_visualization_preference: z.enum(['detailed', 'summary', 'visual']).optional(),
  report_frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly']).optional(),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, userProfile, updateUserProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      full_name: userProfile?.full_name || '',
      company: userProfile?.company || '',
      role: userProfile?.role || '',
      industry: userProfile?.industry || '',
      dashboard_preference: userProfile?.dashboard_preference || 'business',
      data_visualization_preference: userProfile?.data_visualization_preference || 'visual',
      report_frequency: userProfile?.report_frequency || 'weekly',
    },
  });

  if (!user) {
    navigate('/auth');
    return null;
  }

  const onSubmit = async (values: OnboardingFormValues) => {
    setIsSubmitting(true);
    
    try {
      await updateUserProfile({
        id: user?.id,
        full_name: values.full_name,
        company: values.company,
        role: values.role as UserRoleType,
        industry: values.industry as IndustryType,
        dashboard_preference: values.dashboard_preference,
        data_visualization_preference: values.data_visualization_preference,
        report_frequency: values.report_frequency,
      });
      
      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const skipOnboarding = () => {
    toast.info('Onboarding skipped. You can complete your profile later in Settings.');
    navigate('/dashboard');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 18, stiffness: 60 }
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome to Earth Kulture</h1>
          <p className="text-muted-foreground">Let's customize your experience based on your needs</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div 
                  key={stepNumber}
                  className={`flex items-center justify-center ${stepNumber <= step ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  <div 
                    className={`h-8 w-8 rounded-full border ${stepNumber <= step ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'} flex items-center justify-center text-sm font-medium`}
                  >
                    {stepNumber < step ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                  </div>
                </div>
              ))}
            </div>
            <div className="relative h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-primary transition-all duration-300 ease-in-out" 
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 ? 'Personal Information' : 
                 step === 2 ? 'Company & Role' :
                 step === 3 ? 'Industry Selection' : 
                 'Dashboard Preferences'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your full name" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your organization name" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="admin">Administrator</SelectItem>
                                <SelectItem value="manager">Sustainability Manager</SelectItem>
                                <SelectItem value="analyst">ESG Analyst</SelectItem>
                                <SelectItem value="viewer">Report Viewer</SelectItem>
                                <SelectItem value="individual">Individual User</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="financial">Financial Services</SelectItem>
                                <SelectItem value="energy">Energy</SelectItem>
                                <SelectItem value="retail">Retail</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="government">Government</SelectItem>
                                <SelectItem value="corporate">Large Enterprise</SelectItem>
                                <SelectItem value="sme">Small/Medium Business</SelectItem>
                                <SelectItem value="individual">Personal Use</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                        <p>Your industry selection helps us tailor AI insights, recommended frameworks, and benchmarking comparisons specifically to your sector.</p>
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="dashboard_preference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dashboard Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select dashboard type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="individual">
                                  Individual (Personal sustainability tracking)
                                </SelectItem>
                                <SelectItem value="business">
                                  Business (Department-level insights)
                                </SelectItem>
                                <SelectItem value="enterprise">
                                  Enterprise (Organization-wide compliance & analysis)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="data_visualization_preference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data Visualization Style</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select visualization preference" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="detailed">
                                  Detailed (In-depth tables and specific numbers)
                                </SelectItem>
                                <SelectItem value="summary">
                                  Summary (Key metrics and highlights)
                                </SelectItem>
                                <SelectItem value="visual">
                                  Visual (Graphs and visual representations)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="report_frequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Report Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select report frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  <div className="flex justify-between pt-4">
                    {step > 1 ? (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={prevStep}
                        disabled={isSubmitting}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                    ) : (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={skipOnboarding}
                        disabled={isSubmitting}
                      >
                        Skip
                      </Button>
                    )}
                    
                    {step < 4 ? (
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        disabled={step === 1 && !form.getValues().full_name}
                      >
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : 'Complete Setup'}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
