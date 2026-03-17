function ShuffleModal({ show, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-slate-200 dark:border-slate-700 transform transition-transform duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 mx-auto flex items-center justify-center mb-4 ring-4 ring-fuchsia-50 dark:ring-fuchsia-900/20">
            <i className="fa-solid fa-dice text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Shuffle Questions?</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            This will randomize the order of all questions and answer choices in the current quiz.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-fuchsia-600 text-white rounded-xl font-medium hover:bg-fuchsia-700 shadow-lg shadow-fuchsia-600/20 transition-all hover:scale-[1.02]"
            >
              Yes, Shuffle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShuffleModal;
