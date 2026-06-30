export interface Project {
  id: number;
  title: string;
  tagline: string;
  description: string;
  techStack: string[];
  features: string[];
  role: string;
  timeline: string;
  images: string[];
  liveUrl: string;
  githubUrl: string;
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Firecourse Registration",
    tagline: "Amharic Form System & Google Sheets API Integration",
    description: "A production-ready client registration system featuring a localized Amharic user interface, custom conditional forms, and real-time data storage via Google Sheets. Deployed for client use and processed registrations for over 500+ participants.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Google Sheets API", "Vite", "PDF Viewer"],
    features: [
      "Client-side conditional rendering logic for localized form fields",
      "Seamless integration with Google Sheets API for serverless data storage",
      "In-app dynamic PDF rendering and receipt downloads for participants",
      "Robust validation checking preventing duplicate registration submissions"
    ],
    role: "Frontend Developer",
    timeline: "2026 - Complete",
    images: [
      "src/assets/images/project-image-placeholder-landscape.jpg"
    ],
    liveUrl: "https://firecourse.vercel.app/",
    githubUrl: "https://github.com/kaleablemmadev/kaleab-dev-portfolio/blob/main/02_CODING_PORTFOLIO/firecourse"
  },
  {
    id: 2,
    title: "Weather Analytics Dashboard",
    tagline: "Dual-API Chaining & Real-Time Forecasts",
    description: "A sleek, responsive dashboard providing geocoded search and detailed real-time weather analytics. Integrates dual API endpoints in a serial promise chain to fetch geocoordinates and map local weather configurations.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Vite", "WeatherAPI", "API-Ninjas"],
    features: [
      "API Chaining: Geocodes user inputs via API-Ninjas then queries WeatherAPI",
      "Active loading skeletons and comprehensive error boundary handling",
      "Strict TypeScript interfaces typing all upstream API JSON payloads",
      "Fully responsive weather grid layout (Chance of Rain and temperature metrics)"
    ],
    role: "Frontend Engineer",
    timeline: "2026 - Live",
    images: [
      "src/assets/images/project1_dashboard.png",
      "src/assets/images/project-image-placeholder-landscape.jpg"
    ],
    liveUrl: "https://weather-dashboard-v2-omega.vercel.app/",
    githubUrl: "https://github.com/kaleablemmadev/kaleab-dev-portfolio/tree/main/02_CODING_PORTFOLIO/weather-dashboard"
  },
  {
    id: 3,
    title: "Misol Mobile App",
    tagline: "Offline-First Calendar & Reminders client application",
    description: "A mobile client application designed for reminders and calendar organization. Uses Hive for lightning-fast offline-first replication and Riverpod for clean, reactive unidirectional state flows.",
    techStack: ["Flutter", "Dart", "Hive DB", "Riverpod", "Local Notifications", "Figma"],
    features: [
      "Offline-first sync database architecture powered by local Hive containers",
      "Custom calendar scheduling system with interactive time-blocks",
      "Background local notifications alert system configured for iOS/Android",
      "Sleek dark UI built directly from Figma designs under supervised AI flows"
    ],
    role: "Flutter Mobile Developer",
    timeline: "2026 - 90% Complete",
    images: [
      "src/assets/images/project3_chat.png",
      "src/assets/images/project-image-placeholder-landscape.jpg"
    ],
    liveUrl: "#misol-apk",
    githubUrl: "https://github.com/kaleablemmadev"
  }
];

const STORAGE_KEY = 'portfolio_projects';

export const getProjects = (): Project[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with default projects if none exist
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
    return DEFAULT_PROJECTS;
  } catch (error) {
    console.error('Error reading projects from localStorage:', error);
    return DEFAULT_PROJECTS;
  }
};

export const saveProjects = (projects: Project[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects to localStorage:', error);
  }
};

export const addProject = (project: Omit<Project, 'id'>): Project => {
  const projects = getProjects();
  const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
  const newProject = { ...project, id: newId };
  const updatedProjects = [...projects, newProject];
  saveProjects(updatedProjects);
  return newProject;
};

export const updateProject = (id: number, updates: Partial<Project>): Project | null => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  const updatedProjects = [...projects];
  updatedProjects[index] = { ...updatedProjects[index], ...updates };
  saveProjects(updatedProjects);
  return updatedProjects[index];
};

export const deleteProject = (id: number): boolean => {
  const projects = getProjects();
  const filteredProjects = projects.filter(p => p.id !== id);
  if (filteredProjects.length === projects.length) return false;
  saveProjects(filteredProjects);
  return true;
};

export const reorderProjects = (projects: Project[]): void => {
  saveProjects(projects);
};

export const resetToDefaults = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
};
