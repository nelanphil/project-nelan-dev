import type { Project } from "../types/project";

export const projects: Project[] = [
  {
    id: "1",
    title: "Khepri.io",
    description: "A comprehensive health and wellness SaaS platform that combines insights, programs, and communities. Designed for both B2B and B2C markets, enabling organizations and individuals to access personalized wellness programs. Currently deployed as a Progressive Web App with an iOS application in development.",
    role: "Lead Developer",
    technologies: ["MongoDB", "Express", "React", "Node.js", "PWA", "iOS"],
    imageUrl: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwd29ya291dCUyMHRyYWluaW5nfGVufDF8fHx8MTc2MTk5MjYwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    year: "2025",
    link: "https://khepri.io",
    status: "beta",
    highlighted: true,
  },
  {
    id: "2",
    title: "CF Corals",
    description: "Designed a customer-facing eCommerce store for a small coral business with seamless Shopify integration. Implemented comprehensive SEO configurations to ensure optimal adaptability and performance across all platforms and display sizes, delivering an enhanced user experience and improved search visibility.",
    role: "Full-Stack Developer & SEO Specialist",
    technologies: ["React", "Shopify", "SEO", "Tailwind CSS", "Responsive Design"],
    imageUrl: "https://images.unsplash.com/photo-1697826208801-6082a2222a07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JhbCUyMHJlZWYlMjBvY2VhbnxlbnwxfHx8fDE3NjIwODU4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    year: "2025",
    link: "https://example.com",
    highlighted: true,
  },
  {
    id: "3",
    title: "NKS Surf",
    description: "Custom business landing page for a local surf shop enabling customers to schedule surfboard repairs and book private surf lessons. Features include user registration, board repair tracking, lesson scheduling with calendar integration, automated text alerts, and integrated payment processing for a seamless customer experience.",
    role: "Full-Stack Developer",
    technologies: ["React", "Express", "Node.js", "Supabase (Postgres)", "Stripe"],
    imageUrl: "https://images.unsplash.com/photo-1547955065-5033c60a66fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJmYm9hcmQlMjBzdXJmJTIwb2NlYW58ZW58MXx8fHwxNzYyMDg2NTUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    year: "2025",
    link: "https://example.com",
  },
];
