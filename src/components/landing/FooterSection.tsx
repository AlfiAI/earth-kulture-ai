
import { Leaf } from 'lucide-react';
import { motion } from "framer-motion";

const FooterSection = () => {
  return (
    <footer className="container mx-auto px-4 py-8 border-t border-border/40 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" as const }}
            className="mr-2"
          >
            <Leaf className="h-5 w-5 text-primary" />
          </motion.div>
          <span className="font-medium bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">Earth Kulture</span>
        </div>
        <div className="text-sm text-muted-foreground">
          © 2023 Earth Kulture. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
