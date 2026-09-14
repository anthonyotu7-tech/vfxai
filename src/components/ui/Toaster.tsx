import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToasterProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function Toaster({ toasts, onRemove }: ToasterProps) {
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        onRemove(toasts[0].id);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts, onRemove]);

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
    }
  };

  const getColor = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-500/10';
      case 'error':
        return 'border-red-500 bg-red-500/10';
      case 'info':
        return 'border-blue-500 bg-blue-500/10';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`min-w-[300px] max-w-md p-4 rounded-lg border ${getColor(toast.type)} backdrop-blur-sm`}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">{getIcon(toast.type)}</span>
            <div className="flex-1">
              <h4 className="font-semibold text-white">{toast.title}</h4>
              {toast.description && (
                <p className="text-sm text-white/70 mt-1">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-white/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}