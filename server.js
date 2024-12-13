import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import cors from 'cors'; // Importar CORS

const app = express();
const PORT = 3306;

// Configurar CORS
app.use(cors()); // Permite todas as origens (ajuste conforme necessário)

// Database connection
const dbConfig = {
  host: 'vps.felipehenriquerafael.tech',
  port: 3306,
  user: 'felipe',
  password: 'Appiatech@2024',
  database: 'habitat',
};

app.use(bodyParser.json());

// Clear the table
app.post('/clear-interactions', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('DELETE FROM interactions');
    await connection.end();
    res.status(200).json({ message: 'Table cleared successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to clear table.' });
  }
});

// Insert data into the table
app.post('/insert-interactions', async (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: 'Invalid data format.' });
    }

    const connection = await mysql.createConnection(dbConfig);
    const query =
      'INSERT INTO interactions (id_interaction, question, ratings, response_text, response_fade, user_id, timestamp) VALUES ?';

    const values = data.map((row) => [
      row.id_interaction,
      row.question,
      row.ratings,
      row.response_text,
      row.response_fade,
      row.user_id,
      row.timestamp,
    ]);

    await connection.query(query, [values]);
    await connection.end();

    res.status(200).json({ message: 'Data inserted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to insert data.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
