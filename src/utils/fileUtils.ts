// File utility functions for resume download

export const generateResumeFileName = (
  personalData: { name?: string },
  template: string,
  includeDate = false
): string => {
  // Get the user's name or use default
  const name = personalData.name?.trim() || 'Resume';
  
  // Clean the name - remove special characters and replace spaces with underscores
  const cleanName = name
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
  
  // Capitalize template name
  const templateName = template.charAt(0).toUpperCase() + template.slice(1);
  
  // Add date if requested
  const dateStr = includeDate 
    ? `_${new Date().toISOString().split('T')[0].replace(/-/g, '')}` 
    : '';
  
  return `${cleanName}_Resume_${templateName}${dateStr}.pdf`;
};

export const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const validateFileName = (filename: string): boolean => {
  // Check for valid filename (no invalid characters)
  const invalidChars = /[<>:"/\\|?*]/;
  return !invalidChars.test(filename) && filename.length > 0 && filename.length <= 255;
};

export const sanitizeFileName = (filename: string): string => {
  return filename
    .replace(/[<>:"/\\|?*]/g, '_') // Replace invalid characters
    .replace(/\s+/g, '_') // Replace spaces
    .replace(/_+/g, '_') // Replace multiple underscores
    .substring(0, 255); // Limit length
};

// File size utilities
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// MIME type utilities
export const getMimeType = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
    html: 'text/html'
  };
  
  return mimeTypes[extension || ''] || 'application/octet-stream';
};

// Export configuration for different formats
export const getExportConfig = (format: 'pdf' | 'html' | 'txt') => {
  const configs = {
    pdf: {
      margin: 0.5,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait',
        compress: true
      }
    },
    html: {
      doctype: '<!DOCTYPE html>',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0'
    },
    txt: {
      encoding: 'utf-8',
      lineBreak: '\n'
    }
  };
  
  return configs[format];
};