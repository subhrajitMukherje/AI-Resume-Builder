import React from 'react';
import { Sparkles } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import { openaiService } from '../../services/openaiService';

export const SummarySection: React.FC = () => {
  const { data, updateSummary, theme } = useResumeStore();
  const [improving, setImproving] = React.useState(false);

  const handleImproveSummary = async () => {
    if (!data.summary.trim()) return;
    
    setImproving(true);
    try {
      const improvedSummary = await openaiService.improveContent(data.summary, 'summary');
      updateSummary(improvedSummary);
    } catch (error) {
      console.error('Error improving summary:', error);
    } finally {
      setImproving(false);
    }
  };
  const textareaClass = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
    theme === 'dark'
      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  }`;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium">
            Professional Summary
          </label>
          {data.summary.trim() && (
            <button
              onClick={handleImproveSummary}
              disabled={improving}
              className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors flex items-center space-x-1 disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3" />
              <span>{improving ? 'Improving...' : 'AI Improve'}</span>
            </button>
          )}
        </div>
        <textarea
          value={data.summary}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="Write a compelling summary that highlights your key achievements and skills..."
          rows={4}
          className={textareaClass}
        />
        <p className="text-xs text-gray-500 mt-1">
          2-3 sentences highlighting your most relevant experience and achievements
        </p>
      </div>
    </div>
  );
};