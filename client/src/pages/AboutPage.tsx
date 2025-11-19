import { AboutSection } from "../components/AboutSection";
import { motion } from "motion/react";

export function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <AboutSection />
    </motion.div>
  );
}
