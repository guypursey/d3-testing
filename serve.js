var express = require('express')
var app = express()
var fs = require('fs')

app.use(express.static('.'))

app.get('/', function (req, res) {
  var content = fs.readFileSync('ranged-bar-chart.html', 'utf8')
  res.send(content)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
