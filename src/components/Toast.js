import React, { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

  return (
    <div className="toast" style={{ borderColor: type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--accent)' : 'var(--border)' }}>
      <div className="flex items-center gap-3">
        <span>{icons[type]}</span>
        <span style={{ fontWeight: 500 }}>{message}</span>
        <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
      </div>
    </div>
  );
}
