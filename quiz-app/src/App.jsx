import { useState, useCallback, useRef } from 'react';
import { allQuestions, QUESTION_SETS } from './data/allQuestions';
import Header from './components/Header';
import QuestionNav from './components/QuestionNav';
import QuizContainer from './components/QuizContainer';
import QuizControls from './components/QuizControls';
import ResultsScreen from './components/ResultsScreen';
import ShuffleModal from './components/ShuffleModal';
import Toast from './components/Toast';
import Footer from './components/Footer';

const cloneQuestions = (arr) => JSON.parse(JSON.stringify(arr));

function App() {
  const [activeSetKey, setActiveSetKey] = useState('all');
  const [quizData, setQuizData] = useState(() => cloneQuestions(allQuestions));
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

  // ── Set filter ──────────────────────────────────────────────────────────────
  const changeSet = (key) => {
    const found = QUESTION_SETS.find(s => s.key === key);
    if (!found) return;
    setActiveSetKey(key);
    setQuizData(cloneQuestions(found.questions));
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setRevealState({});
    setMatchingSelections({});
    setSelectedLeftItem(null);
    setShowResults(false);
    shuffledLeftItemsRef.current = {};
  };

  // ── Dark mode / Auto-reveal ─────────────────────────────────────────────────
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  };

  const toggleAutoReveal = () => {
    const newVal = !autoRevealEnabled;
    setAutoRevealEnabled(newVal);
    showToast(newVal ? 'Auto Check is on' : 'Auto Check is off', newVal);
  };

  const showToast = (message, on) => {
    setToast({ show: true, on, message });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 2000);
  };

  // ── Auto-reveal logic ───────────────────────────────────────────────────────
  const tryAutoReveal = useCallback((qID, question, answers, selections) => {
    if (!autoRevealEnabled) return;
    if (question.type === 'matching') {
      const required = Object.keys(question.matchData.correctPairs).length;
      if (Object.keys(selections[qID] || {}).length >= required)
        setRevealState(prev => ({ ...prev, [qID]: true }));
    } else if (question.type === 'multi') {
      const sel = answers[qID] || [];
      if (sel.length > 0 && sel.length === (question.correctIndices || []).length)
        setRevealState(prev => ({ ...prev, [qID]: true }));
    } else {
      if (answers[qID] !== undefined && answers[qID] !== null)
        setRevealState(prev => ({ ...prev, [qID]: true }));
    }
  }, [autoRevealEnabled]);

  // ── Answer handlers ─────────────────────────────────────────────────────────
  const selectOption = (index) => {
    if (!currentQuestion || revealState[currentQuestion.id]) return;
    const qID = currentQuestion.id;
    const newAnswers = { ...userAnswers, [qID]: index };
    setUserAnswers(newAnswers);
    tryAutoReveal(qID, currentQuestion, newAnswers, matchingSelections);
  };

  const toggleMultiOption = (index) => {
    if (!currentQuestion || revealState[currentQuestion.id]) return;
    const qID = currentQuestion.id;
    const current = userAnswers[qID] || [];
    const newSel = current.includes(index) ? current.filter(i => i !== index) : [...current, index];
    const newAnswers = { ...userAnswers, [qID]: newSel };
    setUserAnswers(newAnswers);
    tryAutoReveal(qID, currentQuestion, newAnswers, matchingSelections);
  };

  // ── Matching handlers ───────────────────────────────────────────────────────
  const handleSelectLeftItem = (item) => {
    if (!currentQuestion || revealState[currentQuestion.id]) return;
    const qID = currentQuestion.id;
    const sel = matchingSelections[qID] || {};
    if (Object.keys(sel).includes(item)) return;
    setSelectedLeftItem(prev => prev === item ? null : item);
  };

  const handleDropZoneClick = (answer, matchedLeftItem) => {
    if (!currentQuestion || revealState[currentQuestion.id]) return;
    const qID = currentQuestion.id;
    if (matchedLeftItem) {
      const s = { ...matchingSelections, [qID]: { ...(matchingSelections[qID] || {}) } };
      delete s[qID][matchedLeftItem];
      setMatchingSelections(s);
      return;
    }
    if (!selectedLeftItem) return;
    const s = { ...matchingSelections };
    const q = { ...(s[qID] || {}) };
    Object.keys(q).forEach(k => { if (q[k] === answer) delete q[k]; });
    q[selectedLeftItem] = answer;
    s[qID] = q;
    setMatchingSelections(s);
    setSelectedLeftItem(null);
    tryAutoReveal(qID, currentQuestion, userAnswers, s);
  };

  const handleDragStart = (e, item) => { e.dataTransfer.setData('text/plain', item); e.target.classList.add('dragging'); };
  const handleDragEnd = (e) => { e.target.classList.remove('dragging'); };
  const handleDragOver = (e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); };
  const handleDragLeave = (e) => { e.currentTarget.classList.remove('drag-over'); };
  const handleDrop = (e, answer) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (!currentQuestion || revealState[currentQuestion.id]) return;
    const qID = currentQuestion.id;
    const leftItem = e.dataTransfer.getData('text/plain');
    if (!leftItem) return;
    const s = { ...matchingSelections };
    const q = { ...(s[qID] || {}) };
    Object.keys(q).forEach(k => { if (q[k] === answer) delete q[k]; });
    q[leftItem] = answer;
    s[qID] = q;
    setMatchingSelections(s);
    setSelectedLeftItem(null);
    tryAutoReveal(qID, currentQuestion, userAnswers, s);
  };

  // ── Navigation ──────────────────────────────────────────────────────────────
  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedLeftItem(null);
    } else setShowResults(true);
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

  // ── Shuffle ─────────────────────────────────────────────────────────────────
  const confirmShuffle = () => {
    const newData = [...quizData];
    for (let i = newData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newData[i], newData[j]] = [newData[j], newData[i]];
    }
    const newUserAnswers = { ...userAnswers };

    // Get the original question pool for the active set (to restore option text)
    const originalPool = QUESTION_SETS.find(s => s.key === activeSetKey)?.questions || allQuestions;

    newData.forEach(q => {
      const qID = q.id;
      if (q.type === 'matching') {
        delete shuffledLeftItemsRef.current[qID];
        return;
      }
      if (!q.options || q.options.length < 2) return;

      let indices = q.options.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      const origQ = originalPool.find(s => s.id === qID);
      if (!origQ) return;

      if (q.type === 'multi') {
        const newCI = indices.map((old, np) => q.correctIndices.includes(old) ? np : -1).filter(i => i !== -1);
        if (newUserAnswers[qID] && Array.isArray(newUserAnswers[qID]))
          newUserAnswers[qID] = indices.map((old, np) => newUserAnswers[qID].includes(old) ? np : -1).filter(i => i !== -1);
        q.correctIndices = newCI;
      } else {
        const newCI = indices.indexOf(q.correctIndex);
        if (newUserAnswers[qID] !== undefined && newUserAnswers[qID] !== null && typeof newUserAnswers[qID] === 'number')
          newUserAnswers[qID] = indices.indexOf(newUserAnswers[qID]);
        q.correctIndex = newCI;
      }
      q.options = indices.map(i => origQ.options[i]);
    });

    setQuizData(newData);
    setUserAnswers(newUserAnswers);
    setCurrentQuestionIndex(0);
    setSelectedLeftItem(null);
    setShowModal(false);
  };

  // ── Results ─────────────────────────────────────────────────────────────────
  const getResults = () => {
    let correct = 0, answered = 0;
    const total = quizData.length;
    quizData.forEach(q => {
      const qID = q.id;
      if (q.type === 'matching') {
        const sel = matchingSelections[qID] || {};
        const pairs = q.matchData.correctPairs;
        const total_pairs = Object.keys(pairs).length;
        const correct_pairs = Object.entries(pairs).filter(([l, r]) => sel[l] === r).length;
        if (correct_pairs === total_pairs) correct++;
        if (Object.keys(sel).length > 0) answered++;
      } else if (q.type === 'multi') {
        const sel = userAnswers[qID] || [];
        if ([...sel].sort().join(',') === [...(q.correctIndices || [])].sort().join(',')) correct++;
        if (sel.length > 0) answered++;
      } else {
        if (userAnswers[qID] === q.correctIndex) correct++;
        if (userAnswers[qID] !== undefined && userAnswers[qID] !== null) answered++;
      }
    });
    const percentage = Math.round((correct / total) * 100);
    const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F';
    const activeSet = QUESTION_SETS.find(s => s.key === activeSetKey);
    return { correct, answered, total, percentage, grade, filterName: activeSet?.label || 'All Questions' };
  };

  const reviewAnswers = () => {
    const nr = {};
    quizData.forEach(q => { nr[q.id] = true; });
    setRevealState(prev => ({ ...prev, ...nr }));
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

  // ── Status helpers ──────────────────────────────────────────────────────────
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
    if (!shuffledLeftItemsRef.current[qID])
      shuffledLeftItemsRef.current[qID] = [...leftItems].sort(() => Math.random() - 0.5);
    return shuffledLeftItemsRef.current[qID];
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 min-h-screen flex flex-col transition-colors duration-300">
      <Toast toast={toast} />

      <Header
        questionSets={QUESTION_SETS}
        activeSetKey={activeSetKey}
        onChangeSet={changeSet}
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

      <Footer activeSetKey={activeSetKey} questionSets={QUESTION_SETS} totalQuestions={quizData.length} />
      <ShuffleModal show={showModal} onClose={() => setShowModal(false)} onConfirm={confirmShuffle} />
    </div>
  );
}

export default App;
