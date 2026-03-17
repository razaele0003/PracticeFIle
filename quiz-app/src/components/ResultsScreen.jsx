function ResultsScreen({ results, onReview, onRetake }) {
  const { correct, answered, total, percentage, grade, filterName } = results;
  const gradeColor = percentage >= 80 ? 'text-green-600 dark:text-green-400' : percentage >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';
  const barColor = percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 transition-colors">
      <div className="fade-in text-center py-6">
        <div className="mb-6">
          <i className={`fa-solid fa-trophy text-6xl ${gradeColor} mb-4`}></i>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Quiz Complete!</h2>
          <p className="text-slate-500 dark:text-slate-400">{filterName}</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 mb-6 inline-block">
          <div className={`text-6xl sm:text-7xl font-bold ${gradeColor} mb-2`}>{percentage}%</div>
          <div className={`text-2xl font-bold ${gradeColor} mb-4`}>Grade: {grade}</div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{correct}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{total - correct}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Incorrect</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-300">{total}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Total</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-4 overflow-hidden">
            <div className={`h-4 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${percentage}%` }}></div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{answered} of {total} questions answered</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onReview} className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
            <i className="fa-solid fa-magnifying-glass mr-2"></i>Review Answers
          </button>
          <button onClick={onRetake} className="px-6 py-3 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
            <i className="fa-solid fa-rotate-right mr-2"></i>Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultsScreen;
