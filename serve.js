var express = require('express')
var app = express()
var fs = require('fs')

app.use(express.static('.'))

app.get('/', function (req, res) {
  var content = fs.readFileSync('ranged-bar-chart.html', 'utf8')
  res.send(content)
})

app.get('/timeline', function (req, res) {
  var content = fs.readFileSync('timeline.html', 'utf8')
  res.send(content)
})

app.get('/eu-ref', function (req, res) {
  var content = fs.readFileSync('eu-ref.html', 'utf8')
  res.send(content)
})

app.get('/eu-arc', function (req, res) {
  var content = fs.readFileSync('eu-referendum-arc-results.html', 'utf8')
  res.send(content)
})

app.get('/eu-sun', function (req, res) {
  var content = fs.readFileSync('eu-sunburst.html', 'utf8')
  res.send(content)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
