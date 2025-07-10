import React, { useCallback, useRef } from 'react';
import { Camera, Upload, X, User, Eye, EyeOff } from 'lucide-react';
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
        updatePersonal({ photo: result });
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
            onClick={data.personal.includePhoto ? triggerFileInput : undefined}
            className={`w-32 h-32 mx-auto border-3 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${
              data.personal.includePhoto
                ? 'border-blue-300 dark:border-blue-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer'
                : 'border-gray-300 dark:border-gray-600 cursor-not-allowed'
            }`}
          >
            <User className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
              {data.personal.includePhoto ? 'Click to upload' : 'Enable photo first'}
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

      {/* Upload Button */}
      <button
        onClick={triggerFileInput}
        disabled={!data.personal.includePhoto}
        className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
          data.personal.includePhoto
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }`}
      >
        <Upload className="w-4 h-4" />
        <span>{data.personal.photo ? 'Change Photo' : 'Upload Photo from Desktop'}</span>
      </button>

      {/* Guidelines */}
      <div className={`text-xs text-gray-500 dark:text-gray-400 space-y-1 ${
        !data.personal.includePhoto ? 'opacity-50' : ''
      }`}>
        <p>• Recommended: Professional headshot</p>
        <p>• Format: JPG, PNG (max 5MB)</p>
        <p>• Size: Square aspect ratio works best</p>
        <p>• Note: Photos may not be suitable for all industries</p>
      </div>
    </div>
  );
};