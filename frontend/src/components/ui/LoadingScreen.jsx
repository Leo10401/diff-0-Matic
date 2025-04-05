import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ isLoading }) => {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ pointerEvents: isLoading ? 'auto' : 'none' }}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-24 h-24 mb-8">
          <motion.div 
            className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-2 border-4 border-t-transparent border-r-primary border-b-transparent border-l-transparent rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold">Loading diff-0-matic </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-muted-foreground mt-2">Setting up your comparison experience...</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;