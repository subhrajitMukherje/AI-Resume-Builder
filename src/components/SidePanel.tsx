import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ChevronDown, ChevronRight, Eye, EyeOff, GripVertical, Sparkles, Plus, Edit3, Check, X } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import { PersonalSection } from './sections/PersonalSection';
import { SummarySection } from './sections/SummarySection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { PhotoSection } from './sections/PhotoSection';
import { CustomSection } from './sections/CustomSection';

interface SidePanelProps {
  onGenerateBulletPoints: (experienceId: string) => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({ onGenerateBulletPoints }) => {
  const { theme, sections, reorderSections, toggleSectionVisibility, addSection, updateSectionTitle } = useResumeStore();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personal: true,
    summary: true,
    experience: true,
    education: false,
    skills: false,
    projects: false,
    photo: false
  });
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const startEditing = (sectionId: string, currentTitle: string) => {
    setEditingSection(sectionId);
    setEditingTitle(currentTitle);
  };

  const saveTitle = () => {
    if (editingSection && editingTitle.trim()) {
      updateSectionTitle(editingSection, editingTitle.trim());
    }
    setEditingSection(null);
    setEditingTitle('');
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setEditingTitle('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveTitle();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const DraggableSection: React.FC<{ 
    section: any; 
    index: number; 
    children: React.ReactNode;
  }> = ({ section, index, children }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'section',
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: 'section',
      hover: (item: { index: number }) => {
        if (item.index !== index) {
          const newSections = [...sections];
          const draggedSection = newSections[item.index];
          newSections.splice(item.index, 1);
          newSections.splice(index, 0, draggedSection);
          
          // Update order
          const updatedSections = newSections.map((s, i) => ({ ...s, order: i }));
          reorderSections(updatedSections);
          item.index = index;
        }
      },
    });

    return (
      <div
        ref={(node) => drag(drop(node))}
        className={`transition-all duration-200 ${
          isDragging ? 'opacity-50 scale-95' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    );
  };

  const renderSectionContent = (section: any) => {
    switch (section.type) {
      case 'personal':
        return <PersonalSection />;
      case 'summary':
        return <SummarySection />;
      case 'experience':
        return <ExperienceSection onGenerateBulletPoints={onGenerateBulletPoints} />;
      case 'education':
        return <EducationSection />;
      case 'skills':
        return <SkillsSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'photo':
        return <PhotoSection />;
      case 'custom':
        return <CustomSection sectionId={section.id} />;
      default:
        return null;
    }
  };

  return (
    <div className={`h-full overflow-y-auto ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
    } lg:border-r border-gray-200 dark:border-gray-700`}>
      
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Resume Builder
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Drag sections to reorder • Tap to expand/collapse
        </p>
      </div>
      
      {/* Sections */}
      <div className="space-y-3 p-4">
        {sections
          .sort((a, b) => a.order - b.order)
          .map((section, index) => (
            <DraggableSection key={section.id} section={section} index={index}>
              <div className={`border-2 rounded-2xl transition-all duration-200 overflow-hidden ${
                theme === 'dark'
                  ? 'border-gray-700 bg-gray-800'
                  : 'border-gray-200 bg-white'
              } ${section.visible ? 'shadow-lg' : 'opacity-60 shadow-sm'} hover:shadow-xl`}>
                
                {/* Section Header */}
                <div
                  className={`p-4 cursor-pointer flex items-center justify-between ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  } transition-all duration-200 active:scale-[0.98] touch-manipulation`}
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="touch-manipulation">
                      <GripVertical className={`w-5 h-5 text-gray-400 cursor-move ${editingSection === section.id ? 'opacity-50' : ''}`} />
                    </div>
                    <div>
                      {editingSection === section.id ? (
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={handleKeyPress}
                          className={`font-semibold text-lg bg-transparent border-b-2 border-blue-500 focus:outline-none ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="font-semibold text-lg">{section.title}</span>
                      )}
                      {!section.visible && (
                        <span className="ml-2 text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full">
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Edit Title Button - Only for custom sections */}
                    {section.type === 'custom' && editingSection !== section.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(section.id, section.title);
                        }}
                        className={`p-2 rounded-xl transition-all duration-200 touch-manipulation ${
                          theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                        } active:scale-90`}
                        title="Edit section name"
                      >
                        <Edit3 className="w-4 h-4 text-blue-500" />
                      </button>
                    )}

                    {/* Save/Cancel buttons when editing */}
                    {editingSection === section.id && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            saveTitle();
                          }}
                          className={`p-2 rounded-xl transition-all duration-200 touch-manipulation ${
                            theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          } active:scale-90`}
                          title="Save"
                        >
                          <Check className="w-4 h-4 text-green-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelEditing();
                          }}
                          className={`p-2 rounded-xl transition-all duration-200 touch-manipulation ${
                            theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          } active:scale-90`}
                          title="Cancel"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSectionVisibility(section.id);
                      }}
                      disabled={editingSection === section.id}
                      className={`p-2 rounded-xl transition-all duration-200 touch-manipulation ${
                        theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                      } active:scale-90 ${editingSection === section.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {section.visible ? (
                        <Eye className="w-5 h-5 text-green-500" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    <div className={`p-1 rounded-lg transition-transform duration-200 ${
                      expandedSections[section.id] ? 'rotate-180' : ''
                    } ${editingSection === section.id ? 'opacity-50' : ''}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                
                {/* Section Content */}
                {expandedSections[section.id] && (
                  <div className={`p-4 border-t transition-all duration-300 ${
                    theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'
                  }`}>
                    {renderSectionContent(section)}
                  </div>
                )}
              </div>
            </DraggableSection>
          ))}
      </div>

      {/* Add Custom Section Button */}
      <div className="px-4">
        <button
          onClick={() => {
            addSection({
              type: 'custom',
             title: `Custom Section ${sections.filter(s => s.type === 'custom').length + 1}`,
             content: {
               type: 'text',
               content: '',
               items: [],
               tableData: []
             },
              visible: true
            });
          }}
          className="w-full p-3 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-xl hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 flex items-center justify-center space-x-2 text-purple-600 dark:text-purple-400 font-medium active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Add Custom Section</span>
        </button>
      </div>

      {/* Bottom Padding for Mobile */}
      <div className="h-20 lg:h-4"></div>
    </div>
  );
};