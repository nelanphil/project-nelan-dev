import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router-dom";
import { projects } from "../data/projects";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Footer } from "../components/Footer";

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4">Project Not Found</h1>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative min-h-screen"
    >
      {/* Hero Section */}
      <div className="relative pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Button>

          <div className="flex items-center gap-2 mb-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">{project.year}</div>
            {project.highlighted && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  Active Development
                </span>
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <h1 className="mb-0">{project.title}</h1>
            {project.status === "beta" && (
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                Beta
              </Badge>
            )}
          </div>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">{project.role}</p>

          <div className="flex flex-wrap gap-3 mb-8">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-base py-1.5 px-3">
                {tech}
              </Badge>
            ))}
          </div>

          {project.link && (
            <Button asChild size="lg">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Live Project
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Project Image */}
      <div className="relative px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`relative aspect-video rounded-2xl overflow-hidden shadow-2xl ${
              project.highlighted ? 'ring-2 ring-black/20 dark:ring-white/30' : ''
            }`}
          >
            <ImageWithFallback
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>

      {/* Project Details */}
      <div className="relative px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <h2>About This Project</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {project.description}
                  </p>

                  <h2>Key Features</h2>
                  <ul className="space-y-2">
                    {project.id === "1" && (
                      <>
                        <li>Progressive Web App (PWA) architecture for cross-platform compatibility</li>
                        <li>Comprehensive health and wellness tracking dashboard</li>
                        <li>Personalized program recommendations using intelligent algorithms</li>
                        <li>Community features for user engagement and support</li>
                        <li>B2B and B2C platform flexibility</li>
                        <li>iOS native application in active development</li>
                        <li>Real-time data synchronization across devices</li>
                      </>
                    )}
                    {project.id === "2" && (
                      <>
                        <li>Custom Shopify theme development tailored to brand identity</li>
                        <li>Comprehensive SEO optimization for search engine visibility</li>
                        <li>Fully responsive design optimized for mobile and tablet</li>
                        <li>Product catalog management with advanced filtering</li>
                        <li>Integrated checkout and payment processing</li>
                        <li>Performance optimization for fast load times</li>
                        <li>Analytics integration for business insights</li>
                      </>
                    )}
                    {project.id === "3" && (
                      <>
                        <li>User registration and authentication system</li>
                        <li>Surfboard repair request and tracking workflow</li>
                        <li>Private surf lesson booking with calendar integration</li>
                        <li>Automated SMS/text notifications for customers</li>
                        <li>Stripe payment processing integration</li>
                        <li>Admin dashboard for business management</li>
                        <li>Mobile-responsive design for on-the-go bookings</li>
                      </>
                    )}
                  </ul>

                  <h2>Technical Implementation</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {project.id === "1" && 
                      "Built using the MERN stack (MongoDB, Express, React, Node.js), Khepri.io leverages modern web technologies to deliver a seamless user experience. The Progressive Web App architecture ensures cross-platform compatibility while maintaining native app-like performance. The backend utilizes RESTful APIs and JWT authentication for secure data management."
                    }
                    {project.id === "2" && 
                      "Developed with React and Tailwind CSS, integrated with Shopify's robust eCommerce platform. The implementation focuses on performance optimization, accessibility, and SEO best practices. Custom Shopify Liquid templates were created to provide unique product displays while maintaining easy content management for the business owner."
                    }
                    {project.id === "3" && 
                      "Architected with React for the frontend and Express/Node.js for the backend, with Supabase (PostgreSQL) handling data persistence. Stripe integration provides secure payment processing, while SMS notifications keep customers informed. The calendar system uses modern date-time libraries for reliable scheduling across time zones."
                    }
                  </p>

                  <h2>Challenges & Solutions</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {project.id === "1" && 
                      "One of the main challenges was creating a flexible platform that serves both B2B and B2C markets with different feature sets and branding requirements. We implemented a white-label architecture with configurable modules, allowing organizations to customize their wellness platform while maintaining a consistent core experience."
                    }
                    {project.id === "2" && 
                      "The primary challenge was optimizing product imagery and load times for a media-heavy coral eCommerce site. We implemented progressive image loading, optimized asset delivery through CDN, and utilized modern image formats (WebP) with fallbacks to ensure fast performance across all devices and connection speeds."
                    }
                    {project.id === "3" && 
                      "Coordinating real-time availability for surf lessons while preventing double-bookings required careful state management and database transaction handling. We implemented optimistic locking with conflict resolution and real-time calendar updates to ensure a smooth booking experience for customers and reliable scheduling for the business."
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </motion.div>
  );
}
