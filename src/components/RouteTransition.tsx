import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface RouteTransitionProps {
  children: ReactNode;
}

const RouteTransition: React.FC<RouteTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }} // Initial animation state (off-screen and invisible)
      animate={{ opacity: 1, x: 0 }} // Final animation state (on-screen and fully visible)
      exit={{ opacity: 0, x: 20 }} // Exit animation (off-screen and invisible in the opposite direction)
      transition={{ duration: 0.3 }} // Animation duration
    >
      {children}
    </motion.div>
  );
};

export default RouteTransition;
