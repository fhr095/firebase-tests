// src/components/ExportData.jsx
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const ExportData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const exportToJson = async () => {
    setLoading(true);
    setError(null);
    try {
      const colRef = collection(db, 'feedback'); // Alterado para 'feedback'
      const snapshot = await getDocs(colRef);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Converter para JSON
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      const link = document.createElement('a');
      link.href = jsonString;
      link.download = 'feedback_export.json';
      link.click();
    } catch (err) {
      console.error('Erro ao exportar dados:', err);
      setError('Falha ao exportar os dados. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Exportar Dados do Firestore</h1>
      <button onClick={exportToJson} disabled={loading} style={{ padding: '10px 20px', fontSize: '16px' }}>
        {loading ? 'Exportando...' : 'Exportar Coleção'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default ExportData;
