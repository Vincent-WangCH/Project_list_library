import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

export interface ProjectCardProps {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  gradientFrom?: string;
  gradientTo?: string;
}

export function ProjectCard({
  name,
  description,
  href,
  icon: Icon,
  gradientFrom = "from-blue-500",
  gradientTo = "to-blue-700",
}: ProjectCardProps) {
  return (
    <Link href={href}>
      <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 hover:border-blue-300">
        {/* Cover */}
        <div
          className={`h-40 bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center`}
        >
          <Icon className="w-16 h-16 text-white opacity-90" />
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {name}
          </h2>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
          <div className="flex items-center text-blue-600 text-sm font-medium">
            <span>Open {name}</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

