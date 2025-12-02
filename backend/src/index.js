const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const debateRoutes = require('./routes/debate.routes');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://sabhaverse.vercel.app'
  ],          
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type, Authorization'
}));

app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/debates', debateRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SabhaVerse API' });
});

// ---------------------
// START SERVER
// ---------------------
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
