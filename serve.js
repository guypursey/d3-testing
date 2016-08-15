var express = require('express')
var app = express()
var fs = require('fs')

app.get('/', function (req, res) {
  var content = fs.readFileSync('journal-entries-ranged-bar-chart/index.html', 'utf8')
  app.use(express.static('./journal-entries-ranged-bar-chart'))
  res.send(content)
})

app.get('/tweaked-bunkat-timeline', function (req, res) {
  var content = fs.readFileSync('tweaked-bunkat-timeline/index.html', 'utf8')
  app.use(express.static('./tweaked-bunkat-timeline'))
  res.send(content)
})

app.get('/playpool-chart', function (req, res) {
  var content = fs.readFileSync('playpool-chart/index.html', 'utf8')
  app.use(express.static('./playpool-chart'))
  res.send(content)
})

app.get('/eu-ref', function (req, res) {
  var content = fs.readFileSync('uk-eu-referendum-hierarchical-bar-chart/index.html', 'utf8')
  app.use(express.static('./uk-eu-referendum-hierarchical-bar-chart'))
  res.send(content)
})

app.get('/eu-arc-electorate', function (req, res) {
  var content = fs.readFileSync('uk-eu-referendum-hierarchical-arcs-width-electorate/index.html', 'utf8')
  app.use(express.static('.'))
  res.send(content)
})

app.get('/eu-arc-turnout', function (req, res) {
  var content = fs.readFileSync('uk-eu-referendum-hierarchical-arcs-width-turnout/index.html', 'utf8')
  app.use(express.static('.'))
  res.send(content)
})

app.get('/eu-sun', function (req, res) {
  var content = fs.readFileSync('eu-sunburst.html', 'utf8')
  app.use(express.static('.'))
  res.send(content)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
