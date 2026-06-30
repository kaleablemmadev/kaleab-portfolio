interface CardProps {
  id: number;
  title: string;
  description: string;
  isActive?: boolean;
  onClicked: () => void;
}

function Card({ id, title, description, isActive = false, onClicked }: CardProps) {
  return (
    <button
      onClick={onClicked}
      className={`relative flex flex-col justify-center w-full max-w-[320px] md:max-w-none text-left h-[100px] md:h-[110px] rounded-xl border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-primary
        ${
          isActive
            ? "bg-[#FFF2E6] dark:bg-primary-950/20 border-primary dark:border-primary-light glow-card-active translate-x-1"
            : "bg-white dark:bg-stone-900/40 border-stone-200 dark:border-stone-800/80 hover:bg-[#FFF2E6]/40 dark:hover:bg-stone-900/70 hover:-translate-y-0.5 hover:border-stone-300 dark:hover:border-stone-700"
        }
      `}
    >
      {/* Accent side pill */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl transition-all duration-300
          ${
            isActive 
              ? "bg-primary dark:bg-primary-light opacity-100" 
              : "bg-transparent group-hover:bg-stone-300 dark:group-hover:bg-stone-700 opacity-0 group-hover:opacity-100"
          }
        `}
      />

      <div className="flex flex-row items-center px-4 md:px-5">
        {/* Animated circle id */}
        <div
          className={`flex text-lg font-bold font-outfit w-10 h-10 md:w-11 md:h-11 rounded-full justify-center items-center transition-all duration-300
            ${
              isActive
                ? "bg-primary text-white scale-110 shadow-md ring-4 ring-primary-50 dark:ring-primary-950/40"
                : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 group-hover:bg-primary-100 dark:group-hover:bg-primary-950/30 group-hover:text-primary"
            }
          `}
        >
          {id}
        </div>
        
        <div className="ml-4 flex-1 min-w-0">
          <h3
            className={`font-outfit text-base md:text-lg font-bold tracking-tight transition-colors duration-300 truncate
              ${
                isActive 
                  ? "text-primary-dark dark:text-primary-light" 
                  : "text-stone-850 dark:text-stone-200 group-hover:text-stone-900 dark:group-hover:text-white"
              }
            `}
          >
            {title}
          </h3>
          <p className="text-stone-500 dark:text-stone-400 text-xs md:text-sm mt-0.5 truncate">
            {description}
          </p>
        </div>

        {/* Decorative arrow chevrons */}
        <div 
          className={`ml-2 text-primary opacity-0 transition-all duration-300 transform translate-x-[-8px]
            ${isActive ? "opacity-100 translate-x-0" : "group-hover:opacity-50 group-hover:translate-x-[-4px]"}
          `}
        >
          <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}

export default Card;