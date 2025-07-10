import React, { useCallback, useRef } from 'react';
import { Camera, Upload, X, User, Eye, EyeOff, ImagePlus, Plus } from 'lucide-react';
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
      {/* Photo Visibility Toggle - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <label className="flex items-center space-x-2 text-sm font-medium">
          <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          <span className="text-base sm:text-sm">Profile Photo</span>
        </label>
        
        {/* Mobile: Stack buttons vertically, Desktop: Side by side */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          {/* Plus button for photo upload - Mobile optimized */}
          <button
            onClick={triggerFileInput}
            disabled={!data.personal.includePhoto}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-3 sm:px-3 sm:py-2 rounded-xl sm:rounded-lg transition-all duration-200 font-medium text-sm touch-manipulation ${
              data.personal.includePhoto
                ? 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-95'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
            title={data.personal.includePhoto ? 'Upload photo from desktop' : 'Enable photo first'}
          >
            <Plus className="w-4 h-4 sm:w-4 sm:h-4" />
            <span className="sm:hidden">Upload Photo</span>
          </button>
          
          {/* Enable/Disable toggle - Mobile optimized */}
          <button
            onClick={togglePhotoVisibility}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-3 sm:px-3 sm:py-2 rounded-xl sm:rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation active:scale-95 ${
              data.personal.includePhoto
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-800'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-600'
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

      {/* Upload Buttons - Mobile Responsive */}
      {data.personal.includePhoto && (
        <div className="space-y-3">
          {/* Primary Upload Button - Mobile optimized */}
          <button
            onClick={triggerFileInput}
            className="w-full px-4 py-4 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl sm:rounded-xl hover:from-blue-600 hover:to-purple-700 active:from-blue-700 active:to-purple-800 transition-all duration-200 flex items-center justify-center space-x-3 font-medium active:scale-95 shadow-lg hover:shadow-xl touch-manipulation text-base sm:text-sm"
          >
            <Upload className="w-5 h-5" />
            <span>{data.personal.photo ? 'Change Photo' : 'Upload Photo'}</span>
          </button>
          
          {/* Alternative Upload Button - Mobile optimized */}
          <button
            onClick={triggerFileInput}
            className={`w-full px-4 py-4 sm:py-3 border-2 border-dashed rounded-2xl sm:rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 font-medium active:scale-95 touch-manipulation text-base sm:text-sm ${
              theme === 'dark'
                ? 'border-blue-400 text-blue-400 hover:bg-blue-900/20 active:bg-blue-900/30 hover:border-blue-300'
                : 'border-blue-500 text-blue-600 hover:bg-blue-50 active:bg-blue-100 hover:border-blue-600'
            }`}
          >
            <ImagePlus className="w-5 h-5" />
            <span>Browse Files</span>
          </button>

          {/* Quick Add Button - Mobile optimized */}
          <button
            onClick={triggerFileInput}
            className={`w-full px-4 py-3 sm:py-2 rounded-xl sm:rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 font-medium active:scale-95 touch-manipulation text-sm ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-500 border border-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 border border-gray-300'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Profile Picture</span>
          </button>
        </div>
      )}

      {/* Enhanced Guidelines - Mobile Responsive */}
      <div className={`text-xs sm:text-xs text-gray-500 dark:text-gray-400 ${
        !data.personal.includePhoto ? 'opacity-50' : ''
      }`}>
        <div className={`p-4 sm:p-4 rounded-2xl sm:rounded-xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-600' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <h4 className="font-medium text-sm sm:text-sm mb-3 text-blue-600 dark:text-blue-400 flex items-center space-x-2">
            <Camera className="w-4 h-4" />
            <span>Photo Guidelines</span>
          </h4>
          
          {/* Mobile: Single column, Desktop: Grid */}
          <div className="space-y-3 sm:space-y-2">
            <div className="flex items-start space-x-3 sm:space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 sm:mt-1 flex-shrink-0"></div>
              <div className="text-sm sm:text-xs">
                <span className="font-medium">Recommended:</span> Professional headshot with good lighting
              </div>
            </div>
            <div className="flex items-start space-x-3 sm:space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 sm:mt-1 flex-shrink-0"></div>
              <div className="text-sm sm:text-xs">
                <span className="font-medium">Format:</span> JPG, PNG, WebP (max 5MB)
              </div>
            </div>
            <div className="flex items-start space-x-3 sm:space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 sm:mt-1 flex-shrink-0"></div>
              <div className="text-sm sm:text-xs">
                <span className="font-medium">Size:</span> Square aspect ratio works best
              </div>
            </div>
            <div className="flex items-start space-x-3 sm:space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 sm:mt-1 flex-shrink-0"></div>
              <div className="text-sm sm:text-xs">
                <span className="font-medium">Quality:</span> High resolution, clear facial features
              </div>
            </div>
            <div className="flex items-start space-x-3 sm:space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 sm:mt-1 flex-shrink-0"></div>
              <div className="text-sm sm:text-xs">
                <span className="font-medium">Note:</span> Consider industry standards for photos
              </div>
            </div>
          </div>
          
          {/* Mobile-specific tip */}
          <div className="mt-4 sm:hidden p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <span className="font-medium">Mobile Tip:</span> Use your device's camera for best results
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};