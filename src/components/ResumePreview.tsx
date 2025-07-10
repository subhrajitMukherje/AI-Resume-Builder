import React, { memo, useMemo } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { ModernTemplate } from './templates/ModernTemplate';
import { MinimalistTemplate } from './templates/MinimalistTemplate';
import { ATSTemplate } from './templates/ATSTemplate';

const ResumePreview: React.FC = memo(() => {
  const { template, theme } = useResumeStore();

  const TemplateComponent = useMemo(() => {
    switch (template) {
      case 'modern':
        return ModernTemplate;
      case 'minimalist':
        return MinimalistTemplate;
      case 'ats':
        return ATSTemplate;
      default:
        return ModernTemplate;
    }
  }, [template]);

  return (
    <div className={`h-full overflow-y-auto ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className="p-4 flex justify-center">
        <div className="w-full max-w-4xl">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Preview - {template.charAt(0).toUpperCase() + template.slice(1)} Template
            </h3>
          </div>
          
          <div id="resume-preview" className="shadow-2xl transition-all duration-300">
            <TemplateComponent />
          </div>
        </div>
      </div>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export { ResumePreview };