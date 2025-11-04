export interface Project {
  id: string;
  title: string;
  description: string;
  role: string;
  technologies: string[];
  imageUrl: string;
  year: string;
  link?: string;
  status?: "beta" | "active" | "archived";
  highlighted?: boolean;
}
