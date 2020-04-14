// TODO add error handling

const Pool = require('pg').Pool;
const base62 = require('base62');

// TODO - Add dotenv + environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
})


// TEMP (Sanity Check) ******************************
const getUrls = (req, res) => {
  pool.query('SELECT * FROM urls ORDER BY url_id ASC', (err, results) => {
    if (err) {
      throw err
    }
    res.status(200).json(results.rows)
  })
}
// **************************************************

// TODO - Standardize redirect url format
const getRedirect = (req, res) => {
  const redirectString = req.params.redirect;
  
  pool.query('SELECT * FROM urls WHERE redirect_string = $1', [redirectString], (err, result) => {
    if (err) {
      throw err;
    }
    const queryResults = result.rows;

    res.redirect(302, `${queryResults[0].redirect_link}`);
  })
}

const minifyUrl = (req, res) => {
  const  { link } = req.body;
  if (link) {
    pool.query('INSERT INTO urls (redirect_link) VALUES ($1) RETURNING url_id', [link], (err, result) => {
      if (err) {
        throw err;
      }

      const urlId = result.rows[0].url_id;
      const encodedUrlId = base62.encode(urlId);

      pool.query('UPDATE urls SET redirect_string = $1 WHERE url_id = $2', [encodedUrlId, urlId], (error, results) => {
        if (err) {
          throw err;
        }
        res.status(200).send(`URL created ittie.site/${encodedUrlId}`);
      })
      console.log(urlId, encodedUrlId);
    })
  }
}

module.exports = {
  getRedirect,
  getUrls,
  minifyUrl,
}
