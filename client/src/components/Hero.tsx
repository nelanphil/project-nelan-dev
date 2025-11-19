import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { XPost } from "./XPost";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <div
      ref={ref}
      className="relative h-screen flex items-start justify-center overflow-hidden px-6 pt-30"
    >
      <motion.div
        style={{ y, opacity, scale }}
        className="w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="flex flex-col items-center">
          <XPost
            profileImage="https://res.cloudinary.com/dtxc1dbfx/image/upload/v1761998684/IMG_2531_kgafj6.jpg"
            name="Phillip Nelan"
            handle="phillipnelan"
            content={`Hi, I'm Phillip Nelan 👋\n\nFull-Stack Developer crafting seamless, performant web experiences. My passion is building products that make a difference.\n\n🔗 github.com/nelanphil\n💼 linkedin.com/in/phillipnelan\n📧 p@nelan.dev`}
            timestamp="2h"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-6 text-center text-gray-500 dark:text-gray-400 text-sm"
          >
            Scroll to see my work ↓
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-32 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </div>
  );
}
