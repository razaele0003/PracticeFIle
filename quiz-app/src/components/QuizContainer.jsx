function QuizContainer({
  question,
  questionIndex,
  totalQuestions,
  userAnswers,
  revealState,
  matchingSelections,
  selectedLeftItem,
  onSelectOption,
  onToggleMultiOption,
  onSelectLeftItem,
  onDropZoneClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  getShuffledLeftItems,
  isReviewMode,
}) {
  if (!question) return null;

  const qID = question.id;
  const isRevealed = revealState[qID];

  // Badge for question type
  const typeBadge = () => {
    if (question.type === 'matching') {
      return (
        <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded border border-purple-200 dark:border-purple-700">
          <i className="fa-solid fa-arrows-left-right mr-1"></i>Matching
        </span>
      );
    }
    if (question.type === 'multi') {
      return (
        <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded border border-amber-200 dark:border-amber-700">
          <i className="fa-solid fa-list-check mr-1"></i>Multiple Answer
        </span>
      );
    }
    return null;
  };

  // Review badge
  const reviewBadge = () => {
    if (!isReviewMode || !isRevealed) return null;
    return (
      <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded border border-blue-200 dark:border-blue-700">
        <i className="fa-solid fa-magnifying-glass mr-1"></i>Review Mode
      </span>
    );
  };

  // Render single choice options
  const renderSingleChoice = () => {
    return (
      <div className="space-y-3">
        {question.options.map((opt, index) => {
          const isSelected = userAnswers[qID] === index;
          const hasAnswered = userAnswers[qID] !== undefined && userAnswers[qID] !== null;

          let labelClass = "option-label w-full p-2.5 sm:p-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2.5";
          let icon = <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-500 flex-shrink-0"></div>;

          if (isSelected && !isRevealed) {
            labelClass = "option-label w-full p-2.5 sm:p-3 border-2 border-blue-500 bg-blue-50 dark:bg-transparent dark:border-blue-400 dark:shadow-[0_0_15px_rgba(96,165,250,0.4)] rounded-lg cursor-pointer flex items-center gap-2.5";
            icon = <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center"><div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div></div>;
          }

          if (isRevealed) {
            if (index === question.correctIndex) {
              if (hasAnswered) {
                labelClass = "option-label w-full p-3 border-2 rounded-lg flex items-center gap-2.5 correct-answer cursor-default";
                icon = <i className="fa-solid fa-circle-check text-green-600 text-lg"></i>;
              } else {
                labelClass = "option-label w-full p-3 border-2 border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-900/30 rounded-lg flex items-center gap-2.5 cursor-default";
                icon = <i className="fa-solid fa-triangle-exclamation text-amber-500 text-lg"></i>;
              }
            } else if (isSelected && index !== question.correctIndex) {
              labelClass = "option-label w-full p-3 border-2 rounded-lg flex items-center gap-2.5 incorrect-answer cursor-default";
              icon = <i className="fa-solid fa-circle-xmark text-red-500 text-lg"></i>;
            } else {
              labelClass += " opacity-60 cursor-default";
            }
          }

          return (
            <label key={index} className={labelClass} onClick={() => !isRevealed && onSelectOption(index)}>
              {icon}
              <span className="text-slate-700 dark:text-slate-200 font-medium text-[13px] sm:text-sm">{opt}</span>
            </label>
          );
        })}
      </div>
    );
  };

  // Render multi choice options
  const renderMultiChoice = () => {
    const selectedAnswers = userAnswers[qID] || [];

    return (
      <div className="space-y-3">
        {question.options.map((opt, index) => {
          const isSelected = selectedAnswers.includes(index);
          const isCorrect = (question.correctIndices || []).includes(index);

          let labelClass = "option-label w-full p-2.5 sm:p-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2.5";
          let icon = <div className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-500 flex-shrink-0"></div>;

          if (isSelected && !isRevealed) {
            labelClass = "option-label w-full p-2.5 sm:p-3 border-2 border-blue-500 bg-blue-50 dark:bg-transparent dark:border-blue-400 dark:shadow-[0_0_15px_rgba(96,165,250,0.4)] rounded-lg cursor-pointer flex items-center gap-2.5";
            icon = <div className="w-5 h-5 rounded border-2 border-blue-500 bg-blue-500 flex items-center justify-center"><i className="fa-solid fa-check text-white text-xs"></i></div>;
          }

          if (isRevealed) {
            if (isSelected && isCorrect) {
              labelClass = "option-label w-full p-3 border-2 rounded-lg flex items-center gap-2.5 correct-answer cursor-default";
              icon = <i className="fa-solid fa-circle-check text-green-600 text-lg"></i>;
            } else if (isSelected && !isCorrect) {
              labelClass = "option-label w-full p-3 border-2 rounded-lg flex items-center gap-2.5 incorrect-answer cursor-default";
              icon = <i className="fa-solid fa-circle-xmark text-red-500 text-lg"></i>;
            } else if (!isSelected && isCorrect) {
              labelClass = "option-label w-full p-3 border-2 border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-900/30 rounded-lg flex items-center gap-2.5 cursor-default";
              icon = <i className="fa-solid fa-triangle-exclamation text-amber-500 text-lg"></i>;
            } else {
              labelClass += " opacity-60 cursor-default";
            }
          }

          return (
            <label key={index} className={labelClass} onClick={() => !isRevealed && onToggleMultiOption(index)}>
              {icon}
              <span className="text-slate-700 dark:text-slate-200 font-medium text-[13px] sm:text-sm">{opt}</span>
            </label>
          );
        })}
      </div>
    );
  };

  // Render matching question
  const renderMatching = () => {
    const selections = matchingSelections[qID] || {};
    const usedLeftItems = Object.keys(selections);
    const requiredPairs = Object.keys(question.matchData.correctPairs).length;
    const currentMatches = Object.keys(selections).length;
    const isComplete = currentMatches >= requiredPairs;

    const shuffledLeftItems = getShuffledLeftItems(qID, question.matchData.leftItems);

    return (
      <>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left column - Items */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                <i className="fa-solid fa-hand-pointer mr-2"></i>Items (Tap or Drag)
              </h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${isComplete ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400'}`}>
                <i className={`fa-solid ${isComplete ? 'fa-check-circle' : 'fa-link'} mr-1`}></i>
                {currentMatches}/{requiredPairs} matched
              </span>
            </div>
            {shuffledLeftItems.map((item) => {
              const isUsed = usedLeftItems.includes(item);
              const isSelectedLeft = selectedLeftItem === item;

              let dragCls = 'drag-item p-1.5 sm:p-2 border-2 rounded-lg bg-white dark:bg-slate-700 dark:text-slate-200 text-xs sm:text-sm cursor-pointer transition-all';
              if (isUsed) {
                dragCls += ' used border-slate-200 dark:border-slate-600';
              } else if (isSelectedLeft) {
                dragCls += ' ring-2 ring-blue-500 border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30';
              } else {
                dragCls += ' border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500';
              }

              return (
                <div
                  key={item}
                  className={dragCls}
                  draggable={!isUsed && !isRevealed}
                  onClick={() => onSelectLeftItem(item)}
                  onDragStart={(e) => onDragStart(e, item)}
                  onDragEnd={onDragEnd}
                >
                  <i className={`fa-solid ${isSelectedLeft ? 'fa-circle-check text-blue-500' : 'fa-grip-vertical text-slate-400 dark:text-slate-500'} mr-2`}></i>
                  {item}
                  {isUsed && <i className="fa-solid fa-check ml-2 text-blue-500"></i>}
                  {isSelectedLeft && <span className="ml-auto text-xs text-blue-500 font-medium">Selected</span>}
                </div>
              );
            })}
          </div>

          {/* Right column - Drop zones */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="font-semibold text-slate-600 dark:text-slate-400 mb-2 text-sm sm:text-base">
              <i className="fa-solid fa-bullseye mr-2"></i>Answers (Tap to Match)
            </h3>
            {question.matchData.rightItems.map((answer) => {
              const matchedLeftItem = Object.keys(selections).find(key => selections[key] === answer);
              const correctLeftItem = Object.keys(question.matchData.correctPairs).find(key => question.matchData.correctPairs[key] === answer);
              const isCorrectMatch = isRevealed && matchedLeftItem && matchedLeftItem === correctLeftItem;
              const isIncorrect = isRevealed && matchedLeftItem && matchedLeftItem !== correctLeftItem;

              let dropCls = 'drop-zone p-1.5 sm:p-2.5 rounded-lg text-xs sm:text-sm flex flex-col gap-1 cursor-pointer transition-all';
              if (matchedLeftItem) dropCls += ' filled';
              if (isCorrectMatch) dropCls += ' correct';
              if (isIncorrect) dropCls += ' incorrect';

              return (
                <div
                  key={answer}
                  className={dropCls}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => onDrop(e, answer)}
                  onClick={() => onDropZoneClick(answer, matchedLeftItem || null)}
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${matchedLeftItem ? (isCorrectMatch ? 'text-green-700 dark:text-green-400' : isIncorrect ? 'text-red-600 dark:text-red-400' : 'text-blue-700 dark:text-blue-400') : 'text-slate-400 dark:text-slate-500 italic'}`}>
                      {matchedLeftItem || (selectedLeftItem ? 'Tap here to match' : 'Select an item first')}
                    </span>
                    {isCorrectMatch && <i className="fa-solid fa-check text-green-600"></i>}
                    {isIncorrect && <i className="fa-solid fa-xmark text-red-500"></i>}
                    <span className="match-arrow dark:text-slate-400 ml-auto"><i className="fa-solid fa-arrow-right"></i></span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-snug">{answer}</div>
                  {isRevealed && isIncorrect && correctLeftItem && (
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1 bg-green-50 dark:bg-green-900/30 p-1 rounded">
                      <i className="fa-solid fa-check mr-1"></i>Correct: <strong>{correctLeftItem}</strong>
                    </div>
                  )}
                  {isRevealed && !matchedLeftItem && correctLeftItem && (
                    <div className="text-xs text-amber-600 dark:text-amber-400 mt-1 bg-amber-50 dark:bg-amber-900/30 p-1 rounded">
                      <i className="fa-solid fa-triangle-exclamation mr-1"></i>Answer: <strong>{correctLeftItem}</strong>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-4">
          <i className="fa-solid fa-lightbulb mr-1 text-amber-500"></i>
          <strong>Tap mode:</strong> Tap an item to select it, then tap an answer to match. <strong>Drag mode:</strong> Drag items directly to answers. Tap a matched slot to remove.
        </p>
      </>
    );
  };

  // Explanation
  const renderExplanation = () => {
    if (!isRevealed || !question.explanation) return null;
    return (
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-blue-800 dark:text-blue-300 text-sm sm:text-base">
          <i className="fa-solid fa-lightbulb text-blue-600 mr-2"></i>
          <span dangerouslySetInnerHTML={{ __html: question.explanation }}></span>
        </p>
      </div>
    );
  };

  // Review legend
  const renderReviewLegend = () => {
    if (!isReviewMode || !isRevealed) return null;
    return (
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400 justify-center">
        <span className="flex items-center gap-1"><i className="fa-solid fa-circle-check text-green-600"></i> Correct</span>
        <span className="flex items-center gap-1"><i className="fa-solid fa-circle-xmark text-red-500"></i> Incorrect</span>
        <span className="flex items-center gap-1"><i className="fa-solid fa-triangle-exclamation text-amber-500"></i> Missed</span>
      </div>
    );
  };

  // Render content based on question type
  const renderContent = () => {
    if (question.type === 'matching') return renderMatching();
    if (question.type === 'multi') return renderMultiChoice();
    return renderSingleChoice();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-3 sm:p-5 relative overflow-hidden min-h-[250px] sm:min-h-[300px] transition-colors">
      <div className="fade-in" key={qID}>
        <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
          <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded border border-blue-200 dark:border-blue-700">
            Q{questionIndex + 1}/{totalQuestions}
          </span>

          {typeBadge()}
          {reviewBadge()}
        </div>

        <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 sm:mb-4 leading-snug">
          {question.question}
        </h2>

        {renderContent()}
        {renderExplanation()}
        {renderReviewLegend()}
      </div>
    </div>
  );
}

export default QuizContainer;
