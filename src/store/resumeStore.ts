import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

export interface ResumeSection {
  id: string;
  type: 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'custom';
  title: string;
  content: any;
  order: number;
  visible: boolean;
}

export interface ResumeData {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
    photo?: string;
    includePhoto: boolean;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    description: string[];
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link?: string;
    github?: string;
    startDate: string;
    endDate: string;
  }>;
}

interface ResumeStore {
  data: ResumeData;
  sections: ResumeSection[];
  theme: 'light' | 'dark';
  template: 'modern' | 'minimalist' | 'ats';
  isGenerating: boolean;
  
  // Actions
  updatePersonal: (personal: Partial<ResumeData['personal']>) => void;
  updateSummary: (summary: string) => void;
  addExperience: (experience: Omit<ResumeData['experience'][0], 'id'>) => void;
  updateExperience: (id: string, experience: Partial<ResumeData['experience'][0]>) => void;
  deleteExperience: (id: string) => void;
  addEducation: (education: Omit<ResumeData['education'][0], 'id'>) => void;
  updateEducation: (id: string, education: Partial<ResumeData['education'][0]>) => void;
  deleteEducation: (id: string) => void;
  addSkillCategory: (category: Omit<ResumeData['skills'][0], 'id'>) => void;
  updateSkillCategory: (id: string, category: Partial<ResumeData['skills'][0]>) => void;
  deleteSkillCategory: (id: string) => void;
  addProject: (project: Omit<ResumeData['projects'][0], 'id'>) => void;
  updateProject: (id: string, project: Partial<ResumeData['projects'][0]>) => void;
  deleteProject: (id: string) => void;
  
  // Section management
  addSection: (section: Omit<ResumeSection, 'id' | 'order'>) => void;
  reorderSections: (sections: ResumeSection[]) => void;
  toggleSectionVisibility: (id: string) => void;
  updateSectionTitle: (id: string, title: string) => void;
  
  // UI
  toggleTheme: () => void;
  setTemplate: (template: 'modern' | 'minimalist' | 'ats') => void;
  setGenerating: (isGenerating: boolean) => void;
  
  // Storage
  saveResume: (name: string) => void;
  loadResume: (name: string) => void;
  getSavedResumes: () => string[];
  deleteResume: (name: string) => void;
}

const defaultResumeData: ResumeData = {
  personal: {
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    photo: '',
    includePhoto: false
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: []
};

const defaultSections: ResumeSection[] = [
  { id: 'personal', type: 'personal', title: 'Personal Information', content: null, order: 0, visible: true },
  { id: 'summary', type: 'summary', title: 'Professional Summary', content: null, order: 1, visible: true },
  { id: 'experience', type: 'experience', title: 'Work Experience', content: null, order: 2, visible: true },
  { id: 'education', type: 'education', title: 'Education', content: null, order: 3, visible: true },
  { id: 'skills', type: 'skills', title: 'Skills', content: null, order: 4, visible: true },
  { id: 'projects', type: 'projects', title: 'Projects', content: null, order: 5, visible: true },
  { id: 'photo', type: 'personal', title: 'Photo', content: null, order: 6, visible: false }
];

export const useResumeStore = create<ResumeStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
      data: defaultResumeData,
      sections: defaultSections,
      theme: 'light',
      template: 'modern',
      isGenerating: false,

      updatePersonal: (personal) =>
        set((state) => ({
          data: { ...state.data, personal: { ...state.data.personal, ...personal } }
        })),

      updateSummary: (summary) =>
        set((state) => ({
          data: { ...state.data, summary }
        })),

      addExperience: (experience) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: [...state.data.experience, { ...experience, id: Date.now().toString() }]
          }
        })),

      updateExperience: (id, experience) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.map(exp =>
              exp.id === id ? { ...exp, ...experience } : exp
            )
          }
        })),

      deleteExperience: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.filter(exp => exp.id !== id)
          }
        })),

      addEducation: (education) =>
        set((state) => ({
          data: {
            ...state.data,
            education: [...state.data.education, { ...education, id: Date.now().toString() }]
          }
        })),

      updateEducation: (id, education) =>
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.map(edu =>
              edu.id === id ? { ...edu, ...education } : edu
            )
          }
        })),

      deleteEducation: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.filter(edu => edu.id !== id)
          }
        })),

      addSkillCategory: (category) =>
        set((state) => ({
          data: {
            ...state.data,
            skills: [...state.data.skills, { ...category, id: Date.now().toString() }]
          }
        })),

      updateSkillCategory: (id, category) =>
        set((state) => ({
          data: {
            ...state.data,
            skills: state.data.skills.map(skill =>
              skill.id === id ? { ...skill, ...category } : skill
            )
          }
        })),

      deleteSkillCategory: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            skills: state.data.skills.filter(skill => skill.id !== id)
          }
        })),

      addProject: (project) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: [...state.data.projects, { ...project, id: Date.now().toString() }]
          }
        })),

      updateProject: (id, project) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.map(proj =>
              proj.id === id ? { ...proj, ...project } : proj
            )
          }
        })),

      deleteProject: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.filter(proj => proj.id !== id)
          }
        })),

      addSection: (section) =>
        set((state) => {
          const newSection = {
            ...section,
            id: `custom-${Date.now()}`,
            order: state.sections.length
          };
          return {
            sections: [...state.sections, newSection]
          };
        }),

      reorderSections: (sections) => set({ sections }),

      toggleSectionVisibility: (id) =>
        set((state) => ({
          sections: state.sections.map(section =>
            section.id === id ? { ...section, visible: !section.visible } : section
          )
        })),

      updateSectionTitle: (id, title) =>
        set((state) => ({
          sections: state.sections.map(section =>
            section.id === id ? { ...section, title } : section
          )
        })),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light'
        })),

      setTemplate: (template) => set({ template }),

      setGenerating: (isGenerating) => set({ isGenerating }),

      saveResume: (name) => {
        const { data, sections } = get();
        const savedResumes = JSON.parse(localStorage.getItem('savedResumes') || '{}');
        savedResumes[name] = { data, sections, savedAt: new Date().toISOString() };
        localStorage.setItem('savedResumes', JSON.stringify(savedResumes));
      },

      loadResume: (name) => {
        const savedResumes = JSON.parse(localStorage.getItem('savedResumes') || '{}');
        if (savedResumes[name]) {
          set({
            data: savedResumes[name].data,
            sections: savedResumes[name].sections
          });
        }
      },

      getSavedResumes: () => {
        const savedResumes = JSON.parse(localStorage.getItem('savedResumes') || '{}');
        return Object.keys(savedResumes);
      },

      deleteResume: (name) => {
        const savedResumes = JSON.parse(localStorage.getItem('savedResumes') || '{}');
        delete savedResumes[name];
        localStorage.setItem('savedResumes', JSON.stringify(savedResumes));
      }
    }),
      {
        name: 'resume-builder-storage',
        partialize: (state) => ({
          data: state.data,
          sections: state.sections,
          theme: state.theme,
          template: state.template
        })
      }
    )
  )
);