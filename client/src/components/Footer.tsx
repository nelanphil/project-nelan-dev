import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleGetInTouch = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="mb-4">Let's work together</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            I'm always open to discussing new projects and creative ideas.
          </p>
          <button
            onClick={handleGetInTouch}
            className="inline-block px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Get in touch
          </button>
        </motion.div>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-center gap-8 mb-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Twitter
            </a>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} Phillip Nelan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
