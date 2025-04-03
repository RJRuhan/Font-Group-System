import React, { useState } from 'react';
import { useFontContext } from '../context/FontContext';
import { XMarkIcon } from "@heroicons/react/24/solid";



const FontGroupForm = () => {
  const { fonts, fontGroups, addFontGroup } = useFontContext();
  const [groupName, setGroupName] = useState('');
  const [fontSelections, setFontSelections] = useState([{ name: '' }]);
  const [error, setError] = useState('');

  const handleAddRow = () => {
    setFontSelections([...fontSelections, { name: '' }]);
  };

  const handleRemoveRow = (index) => {
    const newSelections = [...fontSelections];
    newSelections.splice(index, 1);
    // Ensure at least one selection remains
    if (newSelections.length === 0) {
      newSelections.push({ name: '' });
    }
    setFontSelections(newSelections);
  };

  const handleFontChange = (index, name) => {
    const newSelections = [...fontSelections];
    newSelections[index].name = name;
    setFontSelections(newSelections);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty selections
    const validSelections = fontSelections.filter(s => s.name);
    
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }
    
    if (validSelections.length < 2) {
      setError('At least two fonts must be selected');
      return;
    }

    // Check for group name duplicates
    if (fontGroups.some(group => group.name === groupName)) {
      setError('Font group with this name already exists');
      return;
    }

    
    // Create the font group
    const selectedFonts = validSelections.map(selection => {
      const font = fonts.find(f => f.name === selection.name);
      return font;
    }).filter(Boolean);
    
    addFontGroup({
      name: groupName,
      fonts: selectedFonts
    });
    
    // Reset form
    setGroupName('');
    setFontSelections([{ name: '' }]);
    setError('');
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2">Create Font Group</h2>
      <p className="mb-4">You have to select at least two fonts</p>
      
      <form onSubmit={handleSubmit} className=" p-4 rounded-lg">
        {/* Group Name Input */}
        <div className="mb-6">
          <label className="block mb-2 font-medium" style={{display:"none"}}>Group Name:</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Group Title"
          />
        </div>

        {/* Font Selections */}
          <div className="space-y-4">
            {fontSelections.map((selection, index) => {
              // Get the list of fonts that are not already selected
              const availableFonts = fonts.filter(
                (font) => !fontSelections.some((s, i) => s.name === font.name && i !== index)
              );

              return (
                <div key={index} className="p-4 border rounded-lg shadow flex items-center justify-between">
            <select
              value={selection.name}
              onChange={(e) => handleFontChange(index, e.target.value)}
              className="flex-grow border rounded p-2"
              style={{ maxWidth: '200px' }}
            >
              <option value="">Select a font</option>
              {availableFonts.map((font, idx) => (
                <option key={idx} value={font.name}>
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
          </div>

          {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleAddRow}
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            +Add Row
          </button>

          <button
            type="submit"
            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Create
          </button>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default FontGroupForm;