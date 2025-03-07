
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  role: z.string().optional(),
});

const notificationFormSchema = z.object({
  reportReady: z.boolean().default(true),
  complianceAlerts: z.boolean().default(true),
  dataUpdates: z.boolean().default(false),
  weeklyInsights: z.boolean().default(true),
  marketUpdates: z.boolean().default(false),
});

const Settings = () => {
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Admin User",
      email: "admin@earthkulture.ai",
      company: "Earth Kulture AI",
      role: "Administrator",
    },
  });

  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      reportReady: true,
      complianceAlerts: true,
      dataUpdates: false,
      weeklyInsights: true,
      marketUpdates: false,
    },
  });

  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    toast.success("Profile updated successfully!");
    console.log(values);
  }

  function onNotificationSubmit(values: z.infer<typeof notificationFormSchema>) {
    toast.success("Notification preferences updated successfully!");
    console.log(values);
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and notification settings.
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your personal and company information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Your company" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input placeholder="Your role" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormLabel>Date of Birth</FormLabel>
                    <DatePicker date={dateOfBirth} setDate={setDateOfBirth} />
                  </div>
                  <Button type="submit">Update Profile</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose which notifications you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={notificationForm.control}
                      name="reportReady"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Report Ready Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications when your scheduled reports are ready.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="complianceAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Compliance Alerts</FormLabel>
                            <FormDescription>
                              Get notified about compliance changes and upcoming deadlines.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="dataUpdates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Data Updates</FormLabel>
                            <FormDescription>
                              Receive notifications about data updates and validation results.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="weeklyInsights"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Weekly Insights</FormLabel>
                            <FormDescription>
                              Get a weekly digest of AI-generated insights about your ESG performance.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="marketUpdates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Market & Industry Updates</FormLabel>
                            <FormDescription>
                              Receive updates about ESG trends, regulations, and industry benchmarks.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit">Save Preferences</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage API keys for integrating with external systems.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Your API Keys</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use these keys to authenticate API requests from external systems.
                  </p>
                  <div className="rounded-md border">
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <div className="font-medium">Main API Key</div>
                        <div className="text-sm text-muted-foreground">
                          Created on: August 10, 2023
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => toast.info("Feature not implemented in demo")}>
                          Reveal
                        </Button>
                        <Button variant="outline" onClick={() => toast.info("Feature not implemented in demo")}>
                          Regenerate
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <div className="font-medium">Development API Key</div>
                        <div className="text-sm text-muted-foreground">
                          Created on: September 5, 2023
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => toast.info("Feature not implemented in demo")}>
                          Reveal
                        </Button>
                        <Button variant="outline" onClick={() => toast.info("Feature not implemented in demo")}>
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Create New API Key</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate a new API key with specific permissions.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Key Name</FormLabel>
                      <Input placeholder="e.g., Production Key" />
                    </div>
                    <div>
                      <FormLabel>Permissions</FormLabel>
                      <div className="grid gap-2 mt-2">
                        <div className="flex items-center gap-2">
                          <Checkbox id="read" />
                          <label htmlFor="read" className="text-sm">Read (GET endpoints)</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="write" />
                          <label htmlFor="write" className="text-sm">Write (POST, PUT, PATCH endpoints)</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="delete" />
                          <label htmlFor="delete" className="text-sm">Delete (DELETE endpoints)</label>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => toast.success("New API key generated successfully!")}>
                      Generate Key
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
