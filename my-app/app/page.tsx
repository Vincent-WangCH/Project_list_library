import Link from "next/link";
import { ArrowRight, Bot, LucideIcon } from "lucide-react";

interface ProjectCardProps {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  gradientFrom?: string;
  gradientTo?: string;
}

function ProjectCard({
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

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
          Welcome to Project Library
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Explore our collection of AI-powered tools
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ProjectCard
            name="MiniWiki"
            description="Chat with your repository using AI. Ask questions about your codebase and get intelligent answers powered by Gemini."
            href="/index_repo"
            icon={Bot}
            gradientFrom="from-blue-500"
            gradientTo="to-blue-700"
          />
        </div>
      </div>
    </main>
  );
}
