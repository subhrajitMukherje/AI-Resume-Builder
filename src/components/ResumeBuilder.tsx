import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useResumeStore } from '../store/resumeStore';
import { Header } from './Header';
import { MobileMenu } from './MobileMenu';
import { SidePanel } from './SidePanel';
import { ResumePreview } from './ResumePreview';
import { ExportModal } from './ExportModal';
import { SaveLoadModal } from './SaveLoadModal';
import { BulletPointGenerator } from './BulletPointGenerator';
import { AIAssistant } from './AIAssistant';

// Detect if device supports touch
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

export const ResumeBuilder: React.FC = () => {
  const { theme } = useResumeStore();
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSaveLoadModal, setShowSaveLoadModal] = useState(false);
  const [showBulletGenerator, setShowBulletGenerator] = useState(false);
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');

  const handleGenerateBulletPoints = (experienceId: string) => {
    setSelectedExperienceId(experienceId);
    setShowBulletGenerator(true);
  };

  return (
    <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
      <div className={`min-h-screen transition-colors duration-200 ${
        theme === 'dark' 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-50 text-gray-900'
      }`}>
        <Header 
          onExport={() => setShowExportModal(true)}
          onSaveLoad={() => setShowSaveLoadModal(true)}
          onAIAssistant={() => setShowAIAssistant(true)}
          onToggleMobileMenu={() => setShowMobileMenu(true)}
        />
        
        {/* Mobile Menu */}
        <MobileMenu
          isOpen={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
          onExport={() => setShowExportModal(true)}
          onSaveLoad={() => setShowSaveLoadModal(true)}
          onAIAssistant={() => setShowAIAssistant(true)}
        />

        {/* Mobile View Toggle */}
        <div className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 safe-area-inset">
          <div className={`flex rounded-2xl p-1.5 shadow-2xl border-2 ${
            theme === 'dark'
              ? 'bg-gray-800/95 border-gray-700 backdrop-blur-lg'
              : 'bg-white/95 border-gray-200 backdrop-blur-lg'
          }`}>
            <button
              onClick={() => setMobileView('edit')}
              className={`px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 touch-target touch-manipulation active:scale-95 min-w-[120px] ${
                mobileView === 'edit'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              aria-label="Switch to edit mode"
            >
              Edit
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 touch-target touch-manipulation active:scale-95 min-w-[120px] ${
                mobileView === 'preview'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              aria-label="Switch to preview mode"
            >
              Preview
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row min-h-screen pt-16 sm:pt-18 pb-28 lg:pb-0">
          {/* Side Panel */}
          <div className={`lg:w-1/3 xl:w-1/4 ${
            mobileView === 'edit' ? 'block' : 'hidden lg:block'
          }`}>
            <SidePanel onGenerateBulletPoints={handleGenerateBulletPoints} />
          </div>
          
          {/* Resume Preview */}
          <div className={`flex-1 lg:border-l border-gray-200 dark:border-gray-700 ${
            mobileView === 'preview' ? 'block' : 'hidden lg:block'
          }`}>
            <ResumePreview />
          </div>
        </div>

        {/* Modals */}
        {showExportModal && (
          <ExportModal onClose={() => setShowExportModal(false)} />
        )}
        
        {showSaveLoadModal && (
          <SaveLoadModal onClose={() => setShowSaveLoadModal(false)} />
        )}
        
        {showBulletGenerator && selectedExperienceId && (
          <BulletPointGenerator 
            experienceId={selectedExperienceId}
            onClose={() => {
              setShowBulletGenerator(false);
              setSelectedExperienceId(null);
            }}
          />
        )}
        
        {showAIAssistant && (
          <AIAssistant onClose={() => setShowAIAssistant(false)} />
        )}
      </div>
    </DndProvider>
  );
};