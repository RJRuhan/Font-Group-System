import React, { useState } from 'react';
import { useFontContext } from '../context/FontContext';
import { XMarkIcon } from "@heroicons/react/24/solid";

const FontGroupList = () => {
  const { fontGroups, deleteFontGroup, updateFontGroup, fonts } = useFontContext();
  const [editingGroup, setEditingGroup] = useState(null);
  const [editName, setEditName] = useState('');
  const [editFontSelections, setEditFontSelections] = useState([]);
  const [editError, setEditError] = useState('');

  const handleEdit = (group) => {
    setEditingGroup(group.name);
    setEditName(group.name);
    setEditFontSelections(group.fonts.map(font => ({ name: font.name })));
    setEditError('');
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    setEditName('');
    setEditFontSelections([]);
    setEditError('');
  };

  const handleSaveEdit = (name) => {
    if (!editName.trim()) {
      setEditError('Group name is required');
      return;
    }

    // Check for group name duplicates
    if (fontGroups.some(group => group.name === editName && group.name !== name)) {
      setEditError('Font group with this name already exists');
      return;
    }
    
    // Filter out empty selections
    const validSelections = editFontSelections.filter(s => s.name);
    
    if (validSelections.length < 2) {
      setEditError('At least two fonts must be selected');
      return;
    }
    
    // Create updated font group
    const selectedFonts = validSelections.map(selection => {
      const font = fonts.find(f => f.name === selection.name);
      return font;
    }).filter(Boolean);
    
    updateFontGroup(name, {
      name: editName,
      fonts: selectedFonts
    });
    
    // Reset form
    setEditingGroup(null);
    setEditName('');
    setEditFontSelections([]);
    setEditError('');
  };

  const handleAddRow = () => {
    setEditFontSelections([...editFontSelections, { name: '' }]);
  };

  const handleRemoveRow = (index) => {
    const newSelections = [...editFontSelections];
    newSelections.splice(index, 1);
    // Ensure at least one selection remains
    if (newSelections.length === 0) {
      newSelections.push({ name: '' });
    }
    setEditFontSelections(newSelections);
  };

  const handleFontChange = (index, name) => {
    const newSelections = [...editFontSelections];
    newSelections[index].name = name;
    setEditFontSelections(newSelections);
  };

  if (fontGroups.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Font Groups</h2>
        <p className="text-gray-500">No font groups created yet.</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Font Groups</h2>
      <div className="space-y-4">
        {fontGroups.map((group, idx) => (
          <div key={idx} className="bg-white p-4 border rounded-lg">
            {editingGroup === group.name ? (
              <div className="space-y-2">
                <div>
                  <label className="block mb-1 font-medium" style={{display:"none"}}>Group Name:</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Group Title"
                  />
                </div>
                
                {editFontSelections.map((selection, index) => {
                  // Get the list of fonts that are not already selected
                  const availableFonts = fonts.filter(
                    (font) => !editFontSelections.some((s, i) => s.name === font.name && i !== index)
                  );

                  return (
                  <div key={index} className="flex items-center gap-2">
                    <select
                      value={selection.name}
                      onChange={(e) => handleFontChange(index, e.target.value)}
                      className="flex-grow p-2 border rounded"
                    >
                      <option value="">Select a font</option>
                      {availableFonts.map((font, font_idx) => (
                        <option key={font_idx} value={font.name}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(index)}
                      className="p-2 text-red-500 hover:text-red-600"
                    >
                      <XMarkIcon className="h-7 w-7" />
                    </button>
                  </div>
                  );
                })}
                
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  +Add Row
                </button>
                
                {editError && <p className="text-red-500">{editError}</p>}
                
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveEdit(group.name)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="text-lg font-semibold">{group.name}</h3>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(group)}
                      className="p-1 px-3 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteFontGroup(group.name)}
                      className="p-1 px-3 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="border-t pt-2">
                  <h4 className="font-medium mb-1">Fonts in this group:</h4>
                  <ul className="list-disc pl-5">
                    {group.fonts.map((font, idx) => (
                      <li key={idx}>
                        <span style={{ fontFamily: font.name }}>
                          {font.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FontGroupList;