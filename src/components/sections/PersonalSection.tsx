import React, { useCallback } from 'react';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import { useDebounce } from '../../hooks/usePerformance';

export const PersonalSection: React.FC = () => {
  const { data, updatePersonal, theme } = useResumeStore();

  const handleChange = useCallback((field: string, value: string) => {
    updatePersonal({ [field]: value });
  }, [updatePersonal]);

  const debouncedHandleChange = useDebounce(handleChange, 300);

  const inputClass = `w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
    theme === 'dark'
      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
  }`;

  const fields = [
    { key: 'name', label: 'Full Name', icon: User, placeholder: 'John Doe', type: 'text' },
    { key: 'email', label: 'Email', icon: Mail, placeholder: 'john@example.com', type: 'email' },
    { key: 'phone', label: 'Phone', icon: Phone, placeholder: '(555) 123-4567', type: 'tel' },
    { key: 'location', label: 'Location', icon: MapPin, placeholder: 'New York, NY', type: 'text' },
    { key: 'website', label: 'Website', icon: Globe, placeholder: 'https://johndoe.com', type: 'url' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/johndoe', type: 'url' },
    { key: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/johndoe', type: 'url' }
  ];

  return (
    <div className="space-y-6">
      {/* Photo Section Toggle */}
      <div className={`p-4 rounded-xl border-2 border-dashed transition-all ${
        data.personal.includePhoto
          ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Profile Photo</span>
          </div>
          <button
            onClick={() => handleChange('includePhoto', !data.personal.includePhoto)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              data.personal.includePhoto
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            {data.personal.includePhoto ? 'Enabled' : 'Disabled'}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {data.personal.includePhoto 
            ? 'Photo will be included in your resume. Configure it in the Photo section.'
            : 'Enable to add a professional photo to your resume.'
          }
        </p>
      </div>

      {/* Contact Information */}
      {fields.map((field) => {
        const Icon = field.icon;
        return (
          <div key={field.key} className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium">
              <Icon className="w-4 h-4 text-blue-500" />
              <span>{field.label}</span>
            </label>
            <input
              type={field.type}
              value={data.personal[field.key as keyof typeof data.personal]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className={inputClass}
            />
          </div>
        );
      })}
    </div>
  );
};