
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const SettingsPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assistant Configuration</CardTitle>
        <CardDescription>Customize your AI assistant experience</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Assistant Mode</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: "reactive",
                  title: "Reactive Mode",
                  description: "Assistant responds only when asked questions"
                },
                {
                  id: "proactive",
                  title: "Proactive Mode",
                  description: "Assistant provides insights and suggestions automatically"
                }
              ].map((mode) => (
                <div key={mode.id} className="flex items-start space-x-2">
                  <input 
                    type="radio" 
                    id={mode.id} 
                    name="assistantMode" 
                    className="mt-1"
                    defaultChecked={mode.id === "reactive"}
                  />
                  <div>
                    <Label htmlFor={mode.id} className="font-medium">{mode.title}</Label>
                    <p className="text-sm text-muted-foreground">{mode.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Feature Settings</h3>
            {[
              {
                id: "insights",
                title: "AI-Generated Insights",
                description: "Allow the assistant to analyze your data and provide insights"
              },
              {
                id: "recommendations",
                title: "Personalized Recommendations",
                description: "Receive tailored sustainability recommendations based on your industry"
              },
              {
                id: "alerts",
                title: "Compliance Alerts",
                description: "Get notified about regulatory changes that may affect your reporting"
              }
            ].map((setting) => (
              <div key={setting.id} className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <Label htmlFor={setting.id} className="font-medium">{setting.title}</Label>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <Switch id={setting.id} defaultChecked={true} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Settings</Button>
      </CardFooter>
    </Card>
  );
};

export default SettingsPanel;
