import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Cpu,
  GraduationCap,
  Code2,
  Rocket,
  Heart,
} from "lucide-react";

export function AboutSection() {
  const timeline = [
    {
      icon: Cpu,
      title: "Early Beginnings",
      period: "Childhood",
      description:
        "My journey into technology started young, building computers and exploring how things worked. The curiosity and passion for technology that sparked then continues to drive me today.",
      imageUrl:
        "https://images.unsplash.com/photo-1758159234965-9d259875cf35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGJ1aWxkaW5nJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjIwODc0NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      icon: Code2,
      title: "First Development Project",
      period: "High School",
      description:
        "Started getting into development by building and managing my school's public website. This hands-on experience ignited my passion for web development and showed me the impact of creating digital solutions.",
      imageUrl:
        "https://images.unsplash.com/photo-1759884248009-92c5e957708e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwY29kaW5nJTIwY29tcHV0ZXJ8ZW58MXx8fHwxNzYyMDg3NDU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      icon: GraduationCap,
      title: "Formal Education & Freelancing",
      period: "College Years",
      description:
        "Earned an Associate's Degree in Computer Science while expanding my freelance career. Specialized in creating and customizing WordPress sites for small businesses, helping them establish their online presence.",
      imageUrl:
        "https://images.unsplash.com/photo-1678341859828-bfb1a2bd527a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JkcHJlc3MlMjBkZXZlbG9wbWVudCUyMGxhcHRvcHxlbnwxfHx8fDE3NjIwODc0NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      icon: Rocket,
      title: "Enterprise Experience",
      period: "Professional Growth",
      description:
        "Transitioned into enterprise-level work, focusing on microservices architecture and backend database management. Gained valuable experience implementing scalable solutions for large-scale business operations.",
      imageUrl:
        "https://images.unsplash.com/photo-1619243142206-381c5aeda31c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJ2ZXIlMjBtaWNyb3NlcnZpY2VzJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjIwODc0NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  const skills = [
    "React & Next.js",
    "Node.js & Express",
    "TypeScript",
    "PostgreSQL & MongoDB",
    "REST APIs & GraphQL",
    "Microservices Architecture",
    "AWS & Cloud Infrastructure",
    "WordPress Development",
  ];

  return (
    <section id="about" className="relative py-12 md:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-8">
            {/* Profile Picture */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://res.cloudinary.com/dtxc1dbfx/image/upload/v1761998684/IMG_2531_kgafj6.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-3xl border-4 border-blue-500/20 dark:border-blue-400/20 -z-10 scale-110" />
            </motion.div>

            {/* Text Content */}
            <div className="text-center md:text-left max-w-2xl">
              <h2 className="mb-4">My Journey</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                From building computers as a kid to delivering
                enterprise-grade solutions, my journey has been
                driven by a passion for technology and a
                commitment to helping businesses succeed.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-24 mb-32">
          {timeline.map((item, index) => {
            const Icon = item.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative"
              >
                <div
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    isEven ? "" : "lg:grid-flow-dense"
                  }`}
                >
                  {/* Image */}
                  <div
                    className={`relative ${isEven ? "" : "lg:col-start-2"}`}
                  >
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                      <ImageWithFallback
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    {/* Floating icon */}
                    <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className={`${isEven ? "" : "lg:col-start-1 lg:row-start-1"}`}
                  >
                    <motion.div
                      initial={{
                        opacity: 0,
                        x: isEven ? -20 : 20,
                      }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <div className="inline-block px-4 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm mb-4">
                        {item.period}
                      </div>
                      <h3 className="mb-4">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        {item.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl p-12 mb-24 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-400/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-400/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-6">My Mission Today</h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              I'm dedicated to bringing enterprise-level
              features and robust solutions to individual
              entrepreneurs, small businesses, and medium-sized
              companies—without the enterprise premium or
              complexity. I guide clients through every step of
              the development process, from concept to
              deployment, ensuring they understand their
              technology and can grow with confidence.
            </p>
          </div>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="mb-8">Core Technologies</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {skill}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}