import React, { createContext, useState, useContext } from 'react';

const FontContext = createContext();

export const FontProvider = ({ children }) => {
  const [fonts, setFonts] = useState([]);
  const [fontGroups, setFontGroups] = useState([]);

  const addFont = (font) => {
    setFonts([...fonts, font]);
  };

  const deleteFont = (name) => {
    setFonts(fonts.filter(font => font.name !== name));
  };

  const addFontGroup = (group) => {
    setFontGroups([...fontGroups, { ...group}]);
  };

  const deleteFontGroup = (name) => {
    setFontGroups(fontGroups.filter(group => group.name !== name));
  };

  const updateFontGroup = (name, updatedGroup) => {
    setFontGroups(fontGroups.map(group => 
      group.name === name ? { ...updatedGroup} : group
    ));
  };

  return (
    <FontContext.Provider value={{ 
      fonts, 
      fontGroups, 
      addFont, 
      deleteFont, 
      addFontGroup, 
      deleteFontGroup, 
      updateFontGroup 
    }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFontContext = () => useContext(FontContext);
