
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.05
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      when: "afterChildren",
    }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 500 }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2 }
  }
};
