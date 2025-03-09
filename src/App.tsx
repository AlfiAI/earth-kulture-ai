
import { Toaster } from "@/components/ui/sonner";
import { router } from "@/routes/routes";
import { RouterProvider } from "react-router-dom";
import EnhancedWalyAssistant from "@/components/ai/EnhancedWalyAssistant";

import "@/App.css";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <EnhancedWalyAssistant initialOpen={false} />
      <Toaster />
    </>
  );
}

export default App;
