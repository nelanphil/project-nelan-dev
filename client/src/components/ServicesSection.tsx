import { motion } from "motion/react";
import { Globe, Smartphone, Database, Rocket } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ServicesSection() {
  const services = [
    {
      icon: Globe,
      title: "Web Development",
      description: "Custom web applications built with React, Next.js, and modern technologies.",
      features: [
        "Responsive Design",
        "SEO Optimized",
        "Fast Performance",
        "Progressive Web Apps",
        "E-Commerce Solutions",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1593720213681-e9a8778330a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGluZ3xlbnwxfHx8fDE3NjIwMzQ0Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      icon: Smartphone,
      title: "Mobile Apps",
      description: "Cross-platform mobile applications using React Native for iOS and Android.",
      features: [
        "Native Feel",
        "Offline Support",
        "Push Notifications",
        "App Store Deployment",
        "Cross-Platform Development",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXNpZ258ZW58MXx8fHwxNzYxOTkwMzEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      icon: Database,
      title: "Backend Development",
      description: "Scalable APIs and server infrastructure with Node.js and cloud platforms.",
      features: [
        "RESTful APIs",
        "Database Design",
        "Cloud Deployment",
        "Authentication & Security",
        "Real-time Data Processing",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1641156803026-0b819059b04d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJ2ZXIlMjBiYWNrZW5kJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjIwODY4NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      icon: Rocket,
      title: "Consulting",
      description: "Technical consultation and architecture planning for your next project.",
      features: [
        "Tech Strategy",
        "Code Reviews",
        "Team Training",
        "Architecture Design",
        "Performance Optimization",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1758876203342-fc14c0bba67c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0d28lMjBwZW9wbGUlMjB3b3JraW5nJTIwbGFwdG9wfGVufDF8fHx8MTc2MjA4NzExOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  return (
    <section id="services" className="relative py-12 md:py-24 px-6 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/50 dark:to-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="mb-4">Services</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            From concept to deployment, I offer comprehensive development services 
            to bring your digital ideas to life.
          </p>
        </motion.div>

        <div className="space-y-32">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative"
              >
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:grid-flow-dense'}`}>
                  {/* Image */}
                  <div className={`relative ${isEven ? '' : 'lg:col-start-2'}`}>
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                      <ImageWithFallback
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    {/* Floating icon */}
                    <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 flex items-center justify-center shadow-xl">
                      <Icon className="w-10 h-10 text-white dark:text-gray-900" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="mb-4">{service.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="space-y-4">
                        {service.features.map((feature) => (
                          <div key={feature} className="flex items-center group">
                            <div className="w-6 h-6 rounded-full bg-green-500/10 dark:bg-green-400/10 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                              <svg
                                className="w-4 h-4 text-green-600 dark:text-green-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
