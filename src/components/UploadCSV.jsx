// src/components/UploadCSV.jsx
import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

const UploadCSV = () => {
  const [csvData, setCsvData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleProcessCSV = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Parse the CSV data
      const parsed = Papa.parse(csvData.trim(), {
        header: true,
        skipEmptyLines: true,
      });

      if (!parsed || !parsed.data || parsed.data.length === 0) {
        throw new Error('O CSV fornecido está vazio ou inválido.');
      }

      // Confirm deletion and new insertion
      const confirmation = window.confirm(
        'Tem certeza de que deseja apagar todos os registros e inserir novos dados?'
      );
      if (!confirmation) {
        setLoading(false);
        return;
      }

      // API call to clear table
      await axios.post('https://vps.felipehenriquerafael.tech/clear-interactions', {
        table: 'interactions',
      });

      // API call to insert new data
      await axios.post('https://vps.felipehenriquerafael.tech/insert-interactions', {
        table: 'interactions',
        data: parsed.data,
      });

      setSuccess('Dados inseridos com sucesso!');
    } catch (err) {
      setError(err.message || 'Erro ao processar o CSV.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Upload e Inserção de CSV</h1>
      <textarea
        rows={10}
        cols={50}
        value={csvData}
        onChange={(e) => setCsvData(e.target.value)}
        placeholder="Cole os dados do CSV aqui..."
        style={{ marginBottom: '10px', width: '100%' }}
      />
      <br />
      <button
        onClick={handleProcessCSV}
        disabled={loading}
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        {loading ? 'Processando...' : 'Enviar'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
    </div>
  );
};

export default UploadCSV;
