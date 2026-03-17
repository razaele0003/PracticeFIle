function QuizControls({
  currentIndex,
  totalQuestions,
  currentQuestion,
  revealState,
  isReviewMode,
  onPrev,
  onNext,
  onReveal,
  onReset,
  onShuffle,
  onRetake,
}) {
  if (!currentQuestion) return null;

  const qID = currentQuestion.id;
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isCurrentRevealed = revealState[qID];

  // Next button label and style
  const nextBtnContent = isLastQuestion ? (
    <><i className="fa-solid fa-paper-plane"></i> Submit</>
  ) : (
    <>Next <i className="fa-solid fa-arrow-right"></i></>
  );

  const nextBtnClass = isLastQuestion
    ? 'bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600'
    : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600';

  return (
    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 sticky bottom-2 sm:bottom-4 z-10">
      {/* Prev button - hidden on mobile */}
      <button
        onClick={onPrev}
        disabled={isFirstQuestion}
        className="hidden sm:flex shadow-md px-3 sm:px-5 py-2 sm:py-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-2 text-xs sm:text-sm"
      >
        <i className="fa-solid fa-arrow-left"></i> <span>Previous</span>
      </button>

      {/* Middle buttons */}
      <div className="flex gap-2 sm:gap-3 w-full sm:w-auto order-first sm:order-none">
        {!isReviewMode && !isCurrentRevealed && (
          <button
            onClick={onShuffle}
            className="shadow-md flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-2.5 bg-fuchsia-50 dark:bg-fuchsia-900/30 border border-fuchsia-200 dark:border-fuchsia-700 text-fuchsia-700 dark:text-fuchsia-400 rounded-lg font-medium hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/50 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
          >
            <i className="fa-solid fa-shuffle"></i> Shuffle
          </button>
        )}

        {!isReviewMode && (
          <button
            onClick={onReset}
            className={`shadow-md flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-2.5 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400 rounded-lg font-medium hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${isCurrentRevealed ? 'flex-1' : ''}`}
          >
            <i className="fa-solid fa-rotate-right"></i> Reset
          </button>
        )}

        {isReviewMode && (
          <button
            onClick={onRetake}
            className="shadow-md flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-2.5 bg-slate-200 dark:bg-slate-600 border border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
          >
            <i className="fa-solid fa-arrows-rotate"></i> Retake
          </button>
        )}

        {!isReviewMode && !isCurrentRevealed && (
          <button
            onClick={onReveal}
            className="shadow-md flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-2.5 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-400 rounded-lg font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
          >
            <i className="fa-solid fa-eye"></i> Reveal
          </button>
        )}
      </div>

      {/* Next button - hidden on mobile */}
      <button
        onClick={onNext}
        className={`hidden sm:flex shadow-md px-3 sm:px-5 py-2 sm:py-2.5 ${nextBtnClass} text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-2 text-xs sm:text-sm`}
      >
        {nextBtnContent}
      </button>

      {/* Mobile: Prev + Next row */}
      <div className="flex sm:hidden gap-2 w-full order-last">
        <button
          onClick={onPrev}
          disabled={isFirstQuestion}
          className="shadow-md flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-xs"
        >
          <i className="fa-solid fa-arrow-left"></i> Prev
        </button>
        <button
          onClick={onNext}
          className={`shadow-md flex-1 px-3 py-2 ${nextBtnClass} text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-xs`}
        >
          {nextBtnContent}
        </button>
      </div>
    </div>
  );
}

export default QuizControls;
