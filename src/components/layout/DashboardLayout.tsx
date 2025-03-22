
import { ReactNode, useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "./Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import MobileSidebarToggle from "./MobileSidebarToggle";
import SimpleChat from '@/components/chat/SimpleChat';
import { motion } from "framer-motion";
import { pageTransitionVariants } from "@/styles/animations";
import PageTour from "@/components/ui/tour/PageTour";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on first client mount to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <motion.div 
        className="min-h-screen bg-background flex flex-col w-full overflow-x-hidden"
        variants={pageTransitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Header />
        <div className="flex flex-1 pt-14 md:pt-16">
          <AppSidebar />
          <motion.main 
            className="flex-1 transition-all duration-200 px-2 md:px-4 pb-24 md:pb-8 w-full overflow-x-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="max-w-full overflow-x-hidden">
              {children}
            </div>
          </motion.main>
        </div>
        
        {isMobile && (
          <MobileSidebarToggle />
        )}
        
        {/* Ensure chat is always mounted regardless of route */}
        <SimpleChat />
        
        {/* Page-specific tour */}
        <PageTour />
      </motion.div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
