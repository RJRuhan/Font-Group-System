// FontContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';


// API base URL - you can change this based on your backend configuration
const API_URL = process.env.REACT_APP_API_URL;
const FontContext = createContext();

export const FontProvider = ({ children }) => {
  const [fonts, setFonts] = useState([]);
  const [fontGroups, setFontGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch fonts and font groups when component mounts
  useEffect(() => {
    fetchFonts();
    fetchFontGroups();
  }, []);

  // Fetch all fonts from API
  const fetchFonts = async () => {
    setLoading(true);
    try {
      console.log(`Fetching fonts from ${API_URL}/fonts`);
      const response = await fetch(`${API_URL}/fonts`);
      const result = await response.json();
      
      if (result.status) {
        // Load fonts into document using base64 encoded data
        result.data.forEach(font => {
          if (font.file) {
            // Create a Blob from the base64 data
            const binaryData = atob(font.file);
            const bytes = new Uint8Array(binaryData.length);
            for (let i = 0; i < binaryData.length; i++) {
              bytes[i] = binaryData.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: 'font/ttf' });
            
            // Create object URL from the blob
            const fontUrl = URL.createObjectURL(blob);
            
            // Load font
            const fontFace = new FontFace(font.name, `url(${fontUrl})`);
            fontFace.load().then(() => {
              document.fonts.add(fontFace);
            });
            
            // Add URL to font object for rendering
            font.url = fontUrl;
          }
        });
        
        setFonts(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error fetching fonts: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all font groups from API
  const fetchFontGroups = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/fontgroups`);
      const result = await response.json();
      
      if (result.status) {
        setFontGroups(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error fetching font groups: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a font
  const addFont = async (font) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('font', font.file);
      
      const response = await fetch(`${API_URL}/fonts/upload`, {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.status) {
        // Refresh fonts list after successful upload
        fetchFonts();
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      setError('Error uploading font: ' + err.message);
      return { status: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete a font
  const deleteFont = async (name) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/fonts/${encodeURIComponent(name)}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.status) {
        // Update local state
        setFonts(fonts.filter(font => font.name !== name));
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      setError('Error deleting font: ' + err.message);
      return { status: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Add a font group
  const addFontGroup = async (group) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/fontgroups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(group)
      });
      
      const result = await response.json();
      
      if (result.status) {
        // Refresh font groups
        fetchFontGroups();
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      setError('Error creating font group: ' + err.message);
      return { status: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete a font group
  const deleteFontGroup = async (name) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/fontgroups/${encodeURIComponent(name)}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.status) {
        // Update local state
        setFontGroups(fontGroups.filter(group => group.name !== name));
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      setError('Error deleting font group: ' + err.message);
      return { status: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update a font group
  const updateFontGroup = async (name, updatedGroup) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/fontgroups/${encodeURIComponent(name)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedGroup)
      });
      
      const result = await response.json();
      
      if (result.status) {
        // Refresh font groups
        fetchFontGroups();
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      setError('Error updating font group: ' + err.message);
      return { status: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Clear error message
  const clearError = () => {
    setError(null);
  };

  return (
    <FontContext.Provider value={{ 
      fonts, 
      fontGroups, 
      loading,
      error,
      addFont, 
      deleteFont, 
      addFontGroup, 
      deleteFontGroup, 
      updateFontGroup,
      clearError
    }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFontContext = () => useContext(FontContext);