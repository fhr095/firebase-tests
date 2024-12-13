// src/App.jsx
import React from 'react';
import ExportData from './components/ExportData';
import ImportData from './components/ImportData';
import ProcessQuestions from './components/ProcessQuestions';
import UploadCSV from './components/UploadCSV';

function App() {
  return (
    <div className="App" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <ExportData />
      <ImportData />
      <ProcessQuestions />
      <UploadCSV />
    </div>
  );
}

export default App;
