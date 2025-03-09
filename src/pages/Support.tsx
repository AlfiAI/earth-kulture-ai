
import { HelpCircle, MessageSquare, Mail, Phone, FileText, ExternalLink } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Support = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    toast.success("Support request submitted successfully!");
    setSubject("");
    setMessage("");
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Support Center</h1>
          <Button variant="outline" className="gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden md:inline">Contact Sales</span>
          </Button>
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-muted border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1">How can we help you?</h2>
                <p className="text-muted-foreground mb-3">
                  Our support team is here to help you with any questions or issues
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="contact">
          <TabsList className="mb-4">
            <TabsTrigger value="contact">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Support
            </TabsTrigger>
            <TabsTrigger value="faq">
              <FileText className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="resources">
              <ExternalLink className="h-4 w-4 mr-2" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Request</CardTitle>
                <CardDescription>Our team typically responds within 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input 
                      id="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <Input 
                      id="subject" 
                      placeholder="Brief description of your issue" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <Textarea 
                      id="message" 
                      placeholder="Please provide details about your question or issue" 
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full sm:w-auto">Submit Request</Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <Mail className="h-5 w-5 mr-2" />
                    Email Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    For non-urgent inquiries, email us at support@esgplatform.com
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <Phone className="h-5 w-5 mr-2" />
                    Phone Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    For urgent matters, call us at +1 (888) ESG-HELP
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Live Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Chat with a support representative during business hours
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">Start Chat</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      question: "How do I import my ESG data?",
                      answer: "You can import data through CSV uploads, direct API connections, or manual entry. Navigate to the Data Management section to get started."
                    },
                    {
                      question: "Can I customize the reports?",
                      answer: "Yes, all reports are fully customizable. You can select metrics, date ranges, and comparison benchmarks to meet your specific needs."
                    },
                    {
                      question: "How secure is my data?",
                      answer: "We use industry-leading encryption and security protocols. Your data is stored securely and we comply with all relevant data protection regulations."
                    },
                    {
                      question: "How often should I update my ESG metrics?",
                      answer: "For optimal results, we recommend monthly updates for most metrics, with quarterly comprehensive reviews."
                    },
                    {
                      question: "Can I share reports with external stakeholders?",
                      answer: "Yes, reports can be exported in various formats or shared via secure links with customizable permission levels."
                    }
                  ].map((item, index) => (
                    <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                      <h3 className="font-medium mb-2">{item.question}</h3>
                      <p className="text-sm text-muted-foreground">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Support Resources</CardTitle>
                <CardDescription>Helpful guides and materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "User Guides",
                      description: "Step-by-step instructions for all platform features",
                      link: "/documentation"
                    },
                    {
                      title: "Video Tutorials",
                      description: "Watch demonstrations of key workflows",
                      link: "#"
                    },
                    {
                      title: "API Documentation",
                      description: "Technical guides for developers",
                      link: "/documentation?tab=technical"
                    },
                    {
                      title: "Knowledge Base",
                      description: "Search through our extensive support articles",
                      link: "#"
                    }
                  ].map((item, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" asChild>
                          <a href={item.link}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Access Resource
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Support;
