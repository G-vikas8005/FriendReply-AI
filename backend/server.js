require('dotenv').config();

const express = require('express');
const cors = require('cors');
const replyRoutes = require('./routes/reply');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/reply', replyRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Something went wrong on the server.'
  });
});

app.listen(PORT, () => {
  console.log(`FriendReply AI backend running on http://localhost:${PORT}`);
});
