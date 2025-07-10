import React, { useCallback, useRef } from 'react';
import { Camera, Upload, X, User, Eye, EyeOff, Plus } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

export const PhotoSection: React.FC = () => {
  const { data, updatePersonal, theme } = useResumeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const togglePhotoVisibility = useCallback(() => {
    updatePersonal({ includePhoto: !data.personal.includePhoto });
  }, [data.personal.includePhoto, updatePersonal]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-4">
      {/* Photo Visibility Toggle */}
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 text-sm font-medium">
          <Camera className="w-4 h-4 text-blue-500" />
          <span>Profile Photo</span>
        </label>
        <div className="flex items-center space-x-2">
          {/* Upload Button with Plus Icon */}
          <button
            onClick={triggerFileInput}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } shadow-md hover:shadow-lg active:scale-95`}
            title="Upload photo from desktop"
          >
            <Plus className="w-4 h-4" />
            <span>Upload</span>
          </button>
          
          <button
            onClick={togglePhotoVisibility}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              data.personal.includePhoto
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            {data.personal.includePhoto ? (
              <>
                <Eye className="w-4 h-4" />
                <span>Visible</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Hidden</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Photo Upload Area */}
      <div className={`relative ${!data.personal.includePhoto ? 'opacity-50' : ''}`}>
        {data.personal.photo ? (
          <div className="relative">
            <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border-4 border-blue-200 dark:border-blue-800 shadow-lg">
              <img
                src={data.personal.photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={handleRemovePhoto}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              title="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={triggerFileInput}
            className={`w-32 h-32 mx-auto border-3 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-blue-600 hover:border-blue-500 hover:bg-blue-900/20'
                : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <User className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
              Click to upload
            </span>
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

      {/* Main Upload Button */}
      <button
        onClick={triggerFileInput}
        className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
        }`}
      >
        <Upload className="w-5 h-5" />
        <span>{data.personal.photo ? 'Change Photo' : 'Upload Photo from Desktop'}</span>
      </button>

      {/* Guidelines */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>• Recommended: Professional headshot</p>
        <p>• Format: JPG, PNG (max 5MB)</p>
        <p>• Size: Square aspect ratio works best</p>
        <p>• Note: Photos may not be suitable for all industries</p>
      </div>
    </div>
  );
};