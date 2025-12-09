import { ProjectCard } from "./components/ProjectCard";
import { projects } from "./project_info";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
          Chonghan's Engineering Project Library
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Discover the Tools I Use to Build & Create
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              name={project.name}
              description={project.description}
              href={project.href}
              icon={project.icon}
              gradientFrom={project.gradientFrom}
              gradientTo={project.gradientTo}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
