import React, { useState } from 'react';
import { X, Save, Download, Trash2, Calendar } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';

interface SaveLoadModalProps {
  onClose: () => void;
}

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({ onClose }) => {
  const { theme, saveResume, loadResume, getSavedResumes, deleteResume } = useResumeStore();
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('save');
  const [resumeName, setResumeName] = useState('');
  const [savedResumes, setSavedResumes] = useState(getSavedResumes());

  const handleSave = () => {
    if (resumeName.trim()) {
      saveResume(resumeName.trim());
      setSavedResumes(getSavedResumes());
      setResumeName('');
      onClose();
    }
  };

  const handleLoad = (name: string) => {
    loadResume(name);
    onClose();
  };

  const handleDelete = (name: string) => {
    deleteResume(name);
    setSavedResumes(getSavedResumes());
  };

  const getSavedResumeInfo = (name: string) => {
    const savedData = JSON.parse(localStorage.getItem('savedResumes') || '{}');
    return savedData[name];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-md w-full rounded-lg shadow-xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Save className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold">Save/Load Resume</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('save')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'save'
                ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Save Resume
          </button>
          <button
            onClick={() => setActiveTab('load')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'load'
                ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Load Resume
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'save' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Resume Name
                </label>
                <input
                  type="text"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  placeholder="e.g., Software Developer Resume"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              
              <button
                onClick={handleSave}
                disabled={!resumeName.trim()}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Resume</span>
              </button>
            </div>
          )}

          {activeTab === 'load' && (
            <div className="space-y-4">
              {savedResumes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No saved resumes found
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedResumes.map((name) => {
                    const info = getSavedResumeInfo(name);
                    return (
                      <div
                        key={name}
                        className={`p-4 border rounded-lg ${
                          theme === 'dark'
                            ? 'border-gray-600 bg-gray-700'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{name}</h4>
                            {info?.savedAt && (
                              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {new Date(info.savedAt).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleLoad(name)}
                              className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                              title="Load Resume"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(name)}
                              className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                              title="Delete Resume"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};