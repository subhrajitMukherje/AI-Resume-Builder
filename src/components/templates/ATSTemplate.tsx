import React, { memo } from 'react';
import { useResumeStore } from '../../store/resumeStore';

export const ATSTemplate: React.FC = memo(() => {
  const { data, sections } = useResumeStore();
  const visibleSections = sections.filter(section => section.visible).sort((a, b) => a.order - b.order);
  const customSectionsData = sections.filter(s => s.type === 'custom' && s.visible);

  return (
    <div className="bg-white text-black min-h-[11in] w-full max-w-[8.5in] mx-auto shadow-lg p-8 font-serif">
      {/* Header */}
      <div className="text-center mb-6">
        {/* Photo */}
        {data.personal.includePhoto && data.personal.photo && (
          <div className="mb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-black mx-auto">
              <img
                src={data.personal.photo}
                alt={data.personal.name || 'Profile'}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        
        <h1 className="text-2xl font-bold mb-2">
          {data.personal.name || 'Your Name'}
        </h1>
        <div className="text-sm space-x-2">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>| {data.personal.phone}</span>}
          {data.personal.location && <span>| {data.personal.location}</span>}
          {data.personal.website && <span>| {data.personal.website}</span>}
          {data.personal.linkedin && <span>| LinkedIn</span>}
          {data.personal.github && <span>| GitHub</span>}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {visibleSections.map((section) => {
          switch (section.type) {
            case 'summary':
              return data.summary && (
                <div key={section.id}>
                  <h2 className="text-lg font-bold mb-2 border-b border-black">
                    PROFESSIONAL SUMMARY
                  </h2>
                  <p className="text-sm leading-relaxed">{data.summary}</p>
                </div>
              );

            case 'experience':
              return data.experience.length > 0 && (
                <div key={section.id}>
                  <h2 className="text-lg font-bold mb-2 border-b border-black">
                    WORK EXPERIENCE
                  </h2>
                  <div className="space-y-4">
                    {data.experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="font-bold">{exp.position}</h3>
                            <p className="font-medium">{exp.company}</p>
                          </div>
                          <div className="text-right text-sm">
                            <div>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                            {exp.location && <div>{exp.location}</div>}
                          </div>
                        </div>
                        {exp.description.length > 0 && (
                          <ul className="list-disc list-inside space-y-1 text-sm ml-4">
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
                  <h2 className="text-lg font-bold mb-2 border-b border-black">
                    EDUCATION
                  </h2>
                  <div className="space-y-3">
                    {data.education.map((edu) => (
                      <div key={edu.id}>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="font-bold">
                              {edu.degree} in {edu.field}
                            </h3>
                            <p className="font-medium">{edu.institution}</p>
                          </div>
                          <div className="text-right text-sm">
                            <div>{edu.startDate} - {edu.endDate}</div>
                            {edu.gpa && <div>GPA: {edu.gpa}</div>}
                          </div>
                        </div>
                        {edu.description.length > 0 && (
                          <ul className="list-disc list-inside space-y-1 text-sm ml-4">
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
                  <h2 className="text-lg font-bold mb-2 border-b border-black">
                    SKILLS
                  </h2>
                  <div className="space-y-2">
                    {data.skills.map((skillCategory) => (
                      <div key={skillCategory.id} className="text-sm">
                        <span className="font-bold">{skillCategory.category}:</span>{' '}
                        {skillCategory.items.join(', ')}
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'projects':
              return data.projects.length > 0 && (
                <div key={section.id}>
                  <h2 className="text-lg font-bold mb-2 border-b border-black">
                    PROJECTS
                  </h2>
                  <div className="space-y-3">
                    {data.projects.map((project) => (
                      <div key={project.id}>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="font-bold">{project.name}</h3>
                            <p className="text-sm">{project.description}</p>
                          </div>
                          <div className="text-right text-sm">
                            <div>{project.startDate} - {project.endDate}</div>
                          </div>
                        </div>
                        
                        <div className="text-sm mb-1">
                          <span className="font-bold">Technologies:</span> {project.technologies.join(', ')}
                        </div>
                        
                        <div className="text-sm">
                          {project.link && <span className="font-bold">Live Demo</span>}
                          {project.link && project.github && <span> | </span>}
                          {project.github && <span className="font-bold">GitHub</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'custom':
              return customSectionsData.length > 0 && (
                <div key={section.id}>
                  <h2 className="text-lg font-bold mb-2 border-b border-black">
                    CUSTOM SECTIONS
                  </h2>
                  <div className="space-y-4">
                    {customSectionsData.map((customSection) => (
                      <div key={customSection.id}>
                        <h3 className="font-bold mb-2">{customSection.title?.toUpperCase() || 'CUSTOM SECTION'}</h3>
                        
                        {customSection.content?.type === 'text' && (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {customSection.content?.content}
                          </p>
                        )}
                        
                        {customSection.content?.type === 'list' && customSection.content?.items && (
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {customSection.content.items.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        )}
                        
                        {customSection.content?.type === 'table' && customSection.content?.tableData && customSection.content.tableData.length > 0 && (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-black">
                                  {Object.keys(customSection.content.tableData[0] || {}).map((column) => (
                                    <th key={column} className="text-left py-1 px-2 font-bold">
                                      {column.toUpperCase()}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {customSection.content.tableData.map((row, index) => (
                                  <tr key={index} className="border-b border-gray-300">
                                    {Object.values(row).map((value: any, cellIndex) => (
                                      <td key={cellIndex} className="py-1 px-2">
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

ATSTemplate.displayName = 'ATSTemplate';