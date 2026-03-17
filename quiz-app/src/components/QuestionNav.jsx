import { useState } from 'react';

function QuestionNav({ questions, currentIndex, revealState, userAnswers, matchingSelections, getQuestionStatus, hasUserAnswered, onGoToQuestion, isReviewMode }) {
  const [open, setOpen] = useState(false);
  const progressPercent = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const getDotClasses = (q, idx) => {
    const qID = q.id;
    const isCurrent = idx === currentIndex;
    let classes = 'w-7 h-7 rounded-full text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center ';

    if (isCurrent) {
      classes += 'ring-2 ring-offset-1 ring-blue-500 dark:ring-offset-slate-800 ';
    }

    if (isReviewMode && revealState[qID]) {
      const status = getQuestionStatus(q);
      if (status === 'correct') classes += 'bg-green-500 dark:bg-green-600 text-white';
      else if (status === 'incorrect') classes += 'bg-red-500 dark:bg-red-600 text-white';
      else classes += 'bg-amber-400 dark:bg-amber-500 text-white';
    } else {
      const answered = hasUserAnswered(q);
      if (answered) classes += 'bg-blue-500 dark:bg-blue-600 text-white';
      else classes += 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500';
    }

    return classes;
  };

  const answeredCount = questions.filter(q => hasUserAnswered(q)).length;

  return (
    <div className="mb-4 sm:mb-5">
      {/* Toggle bar — always visible */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center gap-3 group mb-1"
        title={open ? 'Hide question navigator' : 'Show question navigator'}
      >
        {/* Progress bar */}
        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Stats + chevron */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
            {answeredCount}/{questions.length}
          </span>
          <span className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 text-xs ${open ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {/* Collapsible number grid */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm overflow-y-auto max-h-[380px]">
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
      </div>
    </div>
  );
}

export default QuestionNav;
