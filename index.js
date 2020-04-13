const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const db = require('./queries');

const PORT = process.env.PORT;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (req, res) => {
  res.json({ info: 'Test' })
})

app.get('/:redirect', db.getRedirect) 

app.get('/urls', db.getUrls)

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})