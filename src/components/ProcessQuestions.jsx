// src/components/ProcessQuestions.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const ProcessQuestions = () => {
  const [inputData, setInputData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper para formatar a data no formato MySQL DATETIME
  const formatTimestamp = (date) => {
    const d = new Date(date);
    const pad = (num) => (num < 10 ? `0${num}` : num);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const handleProcess = async () => {
    try {
      setLoading(true);
      setError(null);

      // Parse o JSON de entrada
      const questions = JSON.parse(inputData);
      if (!Array.isArray(questions)) {
        throw new Error('O JSON fornecido deve ser um array de perguntas.');
      }

      const results = [];
      let idInteraction = 1;

      for (const question of questions) {
        const response = await axios.post(
          'https://vps.felipehenriquerafael.tech/nodered/talkwithifc',
          { msg: question }
        );

        const { comandos } = response.data;

        if (!Array.isArray(comandos)) {
          throw new Error(`Resposta inválida para a pergunta: ${question}`);
        }

        const timestamp = formatTimestamp(new Date()); // Timestamp formatado
        comandos.forEach((comando) => {
          results.push({
            id_interaction: idInteraction,
            question,
            ratings: 'Like',
            response_text: comando.texto,
            response_fade: comando.fade,
            user_id: 'userID1', // Fix user ID ou personalizar conforme necessário
            timestamp,
          });
        });

        idInteraction++;
      }

      // Gerar o arquivo XLSX
      const worksheet = XLSX.utils.json_to_sheet(results);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Interações');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      // Salvar arquivo
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, 'interactions.xlsx');
    } catch (err) {
      setError(err.message || 'Erro ao processar os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Processar Perguntas</h1>
      <textarea
        rows={10}
        cols={50}
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
        placeholder="Cole o JSON de perguntas aqui...

        Ex:
        [
          'Onde fica o restaurante?',
          'Qual o horário de funcionamento?'
        ]"
        style={{ marginBottom: '10px', width: '100%' }}
      />
      <br />
      <button
        onClick={handleProcess}
        disabled={loading}
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        {loading ? 'Processando...' : 'Processar'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default ProcessQuestions;

