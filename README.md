# 🚀 AI Resume Builder

A modern, AI-powered resume builder with drag-and-drop functionality, multiple professional templates, and intelligent content generation. Built with React, TypeScript, and OpenAI integration.

![AI Resume Builder](https://img.shields.io/badge/React-18.3.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-blue) ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-green)

## ✨ Features

### 🤖 AI-Powered Content Generation
- **Smart Bullet Points**: Generate professional bullet points based on job descriptions
- **Professional Summaries**: AI-crafted summaries tailored to your experience
- **Job Description Analysis**: Extract key skills and keywords from job postings
- **Skills Suggestions**: Get relevant skills recommendations for your field
- **Content Improvement**: Enhance existing content with AI assistance

### 📱 Modern User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes for comfortable editing
- **Drag & Drop**: Reorder resume sections with intuitive drag-and-drop
- **Real-time Preview**: See changes instantly as you edit
- **Mobile-Optimized**: Full functionality on mobile devices

### 🎨 Professional Templates
- **Modern Template**: Colorful, professional design with gradients
- **Minimalist Template**: Clean, simple layout focusing on content
- **ATS-Friendly Template**: Optimized for Applicant Tracking Systems

### 📸 Photo Integration
- **Profile Photo Upload**: Add professional photos to your resume
- **Smart Cropping**: Automatic image optimization and preview
- **Visibility Control**: Toggle photo visibility per template
- **Multiple Formats**: Support for JPG, PNG (up to 5MB)

### 💾 Data Management
- **Local Storage**: Save multiple resume versions locally
- **Export Options**: Download as high-quality PDF
- **Import/Export**: Backup and restore your resume data
- **Auto-save**: Never lose your progress

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and functional components
- **TypeScript 5.5.3** - Type-safe development
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Vite 5.4.2** - Fast build tool and dev server

### State Management
- **Zustand 5.0.6** - Lightweight state management
- **React DnD 16.0.1** - Drag and drop functionality

### AI Integration
- **OpenAI API** - GPT-3.5-turbo for content generation
- **Custom AI Service** - Tailored prompts for resume optimization

### UI Components
- **Lucide React** - Beautiful, customizable icons
- **HTML2PDF.js** - Client-side PDF generation
- **File Saver** - File download utilities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-resume-builder.git
cd ai-resume-builder
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file in the root directory
cp .env.example .env

# Add your OpenAI API key (optional)
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## 🔧 Configuration

### OpenAI API Setup (Optional)

To enable AI features, you'll need an OpenAI API key:

1. **Get an API key**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create an account or sign in
   - Generate a new API key

2. **Add to environment**
```bash
# In your .env file
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
```

3. **Restart the development server**
```bash
npm run dev
```

### Without OpenAI API
The app works perfectly without an API key! AI features will show helpful fallback content and mock data for demonstration purposes.

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── sections/        # Resume section components
│   │   ├── PersonalSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── EducationSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── SummarySection.tsx
│   │   ├── PhotoSection.tsx
│   │   └── CustomSection.tsx
│   ├── templates/       # Resume templates
│   │   ├── ModernTemplate.tsx
│   │   ├── MinimalistTemplate.tsx
│   │   └── ATSTemplate.tsx
│   ├── AIAssistant.tsx  # AI-powered features
│   ├── BulletPointGenerator.tsx
│   ├── ExportModal.tsx  # PDF export functionality
│   ├── Header.tsx       # Main navigation
│   ├── MobileMenu.tsx   # Mobile navigation
│   ├── ResumeBuilder.tsx # Main app component
│   ├── ResumePreview.tsx # Live preview
│   ├── SaveLoadModal.tsx # Data management
│   └── SidePanel.tsx    # Editing interface
├── hooks/               # Custom React hooks
│   └── usePerformance.ts
├── services/            # External services
│   └── openaiService.ts # OpenAI integration
├── store/               # State management
│   └── resumeStore.ts   # Zustand store
├── utils/               # Utility functions
│   ├── fileUtils.ts     # File operations
│   └── performance.ts   # Performance optimizations
├── App.tsx              # Root component
└── main.tsx            # Entry point
```

## 🎯 Key Components

### ResumeStore (Zustand)
Central state management for:
- Resume data (personal info, experience, education, etc.)
- UI state (theme, template, sections)
- Persistence (local storage)
- Section management (reordering, visibility)

### AI Service
Handles all OpenAI API interactions:
- Bullet point generation
- Professional summary creation
- Job description analysis
- Skills suggestions
- Content improvement

### Template System
Modular template architecture:
- Easy to add new templates
- Consistent data structure
- Template-specific styling
- Export optimization

### Section Management
Dynamic section system:
- Drag & drop reordering
- Custom sections
- Visibility toggles
- Flexible content types

## 🔨 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Deployment
npm run deploy       # Build and deploy (configure as needed)
```

## 📱 Mobile Support

The app is fully responsive and optimized for mobile devices:

- **Touch-friendly interface** with larger tap targets
- **Mobile-specific navigation** with collapsible menus
- **Optimized layouts** for small screens
- **Touch gestures** for drag & drop on mobile
- **Mobile PDF export** with optimized settings

## 🎨 Customization

### Adding New Templates

1. **Create template component**
```tsx
// src/components/templates/YourTemplate.tsx
export const YourTemplate: React.FC = () => {
  const { data, sections } = useResumeStore();
  
  return (
    <div className="your-template-styles">
      {/* Your template JSX */}
    </div>
  );
};
```

2. **Register in ResumePreview**
```tsx
// src/components/ResumePreview.tsx
const TemplateComponent = useMemo(() => {
  switch (template) {
    case 'your-template':
      return YourTemplate;
    // ... other cases
  }
}, [template]);
```

3. **Add to template selector**
```tsx
// Update template options in Header.tsx and ExportModal.tsx
```

### Custom Sections

Users can add custom sections with different content types:
- **Text**: Paragraph content
- **List**: Bullet point lists  
- **Table**: Structured data tables

### Theming

The app supports light and dark themes using Tailwind CSS:
```tsx
// Theme classes are applied conditionally
className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
```

## 🚀 Deployment

### Netlify :- https://loquacious-fudge-608546.netlify.app/

## 🔒 Environment Variables

```bash
# .env file
VITE_OPENAI_API_KEY=your_openai_api_key_here  # Optional: For AI features
```

**Security Note**: The OpenAI API key is exposed in the browser. For production apps, implement a backend proxy to secure API keys.

## 🐛 Troubleshooting

### Common Issues

**AI features not working**
- Check if `VITE_OPENAI_API_KEY` is set correctly
- Verify your OpenAI account has available credits
- Check browser console for API errors

**PDF export issues**
- Ensure you're using a modern browser
- Check if popup blockers are disabled
- Try a different template if export fails

**Mobile drag & drop not working**
- The app automatically detects touch devices
- Ensure you're using a supported mobile browser
- Try refreshing the page

**Performance issues**
- The app includes performance optimizations
- Large images may slow down the app
- Consider using smaller image files

### Getting Help

1. **Check the browser console** for error messages
2. **Verify environment setup** according to this README
3. **Test with a fresh browser session** to rule out cache issues
4. **Check OpenAI API status** at [status.openai.com](https://status.openai.com)

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines

- **TypeScript**: Use proper typing for all components
- **Performance**: Implement React.memo for expensive components
- **Accessibility**: Ensure components are accessible
- **Mobile**: Test on mobile devices
- **Code Style**: Follow existing patterns and use ESLint

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT API
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icons
- **Zustand** for lightweight state management

## 📞 Support

If you encounter any issues or have questions:

1. **Check this README** for common solutions
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Join our community** for discussions and help

---

**Built with ❤️ using React, TypeScript, and AI**

*Happy resume building! 🎉*
