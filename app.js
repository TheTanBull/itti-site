const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const db = require('./queries');

const PORT = process.env.PORT;

// Template Engine
app.set('view engine', 'ejs');


// Middlewares
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

// Non-Existent Routing
// app.use(function(req, res, next){
//   var err = new Error('Not Found');
//   err.status = 404;
//   res.redirect('/');
//   next(err);
// });


// **** API ****
app.post('/api/urls', db.minifyUrl);


// **** SERVER ****
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
});