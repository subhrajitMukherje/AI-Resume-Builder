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
    <div className="space-y-6">
      {/* Photo Visibility Toggle */}
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 text-sm font-medium">
          <Camera className="w-4 h-4 text-blue-500" />
          <span>Profile Photo</span>
        </label>
        <div className="flex items-center space-x-2">
          {/* Plus button for photo upload */}
          <button
            onClick={triggerFileInput}
            disabled={!data.personal.includePhoto}
            className={`p-2 rounded-lg transition-all duration-200 ${
              data.personal.includePhoto
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg active:scale-95'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
            title={data.personal.includePhoto ? 'Upload photo from desktop' : 'Enable photo first'}
          >
            <Plus className="w-4 h-4" />
          </button>
          
          {/* Enable/Disable toggle */}
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
          disabled={!data.personal.includePhoto}
        />
      </div>

      {/* Upload Buttons */}
      {data.personal.includePhoto && (
        <div className="space-y-3">
          {/* Primary Upload Button */}
          <button
            onClick={triggerFileInput}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium active:scale-95 shadow-lg"
          >
            <Upload className="w-5 h-5" />
            <span>{data.personal.photo ? 'Change Photo' : 'Upload Photo'}</span>
          </button>
          
          {/* Alternative Upload Button */}
          <button
            onClick={triggerFileInput}
            className={`w-full px-4 py-3 border-2 border-dashed rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 font-medium active:scale-95 ${
              theme === 'dark'
                ? 'border-blue-400 text-blue-400 hover:bg-blue-900/20 hover:border-blue-300'
                : 'border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600'
            }`}
          >
            <ImagePlus className="w-5 h-5" />
            <span>Browse Files</span>
          </button>

          {/* Quick Add Button */}
          <button
            onClick={triggerFileInput}
            className={`w-full px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm font-medium active:scale-95 ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Profile Picture</span>
          </button>
        </div>
      )}

      {/* Enhanced Guidelines */}
      <div className={`text-xs text-gray-500 dark:text-gray-400 space-y-1 ${
        !data.personal.includePhoto ? 'opacity-50' : ''
      }`}>
        <div className={`p-4 rounded-xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-600' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <h4 className="font-medium text-sm mb-3 text-blue-600 dark:text-blue-400 flex items-center space-x-2">
            <Camera className="w-4 h-4" />
            <span>Photo Guidelines</span>
          </h4>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div>
                <span className="font-medium">Recommended:</span> Professional headshot with good lighting
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div>
                <span className="font-medium">Format:</span> JPG, PNG, WebP (max 5MB)
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div>
                <span className="font-medium">Size:</span> Square aspect ratio works best
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div>
                <span className="font-medium">Quality:</span> High resolution, clear facial features
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div>
                <span className="font-medium">Note:</span> Consider industry standards for photos
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};