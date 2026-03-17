function Toast({ toast }) {
  return (
    <div className={`toast ${toast.show ? 'show' : ''}`}>
      <div className={`toast-content ${toast.on ? 'toast-on' : 'toast-off'}`}>
        <span className="toast-icon">
          <i className={`fa-solid ${toast.on ? 'fa-bolt' : 'fa-bolt-slash'}`}></i>
        </span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

export default Toast;
