const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config({ path: './.env' });


dotenv.config();


const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const debateRoutes = require('./routes/debate.routes');


const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/debates', debateRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SabhaVerse API' });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});