// src/components/ImportData.jsx
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const ImportData = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setSuccess(null);
  };

  const handleImport = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo JSON.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const json = JSON.parse(event.target.result);
          if (!Array.isArray(json)) {
            throw new Error('O arquivo JSON deve ser um array de objetos.');
          }

          const colRef = collection(db, 'feedback'); // Coleção 'feedback'

          // Usar batch para otimizar a escrita
          const batch = db.batch();
          json.forEach(async (item) => {
            // Remover o ID se existir, pois Firestore gera seu próprio ID
            const { id, ...data } = item;
            await addDoc(colRef, data);
          });

          setSuccess('Dados importados com sucesso!');
        } catch (err) {
          console.error('Erro ao processar o arquivo JSON:', err);
          setError('Erro ao processar o arquivo JSON. Verifique o console para mais detalhes.');
        } finally {
          setLoading(false);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      console.error('Erro ao importar dados:', err);
      setError('Falha ao importar os dados. Verifique o console para mais detalhes.');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', marginTop: '40px' }}>
      <h1>Importar Dados para o Firestore</h1>
      <input type="file" accept=".json" onChange={handleFileChange} />
      <br />
      <button
        onClick={handleImport}
        disabled={loading}
        style={{ padding: '10px 20px', fontSize: '16px', marginTop: '10px' }}
      >
        {loading ? 'Importando...' : 'Importar JSON'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
    </div>
  );
};

export default ImportData;
