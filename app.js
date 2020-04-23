const dotenv = require('dotenv');
dotenv.config();

const https = require('https');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const fs = require('fs');
const db = require('./queries');

const PORT = process.env.PORT;

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use('/static/', express.static('public'));


// **** ROUTES ****
app.get('/', (req, res) => {
  res.render('home', { host: process.env.HOST });
});

app.get('/:redirect([A-z0-9]{3,})', db.getRedirect);


// **** API ****
app.post('/api/urls', db.minifyUrl);


// **** SERVER ****
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
});

https.createServer({
  key: fs.readFileSync(process.env.HTTPS_KEY),
  cert: fs.readFileSync(process.env.HTTPS_CERT)
}, app).listen(8000, function() {
  console.log('Running HTTPS on port 8000');
})