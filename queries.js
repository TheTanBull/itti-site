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


const getRedirect = (req, res) => {
  const redirectString = req.params.redirect;
  const decodedString = base62.decode(redirectString);
  
  pool.query('SELECT * FROM urls WHERE url_id = $1', [decodedString], (err, result) => {
    if (err) {
      throw err;
    }

    let redirectLink;
    
    if (result.rows[0]) {
      redirectLink = 'https://' + result.rows[0].redirect_link;
    } else {
      redirectLink = '/';
    }

    res.redirect(302, `${redirectLink}`);
  })
}

const minifyUrl = (req, res) => {
  const  { link } = req.body;
  console.log(req.body);
  if (link) {
    var splitLink = link.split('//');
    
    pool.query('INSERT INTO urls (redirect_link) VALUES ($1) RETURNING url_id', [splitLink.length > 1 ? splitLink[1] : splitLink[0]], (err, result) => {
      if (err) {
        res.status(500).json({ success: false, error: err });
      }

      const urlId = result.rows[0].url_id;
      const encodedUrlId = base62.encode(urlId);

      pool.query('UPDATE urls SET redirect_string = $1 WHERE url_id = $2', [encodedUrlId, urlId], (error, results) => {
        if (err) {
          res.status(500).json({ success: false, error: err });
        }
        res.status(200).json({ success: true, url: process.env.HOST + encodedUrlId });
      })
      console.log(urlId, encodedUrlId);
    })
  } else {
    res.status(400).json({ success: false });
  }
}

module.exports = {
  getRedirect,
  getUrls,
  minifyUrl,
}
