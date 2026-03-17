function Footer({ activeSetKey, questionSets, totalQuestions }) {
  const activeSet = questionSets?.find(s => s.key === activeSetKey);
  return (
    <footer className="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-auto py-3 sm:py-4 transition-colors">
      <div className="max-w-3xl mx-auto px-4 text-center text-slate-400 dark:text-slate-500 text-[11px] sm:text-xs">
        <p>{activeSet?.label || 'ECE Quiz'} &nbsp;|&nbsp; {totalQuestions} Questions</p>
      </div>
    </footer>
  );
}

export default Footer;
