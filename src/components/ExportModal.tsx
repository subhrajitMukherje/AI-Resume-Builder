import React, { useState, useCallback, useMemo } from 'react';
import { X, Download, FileText, Loader, Calendar, User, Check, Smartphone } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import { generateResumeFileName, getExportConfig } from '../utils/fileUtils';
import { usePerformanceMonitor } from '../hooks/usePerformance';
import html2pdf from 'html2pdf.js';

interface ExportModalProps {
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ onClose }) => {
  const { theme, template, setTemplate, data } = useResumeStore();
  const [isExporting, setIsExporting] = useState(false);
  const [includeDate, setIncludeDate] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  
  usePerformanceMonitor('ExportModal');

  const fileName = useMemo(() => 
    generateResumeFileName(data.personal, template, includeDate),
    [data.personal, template, includeDate]
  );

  const handleExport = useCallback(async () => {
    const element = document.getElementById('resume-preview');
    if (!element) {
      console.error('Resume preview element not found');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    setExportComplete(false);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 15, 85));
      }, 300);

      const config = getExportConfig('pdf');
      const opt = {
        ...config,
        filename: fileName,
        html2canvas: {
          ...config.html2canvas,
          onrendered: () => {
            setExportProgress(70);
          }
        }
      };

      // Performance optimization: Clone element to avoid layout thrashing
      const clonedElement = element.cloneNode(true) as HTMLElement;
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      clonedElement.style.top = '0';
      document.body.appendChild(clonedElement);

      await html2pdf().set(opt).from(clonedElement).save();
      
      // Cleanup
      document.body.removeChild(clonedElement);
      clearInterval(progressInterval);
      setExportProgress(100);
      setExportComplete(true);
      
      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setExportProgress(0);
      setExportComplete(false);
    } finally {
      setIsExporting(false);
    }
  }, [fileName, onClose]);

  const templateOptions = useMemo(() => [
    {
      value: 'modern',
      label: 'Modern',
      description: 'Professional design with colors and modern layout',
      color: 'blue',
      preview: '🎨'
    },
    {
      value: 'minimalist',
      label: 'Minimalist',
      description: 'Clean, simple design with focus on content',
      color: 'green',
      preview: '✨'
    },
    {
      value: 'ats',
      label: 'ATS-Friendly',
      description: 'Optimized for Applicant Tracking Systems',
      color: 'purple',
      preview: '🤖'
    }
  ], []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
      <div className={`w-full max-w-lg max-h-[95vh] rounded-3xl shadow-2xl overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } transform transition-all duration-300 scale-100 flex flex-col`}>
        
        {/* Header with Close Button */}
        <div className="relative p-4 sm:p-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex-shrink-0">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Export Resume</h2>
                <p className="text-blue-100 text-xs sm:text-sm">
                  Download your professional resume
                </p>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              disabled={isExporting}
              className="p-2 sm:p-3 hover:bg-white/20 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group touch-manipulation"
              title="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
          
          {/* Progress Bar */}
          {isExporting && (
            <div className="mt-3 sm:mt-4">
              <div className="flex items-center justify-between text-xs sm:text-sm text-blue-100 mb-2">
                <span>
                  {exportProgress < 100 ? 'Generating PDF...' : 'Download Complete!'}
                </span>
                <span>{exportProgress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 sm:h-3">
                <div 
                  className={`rounded-full h-2 sm:h-3 transition-all duration-500 ${
                    exportComplete ? 'bg-green-400' : 'bg-white'
                  }`}
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success Message */}
          {exportComplete && (
            <div className="mt-3 sm:mt-4 flex items-center space-x-2 text-green-100">
              <Check className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">Resume downloaded successfully!</span>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            
            {/* File Preview */}
            <div className={`p-3 sm:p-4 rounded-2xl border-2 border-dashed transition-all duration-200 ${
              theme === 'dark' 
                ? 'border-gray-600 bg-gray-700/50 hover:border-gray-500' 
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 sm:p-3 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-white'
                } shadow-sm flex-shrink-0`}>
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm mb-1">Download as:</div>
                  <div className={`text-xs font-mono rounded-lg px-2 sm:px-3 py-1 sm:py-2 break-all ${
                    theme === 'dark' 
                      ? 'text-gray-300 bg-gray-800 border border-gray-600' 
                      : 'text-gray-600 bg-white border border-gray-200'
                  }`}>
                    📄 {fileName}
                  </div>
                </div>
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center space-x-2">
                <span>Choose Template</span>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {templateOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTemplate(option.value as any)}
                    disabled={isExporting}
                    className={`p-3 sm:p-4 border-2 rounded-2xl text-left transition-all duration-200 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] touch-manipulation ${
                      template === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-xl sm:text-2xl flex-shrink-0">{option.preview}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-sm sm:text-base ${
                          template === option.value 
                            ? 'text-blue-600 dark:text-blue-400'
                            : ''
                        }`}>
                          {option.label}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-tight">
                          {option.description}
                        </p>
                      </div>
                      {template === option.value && (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Export Options</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer group touch-manipulation">
                  <input
                    type="checkbox"
                    checked={includeDate}
                    onChange={(e) => setIncludeDate(e.target.checked)}
                    disabled={isExporting}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50 transition-all"
                  />
                  <div className="flex items-center space-x-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <Calendar className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm font-medium">Include date in filename</span>
                  </div>
                </label>
                
                <div className={`p-3 rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-100 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="font-medium">Name:</span>
                    <span className="text-gray-600 dark:text-gray-400 truncate">
                      {data.personal.name || 'Not specified'}
                    </span>
                  </div>
                </div>

                {/* Mobile-specific info */}
                <div className={`p-3 rounded-xl border sm:hidden ${
                  theme === 'dark' 
                    ? 'bg-blue-900/20 border-blue-700' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                    <Smartphone className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">Mobile optimized export</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Enhanced Download Button */}
        <div className={`flex flex-col space-y-3 p-4 sm:p-6 border-t ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
        } flex-shrink-0`}>
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
            High-quality PDF • Print ready • ATS compatible
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <button
              onClick={onClose}
              disabled={isExporting}
              className={`w-full sm:w-auto px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 disabled:opacity-50 touch-manipulation ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            
            {/* Enhanced Download Button */}
            <button
              onClick={handleExport}
              disabled={isExporting || exportComplete}
              className={`w-full sm:flex-1 px-6 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed min-h-[48px] touch-manipulation ${
                exportComplete
                  ? 'bg-green-500 text-white'
                  : isExporting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
              }`}
            >
              {exportComplete ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Downloaded!</span>
                </>
              ) : isExporting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};