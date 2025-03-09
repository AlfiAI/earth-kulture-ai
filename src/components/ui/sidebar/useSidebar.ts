
import * as React from "react";
import { SidebarContext } from "./types";

// Create a context for the sidebar
const SidebarContextInstance = React.createContext<SidebarContext | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContextInstance);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

export { SidebarContextInstance };
