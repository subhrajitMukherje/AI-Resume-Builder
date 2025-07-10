import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, MapPin, GraduationCap } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

export const EducationSection: React.FC = () => {
  const { data, addEducation, updateEducation, deleteEducation, theme } = useResumeStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const defaultEducation = {
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    gpa: '',
    description: []
  };

  const [formData, setFormData] = useState(defaultEducation);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateEducation(editingId, formData);
      setEditingId(null);
    } else {
      addEducation(formData);
      setShowAddForm(false);
    }
    setFormData(defaultEducation);
  };

  const handleEdit = (education: any) => {
    setFormData(education);
    setEditingId(education.id);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setFormData(defaultEducation);
    setEditingId(null);
    setShowAddForm(false);
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
      {/* Education List */}
      <div className="space-y-3">
        {data.education.map((edu) => (
          <div key={edu.id} className={`p-4 border rounded-lg ${
            theme === 'dark'
              ? 'border-gray-600 bg-gray-800'
              : 'border-gray-200 bg-white'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{edu.degree} in {edu.field}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <GraduationCap className="w-4 h-4" />
                  <span>{edu.institution}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{edu.startDate} - {edu.endDate}</span>
                  </div>
                  {edu.gpa && (
                    <span className="font-medium">GPA: {edu.gpa}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(edu)}
                  className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteEducation(edu.id)}
                  className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {edu.description.length > 0 && (
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {edu.description.map((desc, index) => (
                  <li key={index}>{desc}</li>
                ))}
              </ul>
            )}
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
          <span>Add Education</span>
        </button>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className={`p-4 border rounded-lg space-y-4 ${
          theme === 'dark'
            ? 'border-gray-600 bg-gray-800'
            : 'border-gray-200 bg-white'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Institution</label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className={inputClass}
                placeholder="University of California"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Degree</label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className={inputClass}
                placeholder="Bachelor of Science"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Field of Study</label>
              <input
                type="text"
                value={formData.field}
                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                className={inputClass}
                placeholder="Computer Science"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">GPA (Optional)</label>
              <input
                type="text"
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                className={inputClass}
                placeholder="3.8"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={inputClass}
                required
              />
            </div>
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
              {editingId ? 'Update' : 'Add'} Education
            </button>
          </div>
        </form>
      )}
    </div>
  );
};