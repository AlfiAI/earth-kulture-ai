
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { containerVariants } from '@/styles/animations';

interface SectionProps {
  children: ReactNode;
  className?: string;
}

const Section = ({ children, className = '' }: SectionProps) => {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={`container mx-auto px-4 py-8 md:py-12 ${className}`}
    >
      {children}
    </motion.section>
  );
};

export default Section;
