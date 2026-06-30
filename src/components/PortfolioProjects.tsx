import { useState, useEffect } from 'react';
import Card from './Card.tsx';
import ImageHolder from './ImageHolder.tsx';
import { getProjects, type Project } from '../utils/projectData';

function PortfolioProjects() {
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const projects = getProjects();
      console.log('Loaded projects:', projects);
      setProjectsData(projects);
      if (projects.length > 0) {
        setActiveId(projects[0].id);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Failed to load projects');
      setIsLoading(false);
    }
  }, []);

  const activeProject = projectsData.find(p => p.id === activeId) || projectsData[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-stone-500 dark:text-stone-400">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!activeProject || projectsData.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-stone-500 dark:text-stone-400">No projects to display.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 xl:gap-12">
      {/* COLUMN 1: Projects Selector Sidebar */}
      {/* On mobile: horizontal scrolling cards, On desktop: vertical list */}
      <div className="lg:col-span-4 flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 snap-x snap-mandatory no-scrollbar scroll-smooth justify-start">
        {projectsData.map((project) => (
          <div key={project.id} className="snap-center shrink-0 w-[290px] xs:w-[320px] lg:w-full">
            <Card
              id={project.id}
              title={project.title}
              description={project.tagline}
              isActive={activeId === project.id}
              onClicked={() => setActiveId(project.id)}
            />
          </div>
        ))}
      </div>

      {/* COLUMN 2 & COLUMN 3 Container (Animated details change by using key) */}
      <div 
        key={activeProject.id} 
        className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-8 animate-slide-up"
      >
        {/* COLUMN 2: Rich Details Sheet */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header info */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-primary-light font-outfit">
                Featured Case Study
              </span>
              <h2 className="text-2xl md:text-3xl font-black font-outfit text-stone-900 dark:text-white mt-1">
                {activeProject.title}
              </h2>
              <p className="text-stone-500 dark:text-stone-400 text-sm md:text-base font-medium mt-1 font-outfit">
                {activeProject.tagline}
              </p>
            </div>

            {/* Badges for Role & Timeline */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="glass border-stone-200 dark:border-stone-850 px-3 py-1.5 rounded-lg text-stone-700 dark:text-stone-300 font-semibold font-outfit flex items-center gap-1.5 shadow-sm">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {activeProject.role}
              </span>
              <span className="glass border-stone-200 dark:border-stone-850 px-3 py-1.5 rounded-lg text-stone-700 dark:text-stone-300 font-semibold font-outfit flex items-center gap-1.5 shadow-sm">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {activeProject.timeline}
              </span>
            </div>

            {/* Description paragraph */}
            <p className="text-stone-650 dark:text-stone-350 text-sm md:text-base leading-relaxed">
              {activeProject.description}
            </p>

            {/* Key Features */}
            <div className="space-y-2">
              <h4 className="text-stone-850 dark:text-stone-200 font-bold font-outfit text-sm tracking-wide uppercase">
                Key Accomplishments
              </h4>
              <ul className="space-y-2">
                {activeProject.features.map((feat, index) => (
                  <li key={index} className="flex items-start text-stone-600 dark:text-stone-400 text-xs md:text-sm">
                    <span className="mr-2 text-primary-light shrink-0 mt-0.5">
                      <svg className="w-4 h-4 fill-none stroke-current stroke-2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Pills */}
            <div className="space-y-2 pt-2">
              <h4 className="text-stone-850 dark:text-stone-200 font-bold font-outfit text-sm tracking-wide uppercase">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold px-2.5 py-1 rounded-md transition-all duration-300 hover:border-primary-light/50 hover:bg-primary-50 dark:hover:bg-primary-950/20 hover:text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Call-to-Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-stone-200/60 dark:border-stone-850/60 w-full">
            <a
              href={activeProject.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 max-w-[170px] inline-flex justify-center items-center gap-2 bg-primary dark:bg-primary-700 text-white font-semibold font-outfit text-sm px-4 py-3 rounded-xl shadow-md hover:bg-primary-dark dark:hover:bg-primary-650 hover:scale-[1.03] active:scale-95 transition-all duration-200"
            >
              <span>View Live Demo</span>
              <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            
            <a
              href={activeProject.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 max-w-[170px] inline-flex justify-center items-center gap-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold font-outfit text-sm px-4 py-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 hover:scale-[1.03] active:scale-95 transition-all duration-200"
            >
              <span>Source Code</span>
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* COLUMN 3: Media Carousel Display */}
        <div className="md:col-span-5 flex items-center">
          <div className="w-full">
            <ImageHolder
              label={activeProject.title}
              images={activeProject.images}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioProjects;