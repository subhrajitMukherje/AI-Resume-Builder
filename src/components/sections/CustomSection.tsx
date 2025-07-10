import React, { useState } from 'react';
import { Plus, Edit, Trash2, Type, List, Table, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

interface CustomSectionProps {
  sectionId: string;
}

export const CustomSection: React.FC<CustomSectionProps> = ({ sectionId }) => {
  const { sections, theme } = useResumeStore();
  const section = sections.find(s => s.id === sectionId);
  
  if (!section || section.type !== 'custom') {
    return null;
  }

  const content = section.content || {
    type: 'text',
    content: '',
    items: [],
    tableData: []
  };

  const [formData, setFormData] = useState(content);
  const [currentItem, setCurrentItem] = useState('');
  const [tableColumns, setTableColumns] = useState(['Column 1', 'Column 2']);
  const [currentRow, setCurrentRow] = useState<Record<string, string>>({});

  const { sections: allSections, reorderSections } = useResumeStore();

  const updateSectionContent = (newContent: any) => {
    const updatedSections = allSections.map(s => 
      s.id === sectionId ? { ...s, content: newContent } : s
    );
    reorderSections(updatedSections);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSectionContent(formData);
  };

  const addListItem = () => {
    if (currentItem.trim()) {
      setFormData({
        ...formData,
        items: [...(formData.items || []), currentItem.trim()]
      });
      setCurrentItem('');
    }
  };

  const removeListItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items?.filter((_, i) => i !== index) || []
    });
  };

  const addTableRow = () => {
    const hasData = tableColumns.some(col => currentRow[col]?.trim());
    if (hasData) {
      setFormData({
        ...formData,
        tableData: [...(formData.tableData || []), { ...currentRow }]
      });
      setCurrentRow({});
    }
  };

  const removeTableRow = (index: number) => {
    setFormData({
      ...formData,
      tableData: formData.tableData?.filter((_, i) => i !== index) || []
    });
  };

  const addTableColumn = () => {
    const newColumn = `Column ${tableColumns.length + 1}`;
    setTableColumns([...tableColumns, newColumn]);
  };

  const updateColumnName = (index: number, name: string) => {
    const newColumns = [...tableColumns];
    newColumns[index] = name;
    setTableColumns(newColumns);
    
    // Update existing table data
    const updatedTableData = formData.tableData?.map(row => {
      const newRow = { ...row };
      if (row[tableColumns[index]]) {
        newRow[name] = row[tableColumns[index]];
        delete newRow[tableColumns[index]];
      }
      return newRow;
    }) || [];
    
    setFormData({ ...formData, tableData: updatedTableData });
  };

  const inputClass = `w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
    theme === 'dark'
      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  }`;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Section Type *</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'text', label: 'Text', icon: Type, desc: 'Paragraph content' },
              { value: 'list', label: 'List', icon: List, desc: 'Bullet points' },
              { value: 'table', label: 'Table', icon: Table, desc: 'Structured data' }
            ].map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value as any })}
                  className={`p-3 border-2 rounded-xl text-center transition-all ${
                    formData.type === type.value
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto mb-1" />
                  <div className="font-medium text-sm">{type.label}</div>
                  <div className="text-xs text-gray-500">{type.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Based on Type */}
        {formData.type === 'text' && (
          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className={`${inputClass} resize-none`}
              rows={4}
              placeholder="Enter your content here..."
              required
            />
          </div>
        )}

        {formData.type === 'list' && (
          <div>
            <label className="block text-sm font-medium mb-2">List Items</label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentItem}
                  onChange={(e) => setCurrentItem(e.target.value)}
                  className={inputClass}
                  placeholder="Add a list item..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addListItem())}
                />
                <button
                  type="button"
                  onClick={addListItem}
                  className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {formData.items && formData.items.length > 0 && (
                <div className="space-y-2">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="flex-1 text-sm">{item}</span>
                      <button
                        type="button"
                        onClick={() => removeListItem(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {formData.type === 'table' && (
          <div>
            <label className="block text-sm font-medium mb-2">Table Data</label>
            <div className="space-y-4">
              {/* Column Headers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Columns</span>
                  <button
                    type="button"
                    onClick={addTableColumn}
                    className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    + Add Column
                  </button>
                </div>
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${tableColumns.length}, 1fr)` }}>
                  {tableColumns.map((column, index) => (
                    <input
                      key={index}
                      type="text"
                      value={column}
                      onChange={(e) => updateColumnName(index, e.target.value)}
                      className={`${inputClass} text-sm`}
                      placeholder={`Column ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Add Row */}
              <div>
                <div className="text-sm font-medium mb-2">Add Row</div>
                <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: `repeat(${tableColumns.length}, 1fr)` }}>
                  {tableColumns.map((column) => (
                    <input
                      key={column}
                      type="text"
                      value={currentRow[column] || ''}
                      onChange={(e) => setCurrentRow({ ...currentRow, [column]: e.target.value })}
                      className={`${inputClass} text-sm`}
                      placeholder={column}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addTableRow}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Add Row
                </button>
              </div>

              {/* Table Preview */}
              {formData.tableData && formData.tableData.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {tableColumns.map((column) => (
                          <th key={column} className="text-left py-2 px-3 font-medium">
                            {column}
                          </th>
                        ))}
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.tableData.map((row, index) => (
                        <tr key={index} className="border-t">
                          {tableColumns.map((column) => (
                            <td key={column} className="py-2 px-3">
                              {row[column] || ''}
                            </td>
                          ))}
                          <td className="py-2 px-3">
                            <button
                              type="button"
                              onClick={() => removeTableRow(index)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        
        <button
          type="submit"
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-medium active:scale-95"
        >
          Update Section
        </button>
      </form>
    </div>
  );
};