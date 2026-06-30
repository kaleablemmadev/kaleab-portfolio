import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PortfolioProjects from "../components/PortfolioProjects";
import emailjs from '@emailjs/browser';

function HomePage() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Contact form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formErrorMsg, setFormErrorMsg] = useState('');

  // Refs for scroll reveal observer
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_GMAIL_PUBLIC_KEY);
  }, []);

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

  // Scroll reveal observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const currentRefs = sectionRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formName.trim()) {
      setFormStatus('error');
      setFormErrorMsg('Please provide your name.');
      return;
    }
    if (!formEmail.trim() || !/\S+@\S+\.\S+/.test(formEmail)) {
      setFormStatus('error');
      setFormErrorMsg('Please provide a valid email address.');
      return;
    }
    if (formMessage.trim().length < 10) {
      setFormStatus('error');
      setFormErrorMsg('Message must be at least 10 characters long.');
      return;
    }

    setFormStatus('submitting');

    try {
      const templateParams = {
        from_name: formName,
        from_email: formEmail,
        message: formMessage,
        to_name: 'Kaleab',
        to_email: 'kaleab.lemma.dev@gmail.com',
      };

      await emailjs.send(
        import.meta.env.VITE_GMAIL_SERVICE_ID,
        import.meta.env.VITE_GMAIL_TEMPLATE_ID,
        templateParams
      );

      setFormStatus('success');
      setFormName('');
      setFormEmail('');
      setFormMessage('');
      setFormErrorMsg('');
    } catch (error) {
      console.error('EmailJS error:', error);
      setFormStatus('error');
      setFormErrorMsg('Failed to send message. Please try again later.');
    }
  };

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current = [...sectionRefs.current, el];
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

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="font-outfit text-sm font-semibold tracking-wide text-stone-600 dark:text-stone-300 hover:text-primary dark:hover:text-primary-light transition-colors duration-200">
              Home
            </a>
            <a href="#projects" className="font-outfit text-sm font-semibold tracking-wide text-stone-600 dark:text-stone-300 hover:text-primary dark:hover:text-primary-light transition-colors duration-200">
              Projects
            </a>
            <a href="#skills" className="font-outfit text-sm font-semibold tracking-wide text-stone-600 dark:text-stone-300 hover:text-primary dark:hover:text-primary-light transition-colors duration-200">
              Skills
            </a>
            <a href="#contact" className="font-outfit text-sm font-semibold tracking-wide text-stone-600 dark:text-stone-300 hover:text-primary dark:hover:text-primary-light transition-colors duration-200">
              Contact
            </a>
          </nav>

          {/* Actions: Light/Dark Mode + Mobile CTA */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl glass border border-stone-200 dark:border-stone-850 flex items-center justify-center text-stone-700 dark:text-stone-300 hover:text-primary dark:hover:text-primary-light transition-all duration-300 hover:scale-105 active:scale-95 outline-none cursor-pointer"
              aria-label="Toggle theme mode"
            >
              {isDark ? (
                /* Sun Icon with rotation */
                <svg className="w-5.5 h-5.5 stroke-current fill-none stroke-2 animate-pulse-subtle transition-transform duration-500 rotate-180" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                /* Moon Icon with rotation */
                <svg className="w-5.5 h-5.5 stroke-current fill-none stroke-2 transition-transform duration-500 rotate-0" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Quick Contact Button */}
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-1.5 bg-primary dark:bg-primary-700 text-white font-semibold font-outfit text-sm px-4 py-2.5 rounded-xl hover:bg-primary-dark dark:hover:bg-primary-650 hover:scale-105 transition-all active:scale-95 shadow-sm"
            >
              Hire Me
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section 
        id="home" 
        ref={addToRefs}
        className="reveal-on-scroll relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 flex flex-col items-center text-center z-10"
      >
        <span className="glass border-primary-100 dark:border-primary-950/40 text-primary dark:text-primary-light text-xs sm:text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-sm mb-6 animate-pulse-subtle">
          🚀 Available for freelance & full-time roles
        </span>

        <h1 className="font-outfit text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-stone-900 dark:text-white max-w-4xl leading-tight sm:leading-none">
          Building responsive web apps &{' '}
          <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent hover:brightness-110 transition-all duration-300">
            interactive mobile experiences
          </span>
        </h1>
              <p className="mt-6 text-stone-600 dark:text-stone-400 text-base sm:text-xl max-w-2xl leading-relaxed">
          Hi, I'm <strong className="text-stone-850 dark:text-white font-bold font-outfit">Kaleab Lemma Gebre</strong>. A frontend developer and technical writer who ships fast, documents everything, and learns in public. Four projects built in 14 days. Two articles published with 9.8/10 ratings. Currently expanding into backend development. I don't claim expertise I haven't earned — but I will earn it in public.
        </p>

        {/* CTA Actions */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#projects"
            className="bg-primary dark:bg-primary-700 text-white font-semibold font-outfit text-base px-8 py-4 rounded-xl shadow-md hover:bg-primary-dark dark:hover:bg-primary-650 hover:scale-[1.03] active:scale-95 transition-all duration-200"
          >
            Explore Case Studies
          </a>
          <a
            href="#contact"
            className="glass border-stone-250 dark:border-stone-850 text-stone-800 dark:text-stone-200 font-semibold font-outfit text-base px-8 py-4 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 hover:scale-[1.03] active:scale-95 transition-all duration-200"
          >
            Get in Touch
          </a>
        </div>

        {/* STATS OVERVIEW CARD (tilt look) */}
        <div className="mt-16 sm:mt-24 w-full max-w-4xl glass border-stone-200 dark:border-stone-850 p-6 sm:p-8 rounded-2xl md:rounded-3xl shadow-lg grid grid-cols-2 md:grid-cols-4 gap-6 divide-y-2 md:divide-y-0 md:divide-x-2 divide-stone-200/50 dark:divide-stone-800/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="pt-4 md:pt-0 flex flex-col items-center">
            <span className="font-outfit text-3xl sm:text-4xl font-extrabold text-primary dark:text-primary-light">14/14</span>
            <span className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm font-semibold tracking-wide uppercase mt-1">Daily Consistency</span>
          </div>
          <div className="pt-4 md:pt-0 flex flex-col items-center">
            <span className="font-outfit text-3xl sm:text-4xl font-extrabold text-primary dark:text-primary-light">55+</span>
            <span className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm font-semibold tracking-wide uppercase mt-1">Git Commits (14d)</span>
          </div>
          <div className="pt-4 md:pt-0 flex flex-col items-center">
            <span className="font-outfit text-3xl sm:text-4xl font-extrabold text-primary dark:text-primary-light">4</span>
            <span className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm font-semibold tracking-wide uppercase mt-1">Projects Shipped</span>
          </div>
          <div className="pt-4 md:pt-0 flex flex-col items-center">
            <span className="font-outfit text-3xl sm:text-4xl font-extrabold text-primary dark:text-primary-light">C2</span>
            <span className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm font-semibold tracking-wide uppercase mt-1">English Level</span>
          </div>
        </div>
      </section>

      {/* PORTFOLIO PROJECTS SECTION */}
      <section 
        id="projects" 
        ref={addToRefs}
        className="reveal-on-scroll max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-t border-stone-200/50 dark:border-stone-900/50 z-10"
      >
        <div className="mb-12 text-center lg:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-primary-light font-outfit">
            My Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit text-stone-900 dark:text-white mt-2">
            Featured Case Studies
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Select a project on the left to inspect its detailed specifications, technology stacks, key implementations, and screenshots.
          </p>
        </div>

        <PortfolioProjects />
      </section>

      {/* SKILLS SECTION */}
      <section 
        id="skills" 
        ref={addToRefs}
        className="reveal-on-scroll max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-t border-stone-200/50 dark:border-stone-900/50 z-10"
      >
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-primary-light font-outfit">
            Expertise
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit text-stone-900 dark:text-white mt-2">
            Technical Skills
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base mt-2 max-w-xl mx-auto leading-relaxed">
            The tools and frameworks I use to ship projects consistently. Four projects built in 14 days, with daily commits and documented progress.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Skill 1: Frontend */}
          <div className="glass border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 group">
            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="font-outfit text-lg font-bold text-stone-900 dark:text-white mt-4">Frontend & Languages</h3>
            <p className="text-stone-500 dark:text-stone-400 text-xs mt-2 leading-relaxed">
              Crafting responsive web workspaces, client forms, and animations with type safety.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {['TypeScript', 'JavaScript', 'React', 'Tailwind', 'HTML/CSS'].map(s => (
                <span key={s} className="bg-stone-100 dark:bg-stone-900 text-stone-750 dark:text-stone-300 text-[10px] font-bold px-2 py-0.5 rounded-md">{s}</span>
              ))}
            </div>
          </div>

          {/* Skill 2: Backend */}
          <div className="glass border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 group">
            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <h3 className="font-outfit text-lg font-bold text-stone-900 dark:text-white mt-4">Backend & Integration</h3>
            <p className="text-stone-500 dark:text-stone-400 text-xs mt-2 leading-relaxed">
              Integrating REST APIs and Google Sheets. Currently learning database design with Prisma and PostgreSQL.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {['REST APIs', 'Sheets API', 'PostgreSQL', 'FastAPI', 'Prisma'].map(s => (
                <span key={s} className="bg-stone-100 dark:bg-stone-900 text-stone-750 dark:text-stone-300 text-[10px] font-bold px-2 py-0.5 rounded-md">{s}</span>
              ))}
            </div>
          </div>

          {/* Skill 3: Mobile Development */}
          <div className="glass border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 group">
            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-outfit text-lg font-bold text-stone-900 dark:text-white mt-4">Mobile Development</h3>
            <p className="text-stone-500 dark:text-stone-400 text-xs mt-2 leading-relaxed">
              Building client mobile apps with local notifications and offline-first databases.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {['Flutter', 'Dart', 'Hive DB', 'Riverpod', 'Notifications'].map(s => (
                <span key={s} className="bg-stone-100 dark:bg-stone-900 text-stone-750 dark:text-stone-300 text-[10px] font-bold px-2 py-0.5 rounded-md">{s}</span>
              ))}
            </div>
          </div>

          {/* Skill 4: Technical Writing & Tools */}
          <div className="glass border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 group">
            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="font-outfit text-lg font-bold text-stone-900 dark:text-white mt-4">Writing & Figma Tools</h3>
            <p className="text-stone-500 dark:text-stone-400 text-xs mt-2 leading-relaxed">
              Publishing tutorials on Dev.to and parsing visual Figma flows to clean components.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {['Technical Writing', 'Git/GitHub', 'Figma', 'VS Code', 'Postman'].map(s => (
                <span key={s} className="bg-stone-100 dark:bg-stone-900 text-stone-750 dark:text-stone-300 text-[10px] font-bold px-2 py-0.5 rounded-md">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section 
        id="contact" 
        ref={addToRefs}
        className="reveal-on-scroll max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-t border-stone-200/50 dark:border-stone-900/50 z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Contact text */}
          <div className="lg:col-span-5 text-center lg:text-left space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary dark:text-primary-light font-outfit">
                Get In Touch
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit text-stone-900 dark:text-white mt-2">
                Let's Build Something
              </h2>
              <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base mt-3 leading-relaxed">
                Need a responsive landing page, a React component, or a technical article? I ship fast and communicate clearly.
              </p>
            </div>

            {/* Quick stats channels */}
            <div className="space-y-3 inline-block lg:block text-left">
              <div className="flex items-center space-x-3 text-stone-650 dark:text-stone-350">
                <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-primary">
                  <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold">kaleab.lemma.dev@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-stone-650 dark:text-stone-350">
                <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-primary">
                  <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold">+251 952 854 103</span>
              </div>
              <div className="flex items-center space-x-3 text-stone-650 dark:text-stone-350">
                <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-primary">
                  <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold">Addis Ababa University | Addis Ababa, Ethiopia</span>
              </div>
            </div>
          </div>

          {/* Contact form card */}
          <div className="lg:col-span-7">
            <div className="glass border-stone-200 dark:border-stone-850 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg relative overflow-hidden">
              
              {formStatus === 'success' ? (
                /* Success animation block */
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 flex items-center justify-center scale-110 shadow-sm animate-pulse-subtle">
                    <svg className="w-8 h-8 stroke-current fill-none stroke-2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="font-outfit text-2xl font-bold text-stone-900 dark:text-white">Message Transmitted!</h3>
                  <p className="text-stone-500 dark:text-stone-400 text-sm max-w-sm">
                    Thank you for reaching out. Your message has been queued. I will review and reply within 24 hours.
                  </p>
                  <button 
                    onClick={() => setFormStatus('idle')}
                    className="mt-4 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold font-outfit px-4 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                /* Normal form */
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-xs font-bold text-stone-700 dark:text-stone-350 uppercase tracking-wide">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name='name'
                        id="name"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-white dark:bg-stone-950 border border-stone-250 dark:border-stone-850 px-4 py-3 rounded-xl text-sm focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-stone-700 dark:text-stone-350 uppercase tracking-wide">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-white dark:bg-stone-950 border border-stone-250 dark:border-stone-850 px-4 py-3 rounded-xl text-sm focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-bold text-stone-700 dark:text-stone-350 uppercase tracking-wide">
                      Message details
                    </label>
                    <textarea
                      id="message"
                      name='message'
                      rows={4}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Hi, I would like to discuss a project..."
                      className="w-full bg-white dark:bg-stone-950 border border-stone-250 dark:border-stone-850 px-4 py-3 rounded-xl text-sm focus:border-primary dark:focus:border-primary-light focus:ring-1 focus:ring-primary dark:focus:ring-primary-light outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Error Notification Banner */}
                  {formStatus === 'error' && (
                    <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-250 dark:border-red-900/50 rounded-xl flex items-center gap-2 text-xs text-red-750 dark:text-red-400 font-semibold animate-shake">
                      <svg className="w-4 h-4 text-red-550 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>{formErrorMsg}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className={`w-full inline-flex justify-center items-center gap-2 bg-primary dark:bg-primary-700 text-white font-bold font-outfit text-sm px-6 py-3.5 rounded-xl shadow-md transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary
                      ${formStatus === 'submitting' 
                        ? 'opacity-80 cursor-not-allowed scale-[0.98]' 
                        : 'hover:bg-primary-dark dark:hover:bg-primary-650 hover:scale-[1.01] active:scale-95 cursor-pointer'
                      }
                    `}
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Transmitting Data...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

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
            &copy; {new Date().getFullYear()} Kaleab Lemma. All rights reserved. Made with ❤️ & careful attention to UX.
          </p>

          <div className="flex items-center gap-3">
            {/* GitHub */}
            <a 
              href="https://github.com/kaleablemmadev" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all hover:scale-105"
              aria-label="GitHub profile"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/kaleab-lemma-49b523416/" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all hover:scale-105"
              aria-label="LinkedIn profile"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            {/* X (Twitter) */}
            <a 
              href="https://x.com/kaleablemmadev" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all hover:scale-105"
              aria-label="X (Twitter) profile"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* Admin Page */}
            <Link 
              to="/admin"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all hover:scale-105"
              aria-label="Admin Page"
            >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;