const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const notesRouter = require('./routes/notes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/notes', notesRouter);

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
