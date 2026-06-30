import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, addProject, updateProject, deleteProject, reorderProjects, type Project } from '../utils/projectData';

function AdminPage() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [input, setInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const handlePasswordChange = (value: string) => {
    setInput(value);
    setLoginError(false);
  };

  const handleLogin = () => {
    console.log('Input:', input);
    console.log('Correct password:', correctPassword);
    console.log('Match:', input === correctPassword);
    
    if (input === correctPassword) {
      setIsAuthenticated(true);
      setLoginError(false);
      setProjects(getProjects());
    } else {
      setLoginError(true);
    }
  };

  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    techStack: '',
    features: '',
    role: '',
    timeline: '',
    images: [] as string[],
    liveUrl: '',
    githubUrl: ''
  });

  // Apply dark mode theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      tagline: project.tagline,
      description: project.description,
      techStack: project.techStack.join(', '),
      features: project.features.join('\n'),
      role: project.role,
      timeline: project.timeline,
      images: project.images || [],
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl
    });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      tagline: '',
      description: '',
      techStack: '',
      features: '',
      role: '',
      timeline: '',
      images: [],
      liveUrl: '',
      githubUrl: ''
    });
    setIsAddingNew(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Get Cloudinary config from environment variables
    const cloudName = import.meta.env.VITE_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; // Create this in Cloudinary

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();
        
        if (data.secure_url) {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, data.secure_url]
          }));
        } else {
          console.error('Upload failed:', data);
          // Show error to user
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleMoveImage = (fromIndex: number, toIndex: number) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      return { ...prev, images: newImages };
    });
  };

  const handleSave = () => {
    const techStackArray = formData.techStack.split(',').map(t => t.trim()).filter(t => t);
    const featuresArray = formData.features.split('\n').map(f => f.trim()).filter(f => f);

    if (isAddingNew) {
      addProject({
        title: formData.title,
        tagline: formData.tagline,
        description: formData.description,
        techStack: techStackArray,
        features: featuresArray,
        role: formData.role,
        timeline: formData.timeline,
        images: formData.images,
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl
      });
      setProjects(getProjects());
      setIsAddingNew(false);
      setEditingProject(null);
    } else if (editingProject) {
      updateProject(editingProject.id, {
        title: formData.title,
        tagline: formData.tagline,
        description: formData.description,
        techStack: techStackArray,
        features: featuresArray,
        role: formData.role,
        timeline: formData.timeline,
        images: formData.images,
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl
      });
      setProjects(getProjects());
      setEditingProject(null);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
      setProjects(getProjects());
      if (editingProject?.id === id) {
        setEditingProject(null);
        setIsAddingNew(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingProject(null);
    setIsAddingNew(false);
    setFormData({
      title: '',
      tagline: '',
      description: '',
      techStack: '',
      features: '',
      role: '',
      timeline: '',
      images: [],
      liveUrl: '',
      githubUrl: ''
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newProjects = [...projects];
    const draggedItem = newProjects[draggedIndex];
    newProjects.splice(draggedIndex, 1);
    newProjects.splice(index, 0, draggedItem);

    setProjects(newProjects);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null) {
      reorderProjects(projects);
      setDraggedIndex(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 overflow-x-hidden transition-colors duration-500">
      
      {/* BACKGROUND DECORATIVE BLOBS */}
      <div className="absolute top-[10%] left-[-10%] w-[40vw] h-[40vw] max-w-[600px] rounded-full bg-primary-100/50 dark:bg-primary-950/10 blur-[80px] md:blur-[120px] animate-drift pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[35vw] h-[35vw] max-w-[500px] rounded-full bg-primary-50 dark:bg-primary-950/10 blur-[80px] md:blur-[120px] animate-drift-reverse pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[20%] w-[45vw] h-[45vw] max-w-[700px] rounded-full bg-stone-200/50 dark:bg-stone-900/10 blur-[100px] md:blur-[140px] animate-drift pointer-events-none z-0" />

      {/* STICKY GLASSMORPHIC HEADER */}
      <header className="sticky top-0 z-40 w-full glass shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="font-outfit text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-primary-dark to-primary-light dark:from-primary dark:to-primary-light bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              Kaleab.dev
            </span>
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-sm" />
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl glass border border-stone-200 dark:border-stone-850 flex items-center justify-center text-stone-700 dark:text-stone-300 hover:text-primary dark:hover:text-primary-light transition-all duration-300 hover:scale-105 active:scale-95 outline-none cursor-pointer"
              aria-label="Toggle theme mode"
            >
              {isDark ? (
                <svg className="w-5.5 h-5.5 stroke-current fill-none stroke-2 animate-pulse-subtle transition-transform duration-500 rotate-180" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-5.5 h-5.5 stroke-current fill-none stroke-2 transition-transform duration-500 rotate-0" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Home Link */}
            <Link 
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 bg-primary dark:bg-primary-700 text-white font-semibold font-outfit text-sm px-4 py-2.5 rounded-xl hover:bg-primary-dark dark:hover:bg-primary-650 hover:scale-105 transition-all active:scale-95 shadow-sm"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Password Authentication */}
      {!isAuthenticated && (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
          <div className="glass border-stone-200 dark:border-stone-850 p-8 rounded-2xl shadow-lg max-w-md w-full">
            <h2 className="font-outfit text-2xl font-black text-stone-900 dark:text-white mb-6 text-center">
              Admin Access
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type='password'
                placeholder='Enter admin password'
                value={input}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full bg-white dark:bg-stone-950 border border-stone-250 dark:border-stone-850 px-4 py-3 rounded-xl text-sm focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none transition-all"
              />
              {loginError && (
                <p className="text-red-600 dark:text-red-400 text-sm font-semibold">
                  Incorrect password. Please try again.
                </p>
              )}
              <button
                onClick={handleLogin}
                className="w-full bg-primary dark:bg-primary-700 text-white font-semibold font-outfit text-sm px-6 py-3 rounded-xl shadow-md hover:bg-primary-dark dark:hover:bg-primary-650 hover:scale-105 transition-all active:scale-95"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Dashboard */}
      {isAuthenticated && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-outfit text-3xl sm:text-4xl font-black text-stone-900 dark:text-white">
                Portfolio Management
              </h1>
              <p className="text-stone-600 dark:text-stone-400 text-sm mt-2">
                Add, edit, delete, and reorder your portfolio projects
              </p>
            </div>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 bg-primary dark:bg-primary-700 text-white font-semibold font-outfit text-sm px-6 py-3 rounded-xl shadow-md hover:bg-primary-dark dark:hover:bg-primary-650 hover:scale-105 transition-all active:scale-95"
            >
              <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add New Project
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project List */}
            <div className="lg:col-span-1">
              <div className="glass border-stone-200 dark:border-stone-850 rounded-2xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-stone-200 dark:border-stone-850">
                  <h3 className="font-outfit text-lg font-bold text-stone-900 dark:text-white">
                    Projects ({projects.length})
                  </h3>
                  <p className="text-stone-500 dark:text-stone-400 text-xs mt-1">
                    Drag to reorder
                  </p>
                </div>
                <div className="divide-y divide-stone-200 dark:divide-stone-850 max-h-[600px] overflow-y-auto">
                  {projects.map((project, index) => (
                    <div
                      key={project.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`p-4 cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors ${
                        editingProject?.id === project.id ? 'bg-primary-50 dark:bg-primary-950/30' : ''
                      } ${draggedIndex === index ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-outfit font-semibold text-stone-900 dark:text-white text-sm truncate">
                            {project.title}
                          </h4>
                          <p className="text-stone-500 dark:text-stone-400 text-xs mt-1 truncate">
                            {project.tagline}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleEdit(project)}
                            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:text-primary dark:hover:text-primary-light hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="p-8 text-center text-stone-500 dark:text-stone-400 text-sm">
                      No projects yet. Add your first project!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="lg:col-span-2">
              {(editingProject || isAddingNew) && (
                <div className="glass border-stone-200 dark:border-stone-850 rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-outfit text-xl font-bold text-stone-900 dark:text-white">
                      {isAddingNew ? 'Add New Project' : 'Edit Project'}
                    </h3>
                    <button
                      onClick={handleCancel}
                      className="p-2 rounded-lg text-stone-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      aria-label="Cancel"
                      title="Cancel"
                    >
                      <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700 dark:text-stone-350 uppercase tracking-wide">
                          Title *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          placeholder="Project Title"
                          className="w-full bg-white dark:bg-stone-950 border border-stone-250 dark:border-stone-850 px-4 py-2.5 rounded-xl text-sm focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700 dark:text-stone-350 uppercase tracking-wide">
                          Tagline *
                        </label>
                        <input
                          type="text"
                          value={formData.tagline}
                          onChange={(e) => handleInputChange('tagline', e.target.value)}
                          placeholder="Short tagline"
                          className="w-full bg-white dark:bg-stone-950 border border-stone-250 dark:border-stone-850 px-4 py-2.5 rounded-xl text-sm focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-350 uppercase tracking-wide">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Detailed project description"
                        rows={3}
                        className="w-full bg-white dark:bg-stone-950 border border-stone-250 dark:border-stone-850 px-4 py-2.5 rounded-xl text-sm focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700 dark:text-stone-350 uppercase tracking-wide">
                          Role *
                        </label>
                        <input
                          type="text"
                          value={formData.role}
                          onChange={(e) => handleInputChange('role', e.target.value)}
                          placeholder="Your role"
                          className="w-full bg-white dark:bg-stone-950 border border-stone-250 dark:border-stone-850 px-4 py-2.5 rounded-xl text-sm focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700 dark:text-stone-350 uppercase tracking-wide">
                          Timeline *
                        </label>
                        <input
                          type="text"
                          value={formData.timeline}
                          onChange={(e) => handleInputChange('timeline', e.target.value)}
                          placeholder="e.g., 2026 - Complete"
                          className="w-full bg-white dark:bg-stone-950 border border-stone-250 dark:border-stone-850 px-4 py-2.5 rounded-xl text-sm focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-350 uppercase tracking-wide">
                        Tech Stack (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.techStack}
                        onChange={(e) => handleInputChange('techStack', e.target.value)}
                        placeholder="React, TypeScript, Tailwind CSS"
                        className="w-full bg-white dark:bg-stone-950 border border-stone-250 dark:border-stone-850 px-4 py-2.5 rounded-xl text-sm focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-350 uppercase tracking-wide">
                        Key Features (one per line)
                      </label>
                      <textarea
                        value={formData.features}
                        onChange={(e) => handleInputChange('features', e.target.value)}
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                        rows={4}
                        className="w-full bg-white dark:bg-stone-950 border border-stone-250 dark:border-stone-850 px-4 py-2.5 rounded-xl text-sm focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-350 uppercase tracking-wide">
                        Project Images
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="w-full bg-white dark:bg-stone-950 border border-stone-250 dark:border-stone-850 px-4 py-2.5 rounded-xl text-sm focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none transition-all"
                      />
                      <p className="text-stone-500 dark:text-stone-400 text-xs mt-1">
                        Upload multiple images. They will be converted to base64 and stored.
                      </p>
                    </div>

                    {/* Image Preview Grid */}
                    {formData.images.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-700 dark:text-stone-350 uppercase tracking-wide">
                          Uploaded Images ({formData.images.length})
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {formData.images.map((image, index) => (
                            <div
                              key={index}
                              className="relative group aspect-video bg-stone-100 dark:bg-stone-900 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-850"
                            >
                              <img
                                src={image}
                                alt={`Project image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveImage(index, index - 1)}
                                    className="p-2 bg-white rounded-lg hover:bg-stone-200 transition-colors"
                                    title="Move left"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                                  title="Remove image"
                                >
                                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                                {index < formData.images.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveImage(index, index + 1)}
                                    className="p-2 bg-white rounded-lg hover:bg-stone-200 transition-colors"
                                    title="Move right"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                              <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                                {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700 dark:text-stone-350 uppercase tracking-wide">
                          Live URL
                        </label>
                        <input
                          type="url"
                          value={formData.liveUrl}
                          onChange={(e) => handleInputChange('liveUrl', e.target.value)}
                          placeholder="https://project-demo.com"
                          className="w-full bg-white dark:bg-stone-950 border border-stone-250 dark:border-stone-850 px-4 py-2.5 rounded-xl text-sm focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700 dark:text-stone-350 uppercase tracking-wide">
                          GitHub URL
                        </label>
                        <input
                          type="url"
                          value={formData.githubUrl}
                          onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                          placeholder="https://github.com/user/repo"
                          className="w-full bg-white dark:bg-stone-950 border border-stone-250 dark:border-stone-850 px-4 py-2.5 rounded-xl text-sm focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-stone-200 dark:border-stone-850">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-primary dark:bg-primary-700 text-white font-semibold font-outfit text-sm px-6 py-3 rounded-xl shadow-md hover:bg-primary-dark dark:hover:bg-primary-650 hover:scale-105 transition-all active:scale-95"
                    >
                      {isAddingNew ? 'Add Project' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold font-outfit text-sm rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!editingProject && !isAddingNew && (
                <div className="glass border-stone-200 dark:border-stone-850 rounded-2xl shadow-lg p-8 text-center">
                  <svg className="w-16 h-16 mx-auto text-stone-300 dark:text-stone-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="font-outfit text-xl font-bold text-stone-900 dark:text-white mb-2">
                    Select a Project
                  </h3>
                  <p className="text-stone-500 dark:text-stone-400 text-sm">
                    Click on a project from the list to edit it, or add a new project.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* FOOTER */}
      <footer className="bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-850 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <span className="font-outfit text-xl font-black text-stone-900 dark:text-white">
              Kaleab.dev
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          </div>

          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm font-medium">
            &copy; {new Date().getFullYear()} Kaleab Lemma. All rights reserved. Made with ❤️ & premium UX guidelines.
          </p>

          <div className="flex items-center gap-3">
            <Link 
              to="/"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all hover:scale-105"
              aria-label="Home Page"
            >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AdminPage;