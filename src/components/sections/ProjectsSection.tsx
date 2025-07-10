import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, ExternalLink, Github } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

export const ProjectsSection: React.FC = () => {
  const { data, addProject, updateProject, deleteProject, theme } = useResumeStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const defaultProject = {
    name: '',
    description: '',
    technologies: [],
    link: '',
    github: '',
    startDate: '',
    endDate: ''
  };

  const [formData, setFormData] = useState(defaultProject);
  const [currentTech, setCurrentTech] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProject(editingId, formData);
      setEditingId(null);
    } else {
      addProject(formData);
      setShowAddForm(false);
    }
    setFormData(defaultProject);
  };

  const handleEdit = (project: any) => {
    setFormData(project);
    setEditingId(project.id);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setFormData(defaultProject);
    setEditingId(null);
    setShowAddForm(false);
  };

  const addTechnology = () => {
    if (currentTech.trim()) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, currentTech.trim()]
      });
      setCurrentTech('');
    }
  };

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index)
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
      {/* Projects List */}
      <div className="space-y-3">
        {data.projects.map((project) => (
          <div key={project.id} className={`p-4 border rounded-lg ${
            theme === 'dark'
              ? 'border-gray-600 bg-gray-800'
              : 'border-gray-200 bg-white'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{project.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {project.description}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{project.startDate} - {project.endDate}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        theme === 'dark'
                          ? 'bg-green-900 text-green-200'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Live Demo</span>
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
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
          <span>Add Project</span>
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
              <label className="block text-sm font-medium mb-1">Project Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClass}
                placeholder="E-commerce Platform"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`${inputClass} resize-none`}
                rows={3}
                placeholder="Brief description of the project..."
                required
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
            
            <div>
              <label className="block text-sm font-medium mb-1">Live Demo URL</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className={inputClass}
                placeholder="https://example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">GitHub URL</label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className={inputClass}
                placeholder="https://github.com/user/repo"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Technologies</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                className={inputClass}
                placeholder="React"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              />
              <button
                type="button"
                onClick={addTechnology}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            
            {formData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                      theme === 'dark'
                        ? 'bg-green-900 text-green-200'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => removeTechnology(index)}
                      className="hover:text-red-600 transition-colors"
                    >
                      ×
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
              {editingId ? 'Update' : 'Add'} Project
            </button>
          </div>
        </form>
      )}
    </div>
  );
};