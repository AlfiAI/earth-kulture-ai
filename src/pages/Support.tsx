
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, MessageSquare, FileText, Phone } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Support = () => {
  return (
    <DashboardLayout>
      <div className="px-3 py-4 md:p-6 max-w-7xl mx-auto pb-24 overflow-x-hidden">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Support Center</h1>
        
        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="mb-4 w-full overflow-x-auto flex whitespace-nowrap pb-1">
            <TabsTrigger value="faq" className="flex-shrink-0">
              <HelpCircle className="h-4 w-4 mr-2" />
              <span>FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex-shrink-0">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>Contact</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex-shrink-0">
              <FileText className="h-4 w-4 mr-2" />
              <span>Guides</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Frequently Asked Questions</CardTitle>
                <CardDescription>Common questions and answers about our platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-sm md:text-base">How do I import my existing ESG data?</AccordionTrigger>
                    <AccordionContent className="text-sm">
                      You can import existing data through our Data Management section. 
                      We support CSV, Excel, and direct API integrations from common ESG reporting platforms.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-sm md:text-base">What compliance frameworks do you support?</AccordionTrigger>
                    <AccordionContent className="text-sm">
                      We support all major ESG reporting frameworks including GRI, SASB, TCFD, and regional 
                      regulations such as EU CSRD and SEC climate disclosure rules.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-sm md:text-base">How accurate are the AI predictions?</AccordionTrigger>
                    <AccordionContent className="text-sm">
                      Our AI models have been trained on extensive ESG datasets and typically achieve 85-90% 
                      accuracy in predicting trends and compliance risks. We continuously improve our models 
                      based on real-world outcomes.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Contact Support</CardTitle>
                <CardDescription>We're here to help with any questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span className="text-sm">support@earthkulture.ai</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <Button className="w-full mt-2">Start Live Chat</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="guides">
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Support Guides</CardTitle>
                <CardDescription>Step-by-step guides to common tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-sm hover:text-primary cursor-pointer">Getting started with data imports</li>
                  <li className="text-sm hover:text-primary cursor-pointer">Setting up compliance monitoring</li>
                  <li className="text-sm hover:text-primary cursor-pointer">Generating ESG reports</li>
                  <li className="text-sm hover:text-primary cursor-pointer">Using AI insights effectively</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Support;
