const Pool = require('pg').Pool

// TODO - Add dotenv + environment variables
const pool = new Pool({
  user: '',
  host: 'localhost',
  database: '',
  password: '',
  port: 5432,
})


// TEMP (Sanity Check) ******************************
const getUrls = (req, res) => {
  pool.query('SELECT * FROM urls ORDER BY id ASC', (err, results) => {
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
  
  pool.query('SELECT * FROM urls WHERE redirect = $1', [redirectString], (err, results) => {
    if (err) {
      throw err
    }
    const queryResults = results.rows;

    console.log(queryResults[0])
    res.redirect(302, `https://${queryResults[0].link}`)
  })
}

module.exports = {
  getRedirect,
  getUrls,
}
