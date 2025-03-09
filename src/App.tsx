
import { Toaster } from "@/components/ui/sonner";
import EnhancedWalyAssistant from "@/components/ai/EnhancedWalyAssistant";

import "@/App.css";

function App() {
  return (
    <>
      <EnhancedWalyAssistant initialOpen={false} />
      <Toaster />
    </>
  );
}

export default App;
