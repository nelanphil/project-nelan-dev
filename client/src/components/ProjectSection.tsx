import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Project } from "../types/project";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface ProjectSectionProps {
  project: Project;
  index: number;
}

export function ProjectSection({ project, index }: ProjectSectionProps) {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const isEven = index % 2 === 0;
  
  const imageY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.5, 0.5, 0]);

  // Alternate background colors
  const bgColors = [
    "bg-gradient-to-br from-slate-50/50 to-gray-50/50 dark:from-slate-900/30 dark:to-gray-900/30",
    "bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/20",
    "bg-gradient-to-br from-purple-50/30 to-pink-50/30 dark:from-purple-900/20 dark:to-pink-900/20",
    "bg-gradient-to-br from-orange-50/30 to-amber-50/30 dark:from-orange-900/20 dark:to-amber-900/20",
  ];

  return (
    <div ref={ref} className="relative min-h-screen flex items-center py-24 px-6">
      {/* Section background */}
      <motion.div
        style={{ opacity: backgroundOpacity }}
        className={`absolute inset-0 ${bgColors[index % bgColors.length]}`}
      />
      
      <motion.div
        style={{ opacity }}
        className="max-w-7xl mx-auto w-full relative z-10"
      >
        <div className={`grid md:grid-cols-2 gap-12 items-center ${isEven ? '' : 'md:direction-rtl'}`}>
          {/* Image */}
          <motion.div
            style={{ y: imageY, scale }}
            className={`relative ${isEven ? 'md:order-1' : 'md:order-2'}`}
          >
            <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ${
              project.highlighted ? 'ring-2 ring-black/20 dark:ring-white/30' : ''
            }`}>
              <ImageWithFallback
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              {project.highlighted && (
                <div className="absolute top-4 right-4">
                  <div className="bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-xs shadow-lg">
                    ✨ Featured
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            style={{ y: contentY }}
            className={`${isEven ? 'md:order-2' : 'md:order-1'}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="text-sm text-gray-500 dark:text-gray-400">{project.year}</div>
              {project.highlighted && (
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Badge className="bg-green-500 hover:bg-green-600 text-white">
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      Active Development
                    </span>
                  </Badge>
                </motion.div>
              )}
            </div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="mb-0">{project.title}</h2>
              {project.status === "beta" && (
                <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                  Beta
                </Badge>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{project.role}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate(`/project/${project.id}`)}
                variant="default"
                size="lg"
              >
                More Details
              </Button>
              {project.link && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                >
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
