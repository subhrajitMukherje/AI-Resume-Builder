import React, { memo } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Calendar, Building, GraduationCap, ExternalLink } from 'lucide-react';

export const ModernTemplate: React.FC = memo(() => {
  const { data, sections } = useResumeStore();
  const visibleSections = sections.filter(section => section.visible).sort((a, b) => a.order - b.order);
  const customSectionsData = sections.filter(s => s.type === 'custom' && s.visible);

  return (
    <div className="bg-white text-gray-900 min-h-[11in] w-full max-w-[8.5in] mx-auto shadow-lg">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 flex items-center space-x-6">
        {/* Photo */}
        {data.personal.includePhoto && data.personal.photo && (
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
              <img
                src={data.personal.photo}
                alt={data.personal.name || 'Profile'}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        
        {/* Header Content */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">{data.personal.name || 'Your Name'}</h1>
          <div className="flex flex-wrap gap-4 text-sm">
            {data.personal.email && (
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>{data.personal.email}</span>
              </div>
            )}
            {data.personal.phone && (
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>{data.personal.phone}</span>
              </div>
            )}
            {data.personal.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{data.personal.location}</span>
              </div>
            )}
            {data.personal.website && (
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>{data.personal.website}</span>
              </div>
            )}
            {data.personal.linkedin && (
              <div className="flex items-center space-x-1">
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </div>
            )}
            {data.personal.github && (
              <div className="flex items-center space-x-1">
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {visibleSections.map((section) => {
          switch (section.type) {
            case 'summary':
              return data.summary && (
                <div key={section.id}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 pb-2 border-b-2 border-blue-600">
                    Professional Summary
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{data.summary}</p>
                </div>
              );

            case 'experience':
              return data.experience.length > 0 && (
                <div key={section.id}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 pb-2 border-b-2 border-blue-600">
                    Work Experience
                  </h2>
                  <div className="space-y-4">
                    {data.experience.map((exp) => (
                      <div key={exp.id} className="border-l-4 border-blue-200 pl-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
                            <div className="flex items-center space-x-2 text-blue-600 font-medium">
                              <Building className="w-4 h-4" />
                              <span>{exp.company}</span>
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                            </div>
                            {exp.location && (
                              <div className="flex items-center space-x-1 mt-1">
                                <MapPin className="w-4 h-4" />
                                <span>{exp.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {exp.description.length > 0 && (
                          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                            {exp.description.map((desc, index) => (
                              <li key={index}>{desc}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'education':
              return data.education.length > 0 && (
                <div key={section.id}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 pb-2 border-b-2 border-blue-600">
                    Education
                  </h2>
                  <div className="space-y-4">
                    {data.education.map((edu) => (
                      <div key={edu.id} className="border-l-4 border-purple-200 pl-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                              {edu.degree} in {edu.field}
                            </h3>
                            <div className="flex items-center space-x-2 text-purple-600 font-medium">
                              <GraduationCap className="w-4 h-4" />
                              <span>{edu.institution}</span>
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{edu.startDate} - {edu.endDate}</span>
                            </div>
                            {edu.gpa && (
                              <div className="font-medium mt-1">GPA: {edu.gpa}</div>
                            )}
                          </div>
                        </div>
                        {edu.description.length > 0 && (
                          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                            {edu.description.map((desc, index) => (
                              <li key={index}>{desc}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'skills':
              return data.skills.length > 0 && (
                <div key={section.id}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 pb-2 border-b-2 border-blue-600">
                    Skills
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.skills.map((skillCategory) => (
                      <div key={skillCategory.id}>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {skillCategory.category}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {skillCategory.items.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'projects':
              return data.projects.length > 0 && (
                <div key={section.id}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 pb-2 border-b-2 border-blue-600">
                    Projects
                  </h2>
                  <div className="space-y-4">
                    {data.projects.map((project) => (
                      <div key={project.id} className="border-l-4 border-green-200 pl-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                            <p className="text-gray-600 mt-1">{project.description}</p>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{project.startDate} - {project.endDate}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          {project.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          {project.link && (
                            <div className="flex items-center space-x-1 text-blue-600">
                              <ExternalLink className="w-4 h-4" />
                              <span>Live Demo</span>
                            </div>
                          )}
                          {project.github && (
                            <div className="flex items-center space-x-1 text-gray-600">
                              <Github className="w-4 h-4" />
                              <span>GitHub</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'custom':
              return customSectionsData.length > 0 && (
                <div key={section.id}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 pb-2 border-b-2 border-blue-600">
                    Custom Sections
                  </h2>
                  <div className="space-y-6">
                    {customSectionsData.map((customSection) => (
                      <div key={customSection.id}>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                          {customSection.title || 'Custom Section'}
                        </h3>
                        
                        {customSection.content?.type === 'text' && (
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {customSection.content?.content}
                          </p>
                        )}
                        
                        {customSection.content?.type === 'list' && customSection.content?.items && (
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {customSection.content.items.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        )}
                        
                        {customSection.content?.type === 'table' && customSection.content?.tableData && customSection.content.tableData.length > 0 && (
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="border-b-2 border-blue-200">
                                  {Object.keys(customSection.content.tableData[0] || {}).map((column) => (
                                    <th key={column} className="text-left py-2 px-3 font-semibold text-gray-800">
                                      {column}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {customSection.content.tableData.map((row, index) => (
                                  <tr key={index} className="border-b border-gray-200">
                                    {Object.values(row).map((value: any, cellIndex) => (
                                      <td key={cellIndex} className="py-2 px-3 text-gray-700">
                                        {value}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
});

ModernTemplate.displayName = 'ModernTemplate';