
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, HelpCircle } from "lucide-react";
import ARIESModelSelector from "./ARIESModelSelector";
import ARIESModelResults from "./ARIESModelResults";
import ARIESModelParameters from "./ARIESModelParameters";
import ARIESTrainingResources from "./ARIESTrainingResources";
import { useARIESModels } from "./hooks/useARIESModels";

const ARIESModelingTab = () => {
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [showTrainingResources, setShowTrainingResources] = useState(false);
  const { models, runModel, isLoading, results } = useARIESModels();

  const handleRunModel = () => {
    if (selectedModelId) {
      runModel(selectedModelId);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ARIES Environmental Modeling</CardTitle>
          <CardDescription>
            Assess ecosystem services and run environmental simulations using Artificial Intelligence for Ecosystem Services (ARIES).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="models" className="space-y-4">
            <TabsList>
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="results" disabled={!results}>Results</TabsTrigger>
              <TabsTrigger value="training" onClick={() => setShowTrainingResources(true)}>
                Training Resources
              </TabsTrigger>
            </TabsList>

            <TabsContent value="models" className="space-y-4">
              <div className="space-y-4">
                <ARIESModelSelector 
                  models={models} 
                  selectedModelId={selectedModelId}
                  onSelectModel={setSelectedModelId}
                />
                
                {selectedModelId && (
                  <>
                    <ARIESModelParameters modelId={selectedModelId} />
                    
                    <div className="flex justify-end space-x-4 pt-4">
                      <Button variant="outline" onClick={() => setSelectedModelId(null)}>
                        Reset
                      </Button>
                      <Button 
                        onClick={handleRunModel}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Run Model"}
                        {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                      </Button>
                    </div>
                  </>
                )}
                
                <div className="text-sm text-muted-foreground mt-4 flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Need help? Check the training resources for guidance on model selection and interpretation.
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results">
              {results ? (
                <div className="space-y-4">
                  <ARIESModelResults results={results} />
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export Results
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Run a model to see results here.
                </div>
              )}
            </TabsContent>

            <TabsContent value="training">
              <ARIESTrainingResources />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ARIESModelingTab;
