import profileImage from '../assets/anton.jpg';

function Header({
  questionSets,
  activeSetKey,
  onChangeSet,
  totalQuestions,
  currentQuestionNum,
  onToggleDarkMode,
  darkMode,
  autoRevealEnabled,
  onToggleAutoReveal,
  gestureModeEnabled,
  onToggleGestureMode,
  showResults,
}) {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-20 transition-colors border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-2 flex items-center gap-2">

        {/* Brand name */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-blue-500/20 dark:border-blue-400/20 flex-shrink-0 shadow-sm">
            <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-800 dark:text-white whitespace-nowrap">BombitzTheBomb</span>
        </div>

        {/* Set filter dropdown */}
        <div className="flex-1 min-w-0">
          <select
            id="set-filter"
            value={activeSetKey}
            onChange={e => onChangeSet(e.target.value)}
            className="w-full text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-lg px-2 sm:px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
          >
            {questionSets?.map(set => (
              <option key={set.key} value={set.key}>
                {set.key === 'all'
                  ? `⚡ All Questions (${set.questions.length})`
                  : `${set.label} (${set.questions.length})`}
              </option>
            ))}
          </select>
        </div>

        {/* Right-side controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {!showResults && (
            <div className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full whitespace-nowrap border border-slate-200 dark:border-slate-600">
              {currentQuestionNum} / {totalQuestions}
            </div>
          )}

          <button
            onClick={onToggleDarkMode}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600"
            title="Toggle Dark Mode"
          >
            {darkMode
              ? <i className="fa-solid fa-sun text-yellow-400 text-sm"></i>
              : <i className="fa-solid fa-moon text-slate-500 text-sm"></i>
            }
          </button>

          <button
            onClick={onToggleAutoReveal}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors border ${
              autoRevealEnabled
                ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700'
                : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
            title={`Auto Check (${autoRevealEnabled ? 'on' : 'off'})`}
          >
            <i className={`fa-solid fa-bolt text-sm ${autoRevealEnabled ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'}`}></i>
          </button>

          <button
            onClick={onToggleGestureMode}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors border ${
              gestureModeEnabled
                ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700'
                : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
            title={`Gesture Mode (${gestureModeEnabled ? 'on' : 'off'})`}
          >
            <i className={`fa-solid fa-hand text-sm ${gestureModeEnabled ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}></i>
          </button>
        </div>

      </div>
    </header>
  );
}

export default Header;
