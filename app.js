const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
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

// TODO - Create Homepage
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/:redirect([A-z0-9]{3,})', db.getRedirect);

// **** API ****
app.post('/api/urls', db.minifyUrl);


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
});
