import React, { useState, useCallback } from 'react';
import { Bot, Sparkles, Target, FileText, Lightbulb, X, Loader } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import { openaiService } from '../services/openaiService';

interface AIAssistantProps {
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => {
  const { theme, data, updateSummary, addSkillCategory } = useResumeStore();
  const [activeTab, setActiveTab] = useState<'summary' | 'skills' | 'analyze' | 'tips'>('summary');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Summary generation
  const [summaryForm, setSummaryForm] = useState({
    jobTitle: '',
    experience: '',
    skills: '',
    goals: ''
  });

  // Skills suggestion
  const [skillsForm, setSkillsForm] = useState({
    jobTitle: '',
    industry: ''
  });

  // Job analysis
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleGenerateSummary = useCallback(async () => {
    if (!summaryForm.jobTitle || !summaryForm.experience) {
      setError('Please fill in job title and experience level');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const summary = await openaiService.generateProfessionalSummary({
        name: data.personal.name || 'Professional',
        jobTitle: summaryForm.jobTitle,
        experience: summaryForm.experience,
        skills: summaryForm.skills.split(',').map(s => s.trim()).filter(s => s),
        goals: summaryForm.goals
      });

      updateSummary(summary);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate summary';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [summaryForm, data.personal.name, updateSummary]);

  const handleSuggestSkills = useCallback(async () => {
    if (!skillsForm.jobTitle) {
      setError('Please enter a job title');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const skills = await openaiService.suggestSkills(skillsForm.jobTitle, skillsForm.industry);
      
      // Add as a new skill category
      addSkillCategory({
        category: `${skillsForm.jobTitle} Skills`,
        items: skills.slice(0, 10) // Limit to 10 skills
      });

      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to suggest skills';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [skillsForm, addSkillCategory]);

  const handleAnalyzeJob = useCallback(async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await openaiService.analyzeJobDescription(jobDescription);
      setAnalysisResult(result);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze job description';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [jobDescription]);

  const inputClass = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
    theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  }`;

  const buttonClass = `px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-4xl w-full max-h-[90vh] rounded-lg shadow-xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">AI Resume Assistant</h2>
              <p className="text-purple-100 text-sm">Let AI help you create a professional resume</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          {[
            { id: 'summary', label: 'Generate Summary', icon: FileText },
            { id: 'skills', label: 'Suggest Skills', icon: Sparkles },
            { id: 'analyze', label: 'Analyze Job', icon: Target },
            { id: 'tips', label: 'Writing Tips', icon: Lightbulb }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${
                activeTab === id
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-800'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">AI Feature Error</p>
                  <p className="text-sm">{error}</p>
                  {error.includes('quota exceeded') && (
                    <div className="mt-2 text-xs">
                      <p className="font-medium">To resolve this issue:</p>
                      <ol className="list-decimal list-inside mt-1 space-y-1">
                        <li>Visit <a href="https://platform.openai.com/usage" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">OpenAI Usage Dashboard</a></li>
                        <li>Check your current usage and billing status</li>
                        <li>Add credits or upgrade your plan if needed</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Generate Professional Summary</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Provide some basic information and AI will create a compelling professional summary for your resume.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Target Job Title *</label>
                  <input
                    type="text"
                    value={summaryForm.jobTitle}
                    onChange={(e) => setSummaryForm({ ...summaryForm, jobTitle: e.target.value })}
                    placeholder="e.g., Software Engineer, Marketing Manager"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Experience Level *</label>
                  <select
                    value={summaryForm.experience}
                    onChange={(e) => setSummaryForm({ ...summaryForm, experience: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">Select experience level</option>
                    <option value="Entry-level (0-2 years)">Entry-level (0-2 years)</option>
                    <option value="Mid-level (3-5 years)">Mid-level (3-5 years)</option>
                    <option value="Senior-level (6-10 years)">Senior-level (6-10 years)</option>
                    <option value="Executive-level (10+ years)">Executive-level (10+ years)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Key Skills</label>
                  <input
                    type="text"
                    value={summaryForm.skills}
                    onChange={(e) => setSummaryForm({ ...summaryForm, skills: e.target.value })}
                    placeholder="e.g., JavaScript, React, Node.js, Team Leadership"
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Career Goals (Optional)</label>
                  <textarea
                    value={summaryForm.goals}
                    onChange={(e) => setSummaryForm({ ...summaryForm, goals: e.target.value })}
                    placeholder="e.g., Seeking to leverage technical expertise in a senior role..."
                    rows={2}
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateSummary}
                disabled={loading}
                className={buttonClass}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Summary</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Suggest Relevant Skills</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  AI will suggest relevant skills based on your target job title and industry.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Job Title *</label>
                  <input
                    type="text"
                    value={skillsForm.jobTitle}
                    onChange={(e) => setSkillsForm({ ...skillsForm, jobTitle: e.target.value })}
                    placeholder="e.g., Data Scientist, UX Designer"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Industry (Optional)</label>
                  <input
                    type="text"
                    value={skillsForm.industry}
                    onChange={(e) => setSkillsForm({ ...skillsForm, industry: e.target.value })}
                    placeholder="e.g., Healthcare, Fintech, E-commerce"
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                onClick={handleSuggestSkills}
                disabled={loading}
                className={buttonClass}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Suggesting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Suggest Skills</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'analyze' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Analyze Job Description</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Paste a job description and AI will extract key skills, requirements, and provide tailoring tips.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Job Description *</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={6}
                  className={inputClass}
                />
              </div>

              <button
                onClick={handleAnalyzeJob}
                disabled={loading}
                className={buttonClass}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    <span>Analyze Job</span>
                  </>
                )}
              </button>

              {analysisResult && (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
                      <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Key Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.keySkills?.map((skill: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
                      <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">ATS Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.suggestedKeywords?.map((keyword: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
                    <h4 className="font-semibold mb-2 text-purple-600 dark:text-purple-400">Tailoring Tips</h4>
                    <ul className="space-y-1 text-sm">
                      {analysisResult.matchingTips?.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Resume Writing Tips</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Professional tips to make your resume stand out and pass ATS systems.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <h4 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">Professional Summary</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Keep it 2-3 sentences maximum</li>
                    <li>• Include your years of experience</li>
                    <li>• Mention your key skills and achievements</li>
                    <li>• Avoid first-person pronouns</li>
                    <li>• Tailor it to the specific job</li>
                  </ul>
                </div>

                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <h4 className="font-semibold mb-3 text-green-600 dark:text-green-400">Work Experience</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Start with strong action verbs</li>
                    <li>• Include quantifiable results</li>
                    <li>• Focus on achievements, not duties</li>
                    <li>• Use reverse chronological order</li>
                    <li>• Keep bullet points concise</li>
                  </ul>
                </div>

                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <h4 className="font-semibold mb-3 text-purple-600 dark:text-purple-400">ATS Optimization</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Use standard section headings</li>
                    <li>• Include relevant keywords</li>
                    <li>• Avoid images and graphics</li>
                    <li>• Use simple formatting</li>
                    <li>• Save as PDF when possible</li>
                  </ul>
                </div>

                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-orange-50'}`}>
                  <h4 className="font-semibold mb-3 text-orange-600 dark:text-orange-400">Skills Section</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Categorize skills logically</li>
                    <li>• Include both hard and soft skills</li>
                    <li>• Match skills to job requirements</li>
                    <li>• Be honest about skill levels</li>
                    <li>• Update skills regularly</li>
                  </ul>
                </div>
              </div>

              <div className={`p-4 rounded-lg border-l-4 border-yellow-500 ${theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                <h4 className="font-semibold mb-2 text-yellow-600 dark:text-yellow-400">💡 Pro Tip</h4>
                <p className="text-sm">
                  Always customize your resume for each job application. Use the job description analysis feature 
                  to identify key skills and keywords, then incorporate them naturally into your resume content.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};