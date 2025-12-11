import { Bot, ShoppingCart, Sparkles, LucideIcon } from "lucide-react";

export interface ProjectInfo {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
}

export const projects: ProjectInfo[] = [
  {
    id: "miniwiki",
    name: "MiniWiki",
    description:
      "Chat with your repository using AI. Ask questions about your codebase and get intelligent answers powered by Gemini.",
    href: "/index_repo",
    icon: Bot,
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-700",
  },
  {
    id: "store_analyze",
    name: "Store Analyze",
    description:
      "A simple Store Sales Management System. Supports basic CRUD operations for daily store sales with item details tracking, like a lightweight warehouse tracker.",
    href: "/store_analyze",
    icon: ShoppingCart,
    gradientFrom: "from-emerald-500",
    gradientTo: "to-teal-700",
  },
  {
    id: "easter_egg_effect",
    name: "Particle Effect Visualizer",
    description:
      "Interactive particle effect visualization with multiple display modes. Transform between Line, Christmas Tree, and Heart shapes with smooth animated transitions and themed particles.",
    href: "/easter_egg_effect",
    icon: Sparkles,
    gradientFrom: "from-purple-500",
    gradientTo: "to-pink-600",
  },
];

