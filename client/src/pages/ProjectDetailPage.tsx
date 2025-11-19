import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router-dom";
import { projects } from "../data/projects";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Footer } from "../components/Footer";

// Utility function to parse description text and convert list patterns to JSX
function formatDescription(text: string): JSX.Element | JSX.Element[] {
  const lines = text.split("\n");
  const elements: JSX.Element[] = [];
  let currentList: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let keyCounter = 0;

  const flushList = () => {
    if (currentList.length > 0 && listType) {
      const ListTag = listType === "ul" ? "ul" : "ol";
      const listClass = listType === "ul" ? "list-disc" : "list-decimal";
      elements.push(
        <ListTag
          key={`list-${keyCounter++}`}
          className={`space-y-2 my-4 ml-6 ${listClass}`}
        >
          {currentList.map((item, idx) => (
            <li
              key={idx}
              className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
            >
              {item.trim()}
            </li>
          ))}
        </ListTag>
      );
      currentList = [];
      listType = null;
    }
  };

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check for bullet list items (- or *)
    if (/^[-*]\s+/.test(trimmedLine)) {
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      currentList.push(trimmedLine.replace(/^[-*]\s+/, ""));
    }
    // Check for numbered list items (1. 2. etc.)
    else if (/^\d+\.\s+/.test(trimmedLine)) {
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      currentList.push(trimmedLine.replace(/^\d+\.\s+/, ""));
    }
    // Regular paragraph
    else if (trimmedLine) {
      flushList();
      elements.push(
        <p
          key={`para-${keyCounter++}`}
          className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4"
        >
          {trimmedLine}
        </p>
      );
    }
    // Empty line
    else {
      flushList();
    }
  }

  flushList();

  return elements.length > 0 ? (
    elements
  ) : (
    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
      {text}
    </p>
  );
}

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
      <div className="relative pt-20 pb-16 px-6">
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
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {project.year}
            </div>
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
            {project.status === "in development" && (
              <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                In Development
              </Badge>
            )}
          </div>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {project.role}
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {project.technologies.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="text-base py-1.5 px-3"
              >
                {tech}
              </Badge>
            ))}
          </div>

          {project.link && (
            <Button asChild size="lg">
              <a href={project.link} target="_blank" rel="noopener noreferrer">
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
              project.highlighted
                ? "ring-2 ring-black/20 dark:ring-white/30"
                : ""
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
                  <h2 className="font-bold text-2xl mt-0 mb-6 text-gray-900 dark:text-gray-100">
                    About This Project
                  </h2>
                  <div className="mb-8">
                    {formatDescription(project.description)}
                  </div>

                  <h2 className="font-bold text-2xl mt-10 mb-6 text-gray-900 dark:text-gray-100">
                    Key Features
                  </h2>
                  <ul className="space-y-3 my-4 ml-6 list-disc">
                    {project.id === "1" && (
                      <>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Custom-built frontend with React for seamless user
                          experience
                        </li>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Robust backend API with Express and Node.js for order
                          processing
                        </li>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Product catalog showcasing freshly baked healthy
                          options
                        </li>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Secure payment processing with Stripe integration
                        </li>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Real-time inventory management system
                        </li>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Order tracking and customer notification system
                        </li>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Direct-to-consumer (D2C) sales platform from kitchen
                          to customer
                        </li>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Mobile-responsive design for on-the-go ordering
                        </li>
                      </>
                    )}
                    {project.id === "2" && (
                      <>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Custom Shopify theme development tailored to brand
                          identity
                        </li>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Comprehensive SEO optimization for search engine
                          visibility
                        </li>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Fully responsive design optimized for mobile and
                          tablet
                        </li>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Product catalog management with advanced filtering
                        </li>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Integrated checkout and payment processing
                        </li>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Performance optimization for fast load times
                        </li>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Analytics integration for business insights
                        </li>
                      </>
                    )}
                    {project.id === "3" && (
                      <>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          User registration and authentication system
                        </li>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Surfboard repair request and tracking workflow
                        </li>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Private surf lesson booking with calendar integration
                        </li>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Automated SMS/text notifications for customers
                        </li>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Stripe payment processing integration
                        </li>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Admin dashboard for business management
                        </li>
                        <li className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                          Mobile-responsive design for on-the-go bookings
                        </li>
                      </>
                    )}
                  </ul>

                  <h2 className="font-bold text-2xl mt-10 mb-6 text-gray-900 dark:text-gray-100">
                    Technical Implementation
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {project.id === "1" &&
                      "Built with React for the frontend and Express/Node.js for the backend, Vioma Market leverages modern web technologies to deliver a seamless eCommerce experience. The backend utilizes Supabase (PostgreSQL) for reliable data persistence, handling product inventory, customer orders, and user accounts. Stripe integration provides secure payment processing, ensuring safe transactions for direct-to-consumer sales. The architecture is designed to scale with the growing business, supporting real-time inventory updates and order management from the kitchen to the customer."}
                    {project.id === "2" &&
                      "Developed with React and Tailwind CSS, integrated with Shopify's robust eCommerce platform. The implementation focuses on performance optimization, accessibility, and SEO best practices. Custom Shopify Liquid templates were created to provide unique product displays while maintaining easy content management for the business owner."}
                    {project.id === "3" &&
                      "Architected with React for the frontend and Express/Node.js for the backend, with Supabase (PostgreSQL) handling data persistence. Stripe integration provides secure payment processing, while SMS notifications keep customers informed. The calendar system uses modern date-time libraries for reliable scheduling across time zones."}
                  </p>

                  <h2 className="font-bold text-2xl mt-10 mb-6 text-gray-900 dark:text-gray-100">
                    Challenges & Solutions
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {project.id === "1" &&
                      "One of the main challenges was creating an eCommerce platform that accurately reflects the freshness and artisanal quality of baked goods while providing a smooth ordering experience. We implemented real-time inventory management to prevent overselling of freshly baked items, ensuring customers only see available products. Another challenge was designing a system that supports the direct-to-consumer model, allowing the kitchen to manage orders efficiently while customers can track their orders from preparation to delivery. We solved this by building a custom admin dashboard integrated with the backend, enabling real-time order updates and inventory synchronization."}
                    {project.id === "2" &&
                      "The primary challenge was optimizing product imagery and load times for a media-heavy coral eCommerce site. We implemented progressive image loading, optimized asset delivery through CDN, and utilized modern image formats (WebP) with fallbacks to ensure fast performance across all devices and connection speeds."}
                    {project.id === "3" &&
                      "Coordinating real-time availability for surf lessons while preventing double-bookings required careful state management and database transaction handling. We implemented optimistic locking with conflict resolution and real-time calendar updates to ensure a smooth booking experience for customers and reliable scheduling for the business."}
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
