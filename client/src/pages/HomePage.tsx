import { Hero } from "../components/Hero";
import { ProjectSection } from "../components/ProjectSection";
import { Footer } from "../components/Footer";
import { BackgroundGradient } from "../components/BackgroundGradient";
import { projects } from "../data/projects";
import { motion } from "motion/react";

export function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <BackgroundGradient />
      
      <div className="relative z-10">
        <Hero />
        
        <div id="projects" className="relative">
          {projects.map((project, index) => (
            <ProjectSection 
              key={project.id} 
              project={project} 
              index={index}
            />
          ))}
        </div>
        
        <div id="contact">
          <Footer />
        </div>
      </div>
    </motion.div>
  );
}
