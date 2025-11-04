import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function BackgroundGradient() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "75%"]);

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none overflow-hidden dark:hidden">
      {/* Top gradient blob */}
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-blue-100/30 to-purple-100/30 blur-3xl"
      />
      
      {/* Middle gradient blob */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-pink-100/20 to-orange-100/20 blur-3xl"
      />
      
      {/* Bottom gradient blob */}
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-0 right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-indigo-100/25 to-cyan-100/25 blur-3xl"
      />
    </div>
  );
}
