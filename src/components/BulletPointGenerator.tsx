import React, { useState, useCallback } from 'react';
import { X, Sparkles, Check, Copy } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import { openaiService } from '../services/openaiService';

interface BulletPointGeneratorProps {
  experienceId: string;
  onClose: () => void;
}

export const BulletPointGenerator: React.FC<BulletPointGeneratorProps> = ({ experienceId, onClose }) => {
  const { data, updateExperience, theme, isGenerating, setGenerating } = useResumeStore();
  const [prompt, setPrompt] = useState('');
  const [generatedBullets, setGeneratedBullets] = useState<string[]>([]);
  const [selectedBullets, setSelectedBullets] = useState<string[]>([]);

  const experience = data.experience.find(exp => exp.id === experienceId);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    setGenerating(true);
    
    try {
      const bullets = await openaiService.generateBulletPoints({
        jobTitle: experience.position,
        company: experience.company,
        responsibilities: prompt,
        skills: [], // Could be enhanced to include user's skills
        industry: '' // Could be enhanced to include industry info
      });
      
      setGeneratedBullets(bullets);
    } catch (error) {
      console.error('Error generating bullet points:', error);
      
      // Check if it's an API key error
      if (error instanceof Error && error.message.includes('OpenAI API key')) {
        alert('OpenAI API key is not configured. Please add your API key to the .env file as VITE_OPENAI_API_KEY=your_actual_api_key and restart the development server.');
        return;
      }
      
      // Fallback to mock data if API fails
      const mockBullets = [
        `Led development of ${prompt} resulting in 25% increase in user engagement and 15% improvement in conversion rates`,
        `Implemented ${prompt} using modern technologies, reducing load time by 40% and improving overall system performance`,
        `Collaborated with cross-functional teams to deliver ${prompt} on time and within budget, serving 10,000+ daily active users`,
        `Optimized ${prompt} architecture and database queries, resulting in 60% reduction in server response time`,
        `Mentored junior developers on ${prompt} best practices and conducted code reviews to ensure high-quality deliverables`
      ];
      setGeneratedBullets(mockBullets);
    } finally {
      setGenerating(false);
    }
  }, [prompt, experience, setGenerating]);

  const toggleBulletSelection = useCallback((bullet: string) => {
    setSelectedBullets(prev => 
      prev.includes(bullet) 
        ? prev.filter(b => b !== bullet)
        : [...prev, bullet]
    );
  }, []);

  const handleAddToResume = useCallback(() => {
    if (experience && selectedBullets.length > 0) {
      const updatedDescription = [...experience.description, ...selectedBullets];
      updateExperience(experienceId, { description: updatedDescription });
      onClose();
    }
  }, [experience, selectedBullets, updateExperience, experienceId, onClose]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  if (!experience) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-4xl w-full max-h-[90vh] rounded-lg shadow-xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold">AI Bullet Point Generator</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              {experience.position} at {experience.company}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Describe your main responsibilities, achievements, or projects for this role. 
              The AI will generate professional bullet points based on your input.
            </p>
          </div>

          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Describe your work, achievements, or projects:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., developed a customer management system, led a team of 5 developers, improved system performance..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="mt-3 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Bullet Points</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Bullets */}
          {generatedBullets.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Generated Bullet Points</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select the bullet points you'd like to add to your resume:
              </p>
              
              <div className="space-y-3">
                {generatedBullets.map((bullet, index) => (
                  <div
                    key={index}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedBullets.includes(bullet)
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : theme === 'dark'
                        ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                    }`}
                    onClick={() => toggleBulletSelection(bullet)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                        selectedBullets.includes(bullet)
                          ? 'bg-purple-500 border-purple-500'
                          : 'border-gray-300 dark:border-gray-500'
                      }`}>
                        {selectedBullets.includes(bullet) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">{bullet}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(bullet);
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedBullets.length} bullet point{selectedBullets.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToResume}
              disabled={selectedBullets.length === 0}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};