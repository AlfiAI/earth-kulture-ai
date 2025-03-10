
import { Variants } from 'framer-motion';

// Container animation variants
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      when: "afterChildren",
    }
  }
};

// Standard item animation variants
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      damping: 25, 
      stiffness: 500 
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2 }
  }
};

// Card hover animations
export const cardHoverVariants: Variants = {
  hover: { 
    y: -5, 
    transition: { 
      type: "spring", 
      stiffness: 300 
    } 
  },
  tap: { 
    scale: 0.98 
  }
};

// Button animations
export const buttonVariants: Variants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

// Page transitions
export const pageTransitionVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

// Fade in from bottom
export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Staggered container
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Background blob animations
export const blobVariants: Variants = {
  animate: (custom: number) => ({ 
    scale: [1, 1.2, 1],
    x: [0, custom * 20, 0],
    opacity: [0.3, 0.5, 0.3],
    transition: { 
      duration: 12 + custom * 3, 
      repeat: Infinity, 
      repeatType: "reverse" 
    }
  })
};

// Badge/pill animation
export const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 500,
      damping: 30,
      delay: 0.2
    } 
  }
};
