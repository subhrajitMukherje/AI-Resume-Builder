import React, { memo } from 'react';
import { useResumeStore } from '../../store/resumeStore';

export const MinimalistTemplate: React.FC = memo(() => {
  const { data, sections } = useResumeStore();
  const visibleSections = sections.filter(section => section.visible).sort((a, b) => a.order - b.order);
  const customSectionsData = sections.filter(s => s.type === 'custom' && s.visible);

  return (
    <div className="bg-white text-gray-900 min-h-[11in] w-full max-w-[8.5in] mx-auto shadow-lg p-8">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-gray-200 flex flex-col items-center">
        {/* Photo */}
        {data.personal.includePhoto && data.personal.photo && (
          <div className="mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 shadow-lg mx-auto">
              <img
                src={data.personal.photo}
                alt={data.personal.name || 'Profile'}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        
        <h1 className="text-3xl font-light mb-2 tracking-wide">
          {data.personal.name || 'Your Name'}
        </h1>
        <div className="flex justify-center flex-wrap gap-3 text-sm text-gray-600">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
          {data.personal.website && <span>{data.personal.website}</span>}
          {data.personal.linkedin && <span>LinkedIn</span>}
          {data.personal.github && <span>GitHub</span>}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {visibleSections.map((section) => {
          switch (section.type) {
            case 'summary':
              return data.summary && (
                <div key={section.id}>
                  <h2 className="text-lg font-medium mb-3 tracking-wide uppercase text-gray-800">
                    Summary
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{data.summary}</p>
                </div>
              );

            case 'experience':
              return data.experience.length > 0 && (
                <div key={section.id}>
                  <h2 className="text-lg font-medium mb-4 tracking-wide uppercase text-gray-800">
                    Experience
                  </h2>
                  <div className="space-y-6">
                    {data.experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-medium text-gray-800">{exp.position}</h3>
                            <p className="text-gray-600">{exp.company}</p>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <div>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                            {exp.location && <div>{exp.location}</div>}
                          </div>
                        </div>
                        {exp.description.length > 0 && (
                          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
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
                  <h2 className="text-lg font-medium mb-4 tracking-wide uppercase text-gray-800">
                    Education
                  </h2>
                  <div className="space-y-4">
                    {data.education.map((edu) => (
                      <div key={edu.id}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-medium text-gray-800">
                              {edu.degree} in {edu.field}
                            </h3>
                            <p className="text-gray-600">{edu.institution}</p>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <div>{edu.startDate} - {edu.endDate}</div>
                            {edu.gpa && <div>GPA: {edu.gpa}</div>}
                          </div>
                        </div>
                        {edu.description.length > 0 && (
                          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
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
                  <h2 className="text-lg font-medium mb-4 tracking-wide uppercase text-gray-800">
                    Skills
                  </h2>
                  <div className="space-y-3">
                    {data.skills.map((skillCategory) => (
                      <div key={skillCategory.id} className="flex">
                        <div className="w-32 font-medium text-gray-800 flex-shrink-0">
                          {skillCategory.category}:
                        </div>
                        <div className="flex-1">
                          {skillCategory.items.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'projects':
              return data.projects.length > 0 && (
                <div key={section.id}>
                  <h2 className="text-lg font-medium mb-4 tracking-wide uppercase text-gray-800">
                    Projects
                  </h2>
                  <div className="space-y-4">
                    {data.projects.map((project) => (
                      <div key={project.id}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-medium text-gray-800">{project.name}</h3>
                            <p className="text-gray-600 text-sm">{project.description}</p>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <div>{project.startDate} - {project.endDate}</div>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                        </div>
                        
                        <div className="flex space-x-4 text-sm text-gray-600">
                          {project.link && <span>Live Demo</span>}
                          {project.github && <span>GitHub</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'custom':
              return customSectionsData.length > 0 && (
                <div key={section.id}>
                  <h2 className="text-lg font-medium mb-4 tracking-wide uppercase text-gray-800">
                    Custom Sections
                  </h2>
                  <div className="space-y-6">
                    {customSectionsData.map((customSection) => (
                      <div key={customSection.id}>
                        <h3 className="text-lg font-medium text-gray-800 mb-3">
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
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-300">
                                  {Object.keys(customSection.content.tableData[0] || {}).map((column) => (
                                    <th key={column} className="text-left py-2 px-3 font-medium text-gray-800">
                                      {column}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {customSection.content.tableData.map((row, index) => (
                                  <tr key={index} className="border-b border-gray-100">
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

MinimalistTemplate.displayName = 'MinimalistTemplate';