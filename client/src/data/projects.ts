import type { Project } from "../types/project";

export const projects: Project[] = [
  {
    id: "1",
    title: "BRUU",
    description:
      "A full-stack MERN eCommerce platform for a brand selling quality functional mushroom tea powder blends. Features a comprehensive admin dashboard for inventory management, product CRUD with built-in SEO optimization, customizable customer rewards point system, product analytics, storefront management, and an integrated lead generation system—all designed to drive growth and streamline operations.",
    role: "Full-Stack Developer & SEO Specialist",
    technologies: ["MongoDB", "Express", "React", "Node.js", "Stripe"],
    imageUrl: "/images/bruu-preview.jpg",
    year: "2025",
    link: "https://bruu-it.com",
    status: "in development",
    highlighted: true,
  },
  {
    id: "2",
    title: "CF Corals",
    description:
      "Designed a customer-facing headless eCommerce store for a large coral business with seamless Shopify integration. Implemented comprehensive SEO configurations to ensure optimal adaptability and performance across all platforms and display sizes, delivering an enhanced user experience and improved search visibility. This project was built to help the business owner reach more customers and increase their revenue through unique frontend experience unlike any cookie cutter template.",
    role: "Full-Stack Developer & SEO Specialist",
    technologies: [
      "React",
      "Shopify",
      "SEO",
      "Tailwind CSS",
      "Responsive Design",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1697826208801-6082a2222a07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JhbCUyMHJlZWYlMjBvY2VhbnxlbnwxfHx8fDE3NjIwODU4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    year: "2025",
    status: "in development",
    highlighted: true,
  },
  {
    id: "3",
    title: "Gringo Surf",
    description:
      "Custom business landing page for a local business in New Smyrna Beach, Florida. Enabling customers to schedule surfboard repairs and book private surf lessons. Features include user registration, board repair tracking, lesson scheduling with calendar integration, automated text alerts, and integrated payment processing for a seamless customer experience. This project was built to help the business owner reach more customers and increase their revenue through unique customized business dashboards & CRM tools.",
    role: "Full-Stack Developer & SEO Specialist",
    technologies: [
      "React",
      "Express",
      "Node.js",
      "Supabase (Postgres)",
      "Stripe",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1547955065-5033c60a66fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJmYm9hcmQlMjBzdXJmJTIwb2NlYW58ZW58MXx8fHwxNzYyMDg2NTUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    year: "2025",
    link: "https://gringo.surf",
  },
];
