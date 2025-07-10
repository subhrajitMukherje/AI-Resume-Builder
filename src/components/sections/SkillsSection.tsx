import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

export const SkillsSection: React.FC = () => {
  const { data, addSkillCategory, updateSkillCategory, deleteSkillCategory, theme } = useResumeStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const defaultSkillCategory = {
    category: '',
    items: []
  };

  const [formData, setFormData] = useState(defaultSkillCategory);
  const [currentSkill, setCurrentSkill] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateSkillCategory(editingId, formData);
      setEditingId(null);
    } else {
      addSkillCategory(formData);
      setShowAddForm(false);
    }
    setFormData(defaultSkillCategory);
  };

  const handleEdit = (skillCategory: any) => {
    setFormData(skillCategory);
    setEditingId(skillCategory.id);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setFormData(defaultSkillCategory);
    setEditingId(null);
    setShowAddForm(false);
  };

  const addSkill = () => {
    if (currentSkill.trim()) {
      setFormData({
        ...formData,
        items: [...formData.items, currentSkill.trim()]
      });
      setCurrentSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const inputClass = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
    theme === 'dark'
      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  }`;

  const buttonClass = `px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
    theme === 'dark'
      ? 'bg-gray-700 text-white hover:bg-gray-600'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }`;

  return (
    <div className="space-y-4">
      {/* Skills List */}
      <div className="space-y-3">
        {data.skills.map((skillCategory) => (
          <div key={skillCategory.id} className={`p-4 border rounded-lg ${
            theme === 'dark'
              ? 'border-gray-600 bg-gray-800'
              : 'border-gray-200 bg-white'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{skillCategory.category}</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skillCategory.items.map((skill, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        theme === 'dark'
                          ? 'bg-blue-900 text-blue-200'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(skillCategory)}
                  className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteSkillCategory(skillCategory.id)}
                  className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Skill Category</span>
        </button>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className={`p-4 border rounded-lg space-y-4 ${
          theme === 'dark'
            ? 'border-gray-600 bg-gray-800'
            : 'border-gray-200 bg-white'
        }`}>
          <div>
            <label className="block text-sm font-medium mb-1">Category Name</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={inputClass}
              placeholder="Programming Languages"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Skills</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                className={inputClass}
                placeholder="JavaScript"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            
            {formData.items.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.items.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                      theme === 'dark'
                        ? 'bg-blue-900 text-blue-200'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className={buttonClass}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingId ? 'Update' : 'Add'} Category
            </button>
          </div>
        </form>
      )}
    </div>
  );
};