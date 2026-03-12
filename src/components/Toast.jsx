import { useState, useCallback } from 'react';

let toastId = 0;

export function useToast() {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success') => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    return { toasts, showToast };
}

const ICONS = {
    success: 'ph-check-circle',
    info: 'ph-info',
    warning: 'ph-warning',
    error: 'ph-x-circle',
};

export function ToastContainer({ toasts }) {
    if (toasts.length === 0) return null;
    return (
        <div className="toast-container">
            {toasts.map((t) => (
                <div key={t.id} className={`toast toast-${t.type}`}>
                    <i className={`ph ${ICONS[t.type] || ICONS.success}`}></i>
                    <span>{t.message}</span>
                </div>
            ))}
        </div>
    );
}
