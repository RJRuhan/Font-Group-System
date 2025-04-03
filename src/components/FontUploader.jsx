import React, { useState, useRef } from 'react';
import { useFontContext } from '../context/FontContext';

const FontUploader = () => {
  const { fonts, addFont } = useFontContext();
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith('.ttf')) {
      setError('Only TTF files are allowed');
      return;
    }
    
    setError('');
    const fontName = file.name.replace('.ttf', '');
    const fontUrl = URL.createObjectURL(file);

    // Check if the same font is already uploaded
    if (fonts.some(font => font.name === fontName)) {
      setError('Font with this name already exists');
      return;
    }

    
    const fontFace = new FontFace(fontName, `url(${fontUrl})`);
    fontFace.load().then(() => {
      document.fonts.add(fontFace);
      addFont({name: fontName, file, url: fontUrl });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }).catch(err => {
      setError('Error loading font: ' + err.message);
    });
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Upload Font</h2>
      <div 
        className="flex items-center justify-center w-full" 
        onDrop={handleDrop} 
        onDragOver={handleDragOver}
      >
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">TTF only (Max 5MB)</p>
          </div>
          <input id="dropzone-file" type="file" accept=".ttf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
        </label>
      </div>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default FontUploader;
