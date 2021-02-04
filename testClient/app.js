const express = require('express')
const path = require('path')

const app = express()
const port = 5501

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/static', express.static(path.join(__dirname, 'public')))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})