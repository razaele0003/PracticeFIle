function Header({ totalQuestions, currentQuestionNum, onToggleDarkMode, darkMode, autoRevealEnabled, onToggleAutoReveal, showResults }) {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-20 transition-colors">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-2 flex justify-between items-center gap-2">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i className="fa-solid fa-scale-balanced text-blue-600 dark:text-blue-400"></i>
            <span>RA 9292</span>
            <span className="text-slate-400 dark:text-slate-500 font-normal text-[10px] sm:text-xs ml-1 hidden sm:inline">
              Electronics Engineering Law of 2004
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {!showResults && (
            <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 sm:px-3 py-0.5 rounded-full whitespace-nowrap">
              <span>{currentQuestionNum}</span> / <span>{totalQuestions}</span>
            </div>
          )}

          <button
            onClick={onToggleDarkMode}
            className="theme-toggle p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title="Toggle Dark Mode"
          >
            {darkMode
              ? <i className="fa-solid fa-sun text-yellow-400"></i>
              : <i className="fa-solid fa-moon text-slate-600"></i>
            }
          </button>

          <button
            onClick={onToggleAutoReveal}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title={`Auto Check (${autoRevealEnabled ? 'on' : 'off'})`}
          >
            <i className={`fa-solid fa-bolt ${autoRevealEnabled ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
