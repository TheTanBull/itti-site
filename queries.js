const Pool = require('pg').Pool

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
  
  pool.query('SELECT * FROM urls WHERE redirect_string = $1', [redirectString], (err, results) => {
    if (err) {
      throw err
    }
    const queryResults = results.rows;

    console.log(queryResults[0])
    res.redirect(302, `${queryResults[0].redirect_link}`)
  })
}

module.exports = {
  getRedirect,
  getUrls,
}
