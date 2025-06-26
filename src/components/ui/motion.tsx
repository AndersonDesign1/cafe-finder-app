import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps, Variants } from 'framer-motion';

// Cafe-inspired animation variants
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

export const slideInFromLeft: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 }
};

export const coffeeStir: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const liquidRipple: Variants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: "easeOut"
    }
  }
};

// Motion components with cafe-inspired defaults
interface MotionDivProps extends HTMLMotionProps<"div"> {
  variant?: keyof typeof motionVariants;
}

const motionVariants = {
  fadeInUp,
  scaleIn,
  slideInFromLeft,
  staggerContainer,
  liquidRipple
};

export const MotionDiv: React.FC<MotionDivProps> = ({ 
  variant = 'fadeInUp', 
  children, 
  ...props 
}) => {
  return (
    <motion.div
      variants={motionVariants[variant]}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MotionButton: React.FC<HTMLMotionProps<"button">> = ({ 
  children, 
  ...props 
}) => {
  return (
    <motion.button
      variants={liquidRipple}
      whileHover="hover"
      whileTap="tap"
      transition={{ duration: 0.3, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const MotionCard: React.FC<HTMLMotionProps<"div">> = ({ 
  children, 
  ...props 
}) => {
  return (
    <motion.div
      variants={scaleIn}
      initial="initial"
      animate="animate"
      whileHover={{ 
        scale: 1.02, 
        transition: { duration: 0.3, ease: "easeOut" } 
      }}
      className="cafe-card"
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const StaggeredContainer: React.FC<HTMLMotionProps<"div">> = ({ 
  children, 
  ...props 
}) => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const LoadingSpinner: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <motion.div
      variants={coffeeStir}
      animate="animate"
      className={`inline-block ${className}`}
    >
      ☕
    </motion.div>
  );
};