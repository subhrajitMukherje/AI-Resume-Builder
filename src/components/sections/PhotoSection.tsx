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
    if (data.personal.includePhoto) {
      fileInputRef.current?.click();
    }
  }, [data.personal.includePhoto]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Photo Visibility Toggle with Plus Button */}
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 text-sm font-medium">
          <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          <span className="text-base sm:text-sm">Profile Photo</span>
        </label>
        
        {/* Buttons Container */}
        <div className="flex items-center space-x-2">
          {/* Plus Sign Button for Upload */}
          <button
            onClick={triggerFileInput}
            disabled={!data.personal.includePhoto}
            className={`p-2 rounded-lg transition-all duration-200 touch-manipulation active:scale-95 ${
              data.personal.includePhoto
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
            title={data.personal.includePhoto ? 'Upload photo from desktop' : 'Enable photo first'}
          >
            <Plus className="w-4 h-4" />
          </button>
          
          {/* Enable/Disable Toggle */}
          <button
            onClick={togglePhotoVisibility}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation active:scale-95 ${
              data.personal.includePhoto
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            {data.personal.includePhoto ? (
              <>
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Visible</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                <span className="hidden sm:inline">Hidden</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Photo Upload Area - Mobile Responsive */}
      <div className={`relative ${!data.personal.includePhoto ? 'opacity-50' : ''}`}>
        {data.personal.photo ? (
          <div className="relative flex justify-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-blue-200 dark:border-blue-800 shadow-lg">
              <img
                src={data.personal.photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={handleRemovePhoto}
              className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 p-1.5 sm:p-2 bg-red-500 text-white rounded-full hover:bg-red-600 active:bg-red-700 transition-colors shadow-lg touch-manipulation active:scale-90"
              title="Remove photo"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={triggerFileInput}
            className={`w-24 h-24 sm:w-32 sm:h-32 mx-auto border-3 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-200 touch-manipulation ${
              data.personal.includePhoto
                ? 'border-blue-300 dark:border-blue-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer active:scale-95'
                : 'border-gray-300 dark:border-gray-600 cursor-not-allowed'
            }`}
          >
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-1 sm:mb-2" />
            <span className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
              {data.personal.includePhoto ? 'Tap to upload' : 'Enable photo first'}
            </span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
          disabled={!data.personal.includePhoto}
        />
      </div>

      {/* Upload Button - Only show when photo is enabled */}
      {data.personal.includePhoto && (
        <button
          onClick={triggerFileInput}
          className="w-full px-4 py-4 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl sm:rounded-xl hover:from-blue-600 hover:to-purple-700 active:from-blue-700 active:to-purple-800 transition-all duration-200 flex items-center justify-center space-x-3 font-medium active:scale-95 shadow-lg hover:shadow-xl touch-manipulation text-base sm:text-sm"
        >
          <Upload className="w-5 h-5" />
          <span>{data.personal.photo ? 'Change Photo' : 'Upload Photo'}</span>
        </button>
      )}

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