import { useState, useCallback, useRef } from 'react';
import { quizData as sourceData } from './data/quizData';
import Header from './components/Header';
import QuestionNav from './components/QuestionNav';
import QuizContainer from './components/QuizContainer';
import QuizControls from './components/QuizControls';
import ResultsScreen from './components/ResultsScreen';
import ShuffleModal from './components/ShuffleModal';
import Toast from './components/Toast';
import Footer from './components/Footer';

// Deep clone the source data so shuffles don't mutate the original
const cloneData = () => JSON.parse(JSON.stringify(sourceData));

function App() {
  const [quizData, setQuizData] = useState(cloneData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [revealState, setRevealState] = useState({});
  const [matchingSelections, setMatchingSelections] = useState({});
  const [selectedLeftItem, setSelectedLeftItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [autoRevealEnabled, setAutoRevealEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [toast, setToast] = useState({ show: false, on: true, message: '' });

  const shuffledLeftItemsRef = useRef({});

  const currentQuestion = quizData[currentQuestionIndex];

  // Dark mode toggle
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
    localStorage.setItem('darkMode', isDark);
  };

  // Auto reveal toggle
  const toggleAutoReveal = () => {
    const newVal = !autoRevealEnabled;
    setAutoRevealEnabled(newVal);
    showToast(newVal ? 'Auto Check is on' : 'Auto Check is off', newVal);
  };

  const showToast = (message, on) => {
    setToast({ show: true, on, message });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 2000);
  };

  // Try auto reveal after answering
  const tryAutoReveal = useCallback((qID, question, answers, selections) => {
    if (!autoRevealEnabled) return;
    if (question.type === 'matching') {
      const requiredPairs = Object.keys(question.matchData.correctPairs).length;
      const currentMatches = Object.keys(selections[qID] || {}).length;
      if (currentMatches >= requiredPairs) {
        setRevealState(prev => ({ ...prev, [qID]: true }));
      }
    } else if (question.type === 'multi') {
      const selected = answers[qID] || [];
      if (selected.length > 0 && selected.length === (question.correctIndices || []).length) {
        setRevealState(prev => ({ ...prev, [qID]: true }));
      }
    } else {
      if (answers[qID] !== undefined && answers[qID] !== null) {
        setRevealState(prev => ({ ...prev, [qID]: true }));
      }
    }
  }, [autoRevealEnabled]);

  // Select option (single choice)
  const selectOption = (index) => {
    if (!currentQuestion) return;
    const qID = currentQuestion.id;
    if (revealState[qID]) return;
    const newAnswers = { ...userAnswers, [qID]: index };
    setUserAnswers(newAnswers);
    tryAutoReveal(qID, currentQuestion, newAnswers, matchingSelections);
  };

  // Toggle multi option
  const toggleMultiOption = (index) => {
    if (!currentQuestion) return;
    const qID = currentQuestion.id;
    if (revealState[qID]) return;
    const current = userAnswers[qID] || [];
    const newSelection = current.includes(index)
      ? current.filter(i => i !== index)
      : [...current, index];
    const newAnswers = { ...userAnswers, [qID]: newSelection };
    setUserAnswers(newAnswers);
    tryAutoReveal(qID, currentQuestion, newAnswers, matchingSelections);
  };

  // Matching handlers
  const handleSelectLeftItem = (item) => {
    if (!currentQuestion) return;
    const qID = currentQuestion.id;
    if (revealState[qID]) return;
    const selections = matchingSelections[qID] || {};
    if (Object.keys(selections).includes(item)) return;
    setSelectedLeftItem(prev => prev === item ? null : item);
  };

  const handleDropZoneClick = (answer, matchedLeftItem) => {
    if (!currentQuestion) return;
    const qID = currentQuestion.id;
    if (revealState[qID]) return;

    if (matchedLeftItem) {
      const newSelections = { ...matchingSelections };
      const qSelections = { ...(newSelections[qID] || {}) };
      delete qSelections[matchedLeftItem];
      newSelections[qID] = qSelections;
      setMatchingSelections(newSelections);
      return;
    }

    if (!selectedLeftItem) return;

    const newSelections = { ...matchingSelections };
    const qSelections = { ...(newSelections[qID] || {}) };
    Object.keys(qSelections).forEach(key => { if (qSelections[key] === answer) delete qSelections[key]; });
    qSelections[selectedLeftItem] = answer;
    newSelections[qID] = qSelections;
    setMatchingSelections(newSelections);
    setSelectedLeftItem(null);
    tryAutoReveal(qID, currentQuestion, userAnswers, newSelections);
  };

  const handleDragStart = (e, item) => { e.dataTransfer.setData('text/plain', item); e.target.classList.add('dragging'); };
  const handleDragEnd = (e) => { e.target.classList.remove('dragging'); };
  const handleDragOver = (e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); };
  const handleDragLeave = (e) => { e.currentTarget.classList.remove('drag-over'); };
  const handleDrop = (e, answer) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (!currentQuestion) return;
    const qID = currentQuestion.id;
    if (revealState[qID]) return;
    const leftItem = e.dataTransfer.getData('text/plain');
    if (!leftItem) return;
    const newSelections = { ...matchingSelections };
    const qSelections = { ...(newSelections[qID] || {}) };
    Object.keys(qSelections).forEach(key => { if (qSelections[key] === answer) delete qSelections[key]; });
    qSelections[leftItem] = answer;
    newSelections[qID] = qSelections;
    setMatchingSelections(newSelections);
    setSelectedLeftItem(null);
    tryAutoReveal(qID, currentQuestion, userAnswers, newSelections);
  };

  // Navigation
  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedLeftItem(null);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedLeftItem(null);
    }
  };

  const goToQuestion = (idx) => {
    if (idx >= 0 && idx < quizData.length) {
      setCurrentQuestionIndex(idx);
      setSelectedLeftItem(null);
    }
  };

  const revealAnswer = () => {
    if (!currentQuestion) return;
    setRevealState(prev => ({ ...prev, [currentQuestion.id]: true }));
  };

  const resetCurrentQuestion = () => {
    if (!currentQuestion) return;
    const qID = currentQuestion.id;
    setUserAnswers(prev => ({ ...prev, [qID]: null }));
    setRevealState(prev => ({ ...prev, [qID]: false }));
    setMatchingSelections(prev => ({ ...prev, [qID]: {} }));
    setSelectedLeftItem(null);
  };

  // Shuffle
  const confirmShuffle = () => {
    const newData = [...quizData];
    for (let i = newData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newData[i], newData[j]] = [newData[j], newData[i]];
    }

    const newUserAnswers = { ...userAnswers };

    newData.forEach(q => {
      const qID = q.id;
      if (q.type === 'matching') {
        delete shuffledLeftItemsRef.current[qID];
        if (q.matchData?.leftItems) q.matchData = { ...q.matchData, leftItems: [...q.matchData.leftItems].sort(() => Math.random() - 0.5) };
        if (q.matchData?.rightItems) q.matchData = { ...q.matchData, rightItems: [...q.matchData.rightItems].sort(() => Math.random() - 0.5) };
        return;
      }
      if (!q.options || q.options.length < 2) return;

      let indices = q.options.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      if (q.type === 'multi') {
        const newCI = indices.map((oldIdx, newPos) => q.correctIndices.includes(oldIdx) ? newPos : -1).filter(i => i !== -1);
        if (newUserAnswers[qID] && Array.isArray(newUserAnswers[qID])) {
          newUserAnswers[qID] = indices.map((old, np) => newUserAnswers[qID].includes(old) ? np : -1).filter(i => i !== -1);
        }
        q.correctIndices = newCI;
      } else {
        const newCI = indices.indexOf(q.correctIndex);
        if (newUserAnswers[qID] !== undefined && newUserAnswers[qID] !== null && typeof newUserAnswers[qID] === 'number') {
          newUserAnswers[qID] = indices.indexOf(newUserAnswers[qID]);
        }
        q.correctIndex = newCI;
      }
      q.options = indices.map(i => sourceData.find(s => s.id === qID).options[i]);
    });

    setQuizData(newData);
    setUserAnswers(newUserAnswers);
    setCurrentQuestionIndex(0);
    setSelectedLeftItem(null);
    setShowModal(false);
  };

  // Results
  const getResults = () => {
    let correct = 0, answered = 0;
    const total = quizData.length;

    quizData.forEach(q => {
      const qID = q.id;
      if (q.type === 'matching') {
        const selections = matchingSelections[qID] || {};
        const correctPairs = q.matchData.correctPairs;
        let matchCorrect = 0;
        const matchTotal = Object.keys(correctPairs).length;
        for (let [left, right] of Object.entries(correctPairs)) { if (selections[left] === right) matchCorrect++; }
        if (matchCorrect === matchTotal) correct++;
        if (Object.keys(selections).length > 0) answered++;
      } else if (q.type === 'multi') {
        const selected = userAnswers[qID] || [];
        if ([...selected].sort().join(',') === [...(q.correctIndices || [])].sort().join(',')) correct++;
        if (selected.length > 0) answered++;
      } else {
        if (userAnswers[qID] === q.correctIndex) correct++;
        if (userAnswers[qID] !== undefined && userAnswers[qID] !== null) answered++;
      }
    });

    const percentage = Math.round((correct / total) * 100);
    const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F';
    return { correct, answered, total, percentage, grade, filterName: 'RA 9292 — Electronics Engineering Law of 2004' };
  };

  const reviewAnswers = () => {
    const newReveal = {};
    quizData.forEach(q => { newReveal[q.id] = true; });
    setRevealState(prev => ({ ...prev, ...newReveal }));
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setSelectedLeftItem(null);
  };

  const retakeQuiz = () => {
    const na = {}, nr = {}, nm = {};
    quizData.forEach(q => { na[q.id] = null; nr[q.id] = false; nm[q.id] = {}; });
    setUserAnswers(na);
    setRevealState(nr);
    setMatchingSelections(nm);
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setSelectedLeftItem(null);
  };

  // Question status helpers
  const getQuestionStatus = (q) => {
    const qID = q.id;
    if (q.type === 'matching') {
      const sel = matchingSelections[qID] || {};
      if (Object.keys(sel).length === 0) return 'unanswered';
      return Object.entries(q.matchData.correctPairs).every(([l, r]) => sel[l] === r) ? 'correct' : 'incorrect';
    } else if (q.type === 'multi') {
      const sel = userAnswers[qID] || [];
      if (sel.length === 0) return 'unanswered';
      return [...sel].sort().join(',') === [...(q.correctIndices || [])].sort().join(',') ? 'correct' : 'incorrect';
    } else {
      const sel = userAnswers[qID];
      if (sel === undefined || sel === null) return 'unanswered';
      return sel === q.correctIndex ? 'correct' : 'incorrect';
    }
  };

  const hasUserAnswered = (q) => {
    const qID = q.id;
    if (q.type === 'matching') return Object.keys(matchingSelections[qID] || {}).length > 0;
    if (q.type === 'multi') return (userAnswers[qID] || []).length > 0;
    return userAnswers[qID] !== undefined && userAnswers[qID] !== null;
  };

  const isReviewMode = quizData.length > 0 && quizData.every(q => revealState[q.id]);

  const getShuffledLeftItems = (qID, leftItems) => {
    if (!shuffledLeftItemsRef.current[qID]) {
      shuffledLeftItemsRef.current[qID] = [...leftItems].sort(() => Math.random() - 0.5);
    }
    return shuffledLeftItemsRef.current[qID];
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 min-h-screen flex flex-col transition-colors duration-300">
      <Toast toast={toast} />

      <Header
        totalQuestions={quizData.length}
        currentQuestionNum={currentQuestionIndex + 1}
        onToggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
        autoRevealEnabled={autoRevealEnabled}
        onToggleAutoReveal={toggleAutoReveal}
        showResults={showResults}
      />

      <main className="flex-grow p-2 sm:p-4">
        <div className="max-w-3xl mx-auto">
          {!showResults && (
            <QuestionNav
              questions={quizData}
              currentIndex={currentQuestionIndex}
              revealState={revealState}
              userAnswers={userAnswers}
              matchingSelections={matchingSelections}
              getQuestionStatus={getQuestionStatus}
              hasUserAnswered={hasUserAnswered}
              onGoToQuestion={goToQuestion}
              isReviewMode={isReviewMode}
            />
          )}

          {showResults ? (
            <ResultsScreen
              results={getResults()}
              onReview={reviewAnswers}
              onRetake={retakeQuiz}
            />
          ) : (
            <>
              <QuizContainer
                question={currentQuestion}
                questionIndex={currentQuestionIndex}
                totalQuestions={quizData.length}
                userAnswers={userAnswers}
                revealState={revealState}
                matchingSelections={matchingSelections}
                selectedLeftItem={selectedLeftItem}
                onSelectOption={selectOption}
                onToggleMultiOption={toggleMultiOption}
                onSelectLeftItem={handleSelectLeftItem}
                onDropZoneClick={handleDropZoneClick}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                getShuffledLeftItems={getShuffledLeftItems}
                isReviewMode={isReviewMode}
              />
              <QuizControls
                currentIndex={currentQuestionIndex}
                totalQuestions={quizData.length}
                currentQuestion={currentQuestion}
                revealState={revealState}
                isReviewMode={isReviewMode}
                onPrev={prevQuestion}
                onNext={nextQuestion}
                onReveal={revealAnswer}
                onReset={resetCurrentQuestion}
                onShuffle={() => setShowModal(true)}
                onRetake={retakeQuiz}
              />
            </>
          )}
        </div>
      </main>

      <Footer />
      <ShuffleModal show={showModal} onClose={() => setShowModal(false)} onConfirm={confirmShuffle} />
    </div>
  );
}

export default App;
