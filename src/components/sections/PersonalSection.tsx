import React, { useCallback, useRef } from 'react';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github, Camera, Upload, X } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import { useDebounce } from '../../hooks/usePerformance';

export const PersonalSection: React.FC = () => {
  const { data, updatePersonal, theme } = useResumeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback((field: string, value: string) => {
    updatePersonal({ [field]: value });
  }, [updatePersonal]);

  const debouncedHandleChange = useDebounce(handleChange, 300);

  const handlePhotoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updatePersonal({ photo: result, includePhoto: true }); // Auto-enable when uploading
      };
      reader.readAsDataURL(file);
    }
  }, [updatePersonal]);

  const handleRemovePhoto = useCallback(() => {
    updatePersonal({ photo: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [updatePersonal]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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
      {/* Profile Photo Upload Section */}
      <div className={`p-4 rounded-xl border-2 transition-all ${
        data.personal.photo
          ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20'
          : 'border-dashed border-gray-300 dark:border-gray-600'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Profile Photo</span>
          </div>
          <button
            onClick={triggerFileInput}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg active:scale-95 ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            title="Upload photo from desktop"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
        </div>

        {/* Photo Preview */}
        {data.personal.photo ? (
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-blue-200 dark:border-blue-800 shadow-md">
                <img
                  src={data.personal.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={handleRemovePhoto}
                className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                title="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                ✓ Photo uploaded successfully
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Photo will be included in your resume
              </p>
            </div>
          </div>
        ) : (
          <div 
            onClick={triggerFileInput}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
              theme === 'dark'
                ? 'hover:bg-gray-700 border border-gray-600'
                : 'hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <User className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Click to upload profile photo</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                JPG, PNG up to 5MB
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </div>

      {/* Photo Section Toggle */}
      <div className={`p-4 rounded-xl border-2 border-dashed transition-all ${
        data.personal.includePhoto
          ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Show Photo in Resume</span>
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
            ? 'Photo will be visible in your resume preview and export.'
            : 'Enable to show your photo in the resume.'
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