import React from 'react';
import { Moon, Sun, Download, Save, FileText, Sparkles, Bot, Menu } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';

interface HeaderProps {
  onExport: () => void;
  onSaveLoad: () => void;
  onAIAssistant: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExport, onSaveLoad, onAIAssistant, onToggleMobileMenu }) => {
  const { theme, toggleTheme, template, setTemplate } = useResumeStore();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-900/95 border-gray-700' 
        : 'bg-white/95 border-gray-200'
    } border-b backdrop-blur-lg shadow-lg`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Resume Builder
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                AI-Powered & Interactive
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Resume AI
              </h1>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={onToggleMobileMenu}
            className={`sm:hidden p-2 rounded-xl transition-all duration-200 ${
              theme === 'dark'
                ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-2 lg:space-x-3">
            {/* Template Selector */}
            <div className="hidden lg:flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Template:</span>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value as any)}
                className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700'
                    : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="modern">Modern</option>
                <option value="minimalist">Minimalist</option>
                <option value="ats">ATS-Friendly</option>
              </select>
            </div>

            <button
              onClick={onAIAssistant}
              className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              title="AI Resume Assistant"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden lg:inline">AI Assistant</span>
              <span className="lg:hidden">AI</span>
            </button>
            
            <button
              onClick={onSaveLoad}
              className={`p-2 rounded-xl transition-all duration-200 ${
                theme === 'dark'
                  ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
              title="Save/Load Resume"
            >
              <Save className="w-5 h-5" />
            </button>
            
            <button
              onClick={onExport}
              className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span className="hidden lg:inline">Export PDF</span>
              <span className="lg:hidden">Export</span>
            </button>
            
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all duration-200 ${
                theme === 'dark'
                  ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};