
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
import { ArrowLeft, ArrowRight, CheckCircle, User } from 'lucide-react';

const onboardingSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  company: z.string().optional(),
  role: z.string().optional(),
  industry: z.string().optional(),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      full_name: userProfile?.full_name || '',
      company: '',
      role: '',
      industry: '',
    },
  });

  if (!user) {
    navigate('/auth');
    return null;
  }

  const onSubmit = async (values: OnboardingFormValues) => {
    setIsSubmitting(true);
    
    try {
      await profileService.updateUserProfile(user.id, {
        id: user.id,
        full_name: values.full_name,
        company: values.company,
        role: values.role,
        industry: values.industry,
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
    if (step < 3) {
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
          <p className="text-muted-foreground">Let's set up your profile to get started</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((stepNumber) => (
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
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 ? 'Personal Information' : 
                 step === 2 ? 'Company Details' :
                 'Preferences'}
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
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your company name" 
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
                                <SelectItem value="sustainability_manager">Sustainability Manager</SelectItem>
                                <SelectItem value="esg_director">ESG Director</SelectItem>
                                <SelectItem value="operations_manager">Operations Manager</SelectItem>
                                <SelectItem value="consultant">Sustainability Consultant</SelectItem>
                                <SelectItem value="researcher">Environmental Researcher</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
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
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="retail">Retail</SelectItem>
                                <SelectItem value="energy">Energy</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="government">Government</SelectItem>
                                <SelectItem value="nonprofit">Non-Profit</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
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
                    
                    {step < 3 ? (
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
