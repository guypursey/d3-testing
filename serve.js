var express = require('express')
var app = express()
var fs = require('fs')

app.use(express.static('.'))

app.get('/', function (req, res) {
  var content = fs.readFileSync('ranged-bar-chart.html', 'utf8')
  res.send(content)
})

app.get('/tweaked-bunkat-timeline', function (req, res) {
  var content = fs.readFileSync('tweaked-bunkat-timeline/index.html', 'utf8')
  res.send(content)
})

app.get('/playpool-chart', function (req, res) {
  var content = fs.readFileSync('playpool-chart/index.html', 'utf8')
  res.send(content)
})

app.get('/eu-ref', function (req, res) {
  var content = fs.readFileSync('uk-eu-referendum-hierarchical-bar-chart/index.html', 'utf8')
  res.send(content)
})

app.get('/eu-arc', function (req, res) {
  var content = fs.readFileSync('eu-referendum-arc-results-1.html', 'utf8')
  res.send(content)
})

app.get('/eu-arc-2', function (req, res) {
  var content = fs.readFileSync('eu-referendum-arc-results-2.html', 'utf8')
  res.send(content)
})

app.get('/eu-sun', function (req, res) {
  var content = fs.readFileSync('eu-sunburst.html', 'utf8')
  res.send(content)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
