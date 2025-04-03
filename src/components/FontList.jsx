import React, {useState} from 'react';
import { useFontContext } from '../context/FontContext';

const FontList = () => {
  const { fonts, deleteFont, fontGroups } = useFontContext();
  const [ error, setError ] = useState('');
  

  const handleDelete = (name) => {
    // check if the font is in any group
    const isInGroup = fontGroups.some(group => 
      group.fonts.some(groupFont => groupFont.name === name)
    );

    if (isInGroup) {
      setError('Cannot delete font that is in a group');
      return;
    }

    // Proceed with deletion
    deleteFont(name);
    setError('');
  };

  if (fonts.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Our Fonts</h2>
        <p className="text-gray-500">No fonts uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Our Fonts</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Font Name</th>
              <th className="py-2 px-4 border-b text-left">Preview</th>
              <th className="py-2 px-4 border-b text-left"></th>
            </tr>
          </thead>
          <tbody>
            {fonts.map((font) => (
              <tr key={font.name}>
                <td className="py-2 px-4 border-b">{font.name}</td>
                <td className="py-2 px-4 border-b">
                  <span style={{ fontFamily: font.name }} className="text-lg">
                    Example Style
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  <button 
                    onClick={() => handleDelete(font.name)} 
                    className="text-red-500 hover:text-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default FontList;