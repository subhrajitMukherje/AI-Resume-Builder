import React, { useState } from 'react';
import { Plus, Edit, Trash2, Sparkles, Calendar, MapPin, Building, ChevronDown, ChevronUp } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

interface ExperienceSectionProps {
  onGenerateBulletPoints: (experienceId: string) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ onGenerateBulletPoints }) => {
  const { data, addExperience, updateExperience, deleteExperience, theme } = useResumeStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const defaultExperience = {
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: []
  };

  const [formData, setFormData] = useState(defaultExperience);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateExperience(editingId, formData);
      setEditingId(null);
    } else {
      addExperience(formData);
      setShowAddForm(false);
    }
    setFormData(defaultExperience);
  };

  const handleEdit = (experience: any) => {
    setFormData(experience);
    setEditingId(experience.id);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setFormData(defaultExperience);
    setEditingId(null);
    setShowAddForm(false);
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const inputClass = `w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
    theme === 'dark'
      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  }`;

  const buttonClass = `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
    theme === 'dark'
      ? 'bg-gray-700 text-white hover:bg-gray-600'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }`;

  return (
    <div className="space-y-4">
      {/* Experience List */}
      <div className="space-y-4">
        {data.experience.map((exp) => (
          <div key={exp.id} className={`border-2 rounded-2xl overflow-hidden transition-all duration-200 ${
            theme === 'dark'
              ? 'border-gray-600 bg-gray-800'
              : 'border-gray-200 bg-white'
          } hover:shadow-lg`}>
            
            {/* Header */}
            <div 
              className={`p-4 cursor-pointer ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              } transition-colors`}
              onClick={() => toggleExpanded(exp.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-blue-600 dark:text-blue-400">{exp.position}</h4>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mt-1">
                    <Building className="w-4 h-4" />
                    <span className="font-medium">{exp.company}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    {exp.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {expandedItems[exp.id] ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedItems[exp.id] && (
              <div className={`border-t p-4 ${
                theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'
              }`}>
                {exp.description.length > 0 && (
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                    {exp.description.map((desc, index) => (
                      <li key={index}>{desc}</li>
                    ))}
                  </ul>
                )}
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onGenerateBulletPoints(exp.id);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 text-sm font-medium shadow-lg active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>AI Generate</span>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(exp);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 flex items-center space-x-2 text-sm font-medium active:scale-95"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteExperience(exp.id);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 flex items-center space-x-2 text-sm font-medium active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full p-4 border-3 border-dashed border-blue-300 dark:border-blue-600 rounded-2xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center justify-center space-x-3 text-blue-600 dark:text-blue-400 font-medium active:scale-95"
        >
          <Plus className="w-6 h-6" />
          <span className="text-lg">Add Work Experience</span>
        </button>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className={`p-6 border-2 rounded-2xl space-y-6 ${
          theme === 'dark'
            ? 'border-gray-600 bg-gray-800'
            : 'border-gray-200 bg-white'
        } shadow-lg`}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Position *</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className={inputClass}
                placeholder="Software Engineer"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Company *</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className={inputClass}
                placeholder="Tech Corp"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={inputClass}
                placeholder="San Francisco, CA"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date *</label>
                <input
                  type="month"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className={inputClass}
                  disabled={formData.current}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="current"
                checked={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="current" className="text-sm font-medium">
                I currently work here
              </label>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className={`${buttonClass} flex-1`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium active:scale-95"
            >
              {editingId ? 'Update' : 'Add'} Experience
            </button>
          </div>
        </form>
      )}
    </div>
  );
};