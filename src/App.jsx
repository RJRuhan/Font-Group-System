
import React from 'react';
import { FontProvider } from './context/FontContext';
import FontUploader from './components/FontUploader';
import FontList from './components/FontList';
import FontGroupForm from './components/FontGroupForm';
import FontGroupList from './components/FontGroupList';

function App() {
  return (
    <FontProvider>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Font Group Management System</h1>
        
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <FontUploader />
          <FontList />
          <FontGroupForm />
          <FontGroupList />
        </div>
      </div>
    </FontProvider>
  );
}

export default App;