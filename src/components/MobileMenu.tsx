import React from 'react';
import { X, Download, Save, Bot, Sun, Moon, Palette } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onSaveLoad: () => void;
  onAIAssistant: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onExport,
  onSaveLoad,
  onAIAssistant
}) => {
  const { theme, toggleTheme, template, setTemplate } = useResumeStore();

  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 sm:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      } shadow-2xl transform transition-transform duration-300 ease-out`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-800 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          
          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => handleAction(onAIAssistant)}
                className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl flex items-center space-x-3 shadow-lg active:scale-95 transition-transform"
              >
                <div className="p-2 bg-white/20 rounded-xl">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">AI Assistant</div>
                  <div className="text-sm opacity-90">Generate content with AI</div>
                </div>
              </button>

              <button
                onClick={() => handleAction(onExport)}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl flex items-center space-x-3 shadow-lg active:scale-95 transition-transform"
              >
                <div className="p-2 bg-white/20 rounded-xl">
                  <Download className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Export PDF</div>
                  <div className="text-sm opacity-90">Download your resume</div>
                </div>
              </button>

              <button
                onClick={() => handleAction(onSaveLoad)}
                className={`w-full p-4 rounded-2xl flex items-center space-x-3 border-2 transition-all active:scale-95 ${
                  theme === 'dark'
                    ? 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`p-2 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                }`}>
                  <Save className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Save/Load</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Manage your resumes</div>
                </div>
              </button>
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Template
            </h3>
            <div className="space-y-2">
              {[
                { value: 'modern', label: 'Modern', desc: 'Colorful and professional' },
                { value: 'minimalist', label: 'Minimalist', desc: 'Clean and simple' },
                { value: 'ats', label: 'ATS-Friendly', desc: 'Optimized for systems' }
              ].map((tmpl) => (
                <button
                  key={tmpl.value}
                  onClick={() => setTemplate(tmpl.value as any)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    template === tmpl.value
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                      : theme === 'dark'
                      ? 'bg-gray-800 border-2 border-gray-700 hover:border-gray-600'
                      : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{tmpl.label}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{tmpl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Appearance
            </h3>
            <button
              onClick={toggleTheme}
              className={`w-full p-4 rounded-2xl flex items-center space-x-3 border-2 transition-all active:scale-95 ${
                theme === 'dark'
                  ? 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className={`p-2 rounded-xl ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
              }`}>
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="text-left">
                <div className="font-semibold">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Switch to {theme === 'dark' ? 'light' : 'dark'} theme
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};