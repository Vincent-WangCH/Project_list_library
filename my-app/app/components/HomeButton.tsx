import Link from "next/link";
import { Home } from "lucide-react";

export type HomeButtonVariant = "dark" | "light" | "glass";

interface HomeButtonProps {
  /**
   * Visual variant of the button
   * - "dark": Dark background with white icon (for light backgrounds)
   * - "light": Light background with dark icon (for dark backgrounds) 
   * - "glass": Semi-transparent with backdrop blur (for any background)
   */
  variant?: HomeButtonVariant;
  /** Additional CSS classes */
  className?: string;
}

const variantStyles: Record<HomeButtonVariant, string> = {
  dark: "bg-gray-800 text-white hover:bg-gray-700",
  light: "bg-white text-gray-800 hover:bg-gray-100 shadow-md",
  glass: "bg-black/50 backdrop-blur-sm text-white hover:bg-black/70",
};

export function HomeButton({ variant = "light", className = "" }: HomeButtonProps) {
  return (
    <Link
      href="/"
      className={`fixed top-4 left-4 z-50 rounded-xl p-3 transition-all duration-200 hover:scale-105 ${variantStyles[variant]} ${className}`}
      title="Back to Home"
    >
      <Home className="w-5 h-5" />
    </Link>
  );
}

