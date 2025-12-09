import { Bot, ShoppingCart, LucideIcon } from "lucide-react";

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
];

