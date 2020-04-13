const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('./queries')

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


app.listen(port, () => {
  console.log(`Server listening on ${port}`)
})