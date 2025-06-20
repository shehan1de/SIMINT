const express = require('express');
const cors = require('cors');
const queryRoutes = require('./routes/query');
const connectDB = require('./db');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();  // connect to MongoDB here

app.use('/api', queryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
