

function Modal({ isOpen, onClose, title, children, size = "normal" }) {
  if (!isOpen) return null;

  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal ${size === "large" ? "modal-large" : ""}`}>
        
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="icon-button" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        
        {children}
      </div>
    </div>
  );
}

export default Modal;
