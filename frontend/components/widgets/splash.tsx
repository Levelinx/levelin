'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const Splash = () => {

  // Animation variants for the logo
  const logoVariants = {
    initial: { 
      y: 0 
    },
    animate: {
      scale: 1,
      opacity: 1,
      y: [0, -30, 0], // Bounce up and down
      transition: {
        y: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        },
        scale: {
          duration: 0.8,
        },
        opacity: {
          duration: 0.8,
        }
      }
    },
    exit: {
      scale: 1.2,
      opacity: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Fade out the entire splash screen
  const containerVariants = {
    exit: {
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50"
      variants={containerVariants}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit="exit"
    >
      <motion.div
        className="flex justify-center items-center w-48 h-48"
        variants={logoVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Image
          src="/images/logo2.0.png"
          alt="App Logo"
          width={150}
          height={150}
          quality={100}
          priority
        />
      </motion.div>
    </motion.div>
  );
};

export default Splash;