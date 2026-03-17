function QuestionNav({ questions, currentIndex, revealState, userAnswers, matchingSelections, getQuestionStatus, hasUserAnswered, onGoToQuestion, isReviewMode }) {
  const progressPercent = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const getDotClasses = (q, idx) => {
    const qID = q.id;
    const isCurrent = idx === currentIndex;
    let classes = 'w-6 h-6 sm:w-7 sm:h-7 rounded-full text-[10px] sm:text-xs font-bold transition-all cursor-pointer ';

    if (isCurrent) {
      classes += 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-900 ';
    }

    if (isReviewMode && revealState[qID]) {
      const status = getQuestionStatus(q);
      if (status === 'correct') {
        classes += 'bg-green-500 dark:bg-green-600 text-white';
      } else if (status === 'incorrect') {
        classes += 'bg-red-500 dark:bg-red-600 text-white';
      } else {
        classes += 'bg-amber-400 dark:bg-amber-500 text-white';
      }
    } else {
      const answered = hasUserAnswered(q);
      if (answered) {
        classes += 'bg-blue-500 dark:bg-blue-600 text-white';
      } else {
        classes += 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500';
      }
    }

    return classes;
  };

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 flex-grow">
          <div
            className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 justify-center">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => onGoToQuestion(idx)}
            className={getDotClasses(q, idx)}
            title={`Question ${idx + 1}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuestionNav;
