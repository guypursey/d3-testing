var d3 = require("d3")

var m = [20, 15, 50, 120] //top right bottom left
var f = 20
var w = 960 - m[1] - m[3]
var h = 500 - m[0] - m[2]
var miniHeight = h / 6
var mainHeight = h - miniHeight

timeBegin = new Date("0000")
timeEnd = new Date("2000")

var x = d3.time.scale()
        .range([0, w])

var t = d3.time.scale()
        .range([0, w])

var y1 = d3.scale.linear()
         .range([0, mainHeight])

var y2 = d3.scale.linear()
         .range([0, miniHeight])

var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            //.ticks(d3.time.years, 100)
            //.tickFormat(d3.time.format("%Y"))
            .tickSize(5)
            .tickPadding(1)

var tAxis = d3.svg.axis()
            .scale(t)
            .orient("bottom")
            //.ticks(d3.time.years, 100)
            //.tickFormat(d3.time.format("%Y"))
            .tickSize(5)
            .tickPadding(1)

var getMainItemHeight = d => .8 * y1(1)
var getMiniItemHeight = d => .8 * y2(1)
var brewedColorClass = "Spectral"

var chart = d3.select("body")
            .append("svg")
            .attr("width", w + m[1] + m[3])
            .attr("height", h + m[0] + m[2])
            .attr("class", `chart ${brewedColorClass}`)

chart.append("defs").append("clipPath")
   .attr("id", "clip")
   .append("rect")
   .attr("width", w)
   .attr("height", mainHeight)

var main = chart.append("g")
              .attr("transform", `translate(${m[3]}, ${m[0]})`)
              .attr("width", w)
              .attr("height", mainHeight)
              .attr("class", "main")

var mini = chart.append("g")
              .attr("transform", `translate(${m[3]}, ${mainHeight + m[0]})`)
              .attr("width", w)
              .attr("height", miniHeight)
              .attr("class", "mini")

var focus = main.append("g")
             .attr("class", "focus")

focus.append("g")
   .attr("class", "t axis")
   .call(tAxis)

var parseDate = function (date) {

    var dateInput = {}

    if (typeof date === "string") {
        dateInput.startDate = date
        dateInput.endDate = date
    } else if (typeof date === "object") {
        dateInput.startDate = date.startDate
        dateInput.endDate = date.endDate || date.startDate
    }

    var datePattern = /(\d{1,4})(?:(0[1-9]|1[0-2])(?:(0[1-9]|[1-2][0-9]|3[0-1])(?:([0-1][0-9]|2[0-3])(?:([0-5][0-9])(?:([0-5][0-9]))?)?)?)?)?/

    var startDate = datePattern.exec(dateInput.startDate)
    var endDate = datePattern.exec(dateInput.endDate)

    var startYear = startDate[1]
             ? `${startDate[1]}${"0000".substr(startDate[1].length)}`
             : ""
    var startMonth = startDate[2] || "01"
    var startDay = startDate[3] || "01"
    var startHour = startDate[4] || "00"
    var startMinute = startDate[5] || "00"
    var startSecond = startDate[6] || "00"

    var endYear = endDate[1]
             ? `${endDate[1]}${"9999".substr(endDate[1].length)}`
             : ""
    var endMonth = endDate[2] || "12"
    var endDay = endDate[3]
               || ((endDate[2] === "02")
                   ? (endDate[1] % 4 === 0)
                     ? "29"
                     : "28"
                   : (/(04|06|09|11)/.test(endDate[2]))
                     ? "30"
                     : "31")
    var endHour = endDate[4] || "23"
    var endMinute = endDate[5] || "59"
    var endSecond = endDate[6] || "59"
    var startDateResult = `${startYear}${startMonth}${startDay}${startHour}${startMinute}${startSecond}`
    var endDateResult = `${endYear}${endMonth}${endDay}${endHour}${endMinute}${endSecond}`

    var startPrecision = 6
    while (startPrecision) {
        if (startDate[startPrecision]) {
            break
        }
        startPrecision -= 1
    }

    var endPrecision = 6
    while (endPrecision) {
        if (startDate[endPrecision]) {
            break
        }
        endPrecision -= 1
    }

    var precision = startPrecision + endPrecision

    return {
        startDate: startDateResult,
        endDate: endDateResult,
        precision: precision
    }

}

var dataOptions = {
  "start": "Start Date",
  "end": "End Date",
  "id": "Page",
  "dateformat": d3.time.format("%Y%m%d%H%M%S")
}

var laneKeys = {}
var lanes = []
var laneLength = 0
var laneArrays = []

var processData = (options => {

  var dataOptions = {
    "start": options.start || "start",
    "end": options.end || "end",
    "lane": options.lane || "",
    "id": options.id || "id",
    "dateformat": options.dateformat || { parse: x => x }
  }

  return v => {

    if (v[dataOptions.start]) {
      if (v[dataOptions.start]) {
        var dates = parseDate({
          startDate: v[dataOptions.start],
          endDate: v[dataOptions.end] || v[dataOptions.start]
        })
      } else {
        var dates = {
          startDate: "",
          endDate: ""
        }
      }

      v.start = dataOptions.dateformat.parse(dates.startDate)
      v.end = dataOptions.dateformat.parse(dates.endDate)

      var assignLanes = function (laneArrays, i) {
        var updateValue = (v, i) => {
          v.lanelabel = `Lane ${i}`
          v.lane = i
          return v
        }

        var checkConflict = (v, e) => (
          (v.start >= e.start && v.start <= e.end) ||
          (v.end >= e.start && v.end <= e.end) ||
          (e.start >= v.start && e.start <= v.end) ||
          (e.end >= v.start && e.end <= v.end)
        )
        var isConflict = false
        var j

        if (laneArrays[i]) {
          for (j = 0; (j < laneArrays[i].length) && !isConflict; j += 1) {
            isConflict = checkConflict(v, laneArrays[i][j])
          }
          if (isConflict) {
            assignLanes(laneArrays, i + 1)
          } else {
            laneArrays[i][j] = updateValue(v, i)
          }
        } else {
          laneArrays[i] = [updateValue(v, i)]
          lanes.push(`Lane ${i}`)
          laneLength += 1
        }
      }

      if (dataOptions.lane) {
        if (!laneKeys.hasOwnProperty(v[dataOptions.lane])) {
          lanes.push(v[dataOptions.lane])
          laneKeys[v[dataOptions.lane]] = laneLength
          laneLength += 1
        }
        v.lanelabel = v[dataOptions.lane]
        v.lane = laneKeys[v[dataOptions.lane]]
      } else {
        assignLanes(laneArrays, 0)
      }

      v.id = v[dataOptions.id]

      if (!v.start || !v.end) {
        v = null
      }

    } else {
      v = null
    }
    return v
  }
})(dataOptions)

d3.tsv("sample-data.tsv", processData, function (error, items) {
  if (error) throw error

  var timeBegin = d3.min(items, d => d.start)
  var timeEnd = d3.max(items, d => d.end)

  x.domain([timeBegin, timeEnd])
  t.domain([timeBegin, timeEnd])
  y1.domain([0, laneLength])
  y2.domain([0, laneLength])

  //main lanes and texts
  main.append("g").selectAll(".laneLines")
    .data(items)
    .enter().append("line")
    .attr("t", m[1])
    .attr("y1", d => y1(d.lane) + f)
    .attr("x2", w)
    .attr("y2", d => y1(d.lane) + f)
    .attr("stroke", "lightgray")

  main.append("g").selectAll(".laneText")
    .data(lanes)
    .enter().append("text")
    .text(d => d)
    .attr("x", -m[1])
    .attr("y", (d, i) => y1(i + .5) + f)
    .attr("dy", ".5ex")
    .attr("text-anchor", "end")
    .attr("class", "laneText")

  //mini lanes and texts
  mini.append("g").selectAll(".laneLines")
    .data(items)
    .enter().append("line")
    .attr("t", m[1])
    .attr("y1", d => y2(d.lane) + f)
    .attr("x2", w)
    .attr("y2", d => y2(d.lane) + f)
    .attr("stroke", "lightgray")

  mini.append("g").selectAll(".laneText")
    .data(lanes)
    .enter().append("text")
    .text(d => d)
    .attr("x", -m[1])
    .attr("y", (d, i) => y2(i + .5) + f)
    .attr("dy", ".5ex")
    .attr("text-anchor", "end")
    .attr("class", "laneText")

  var itemRects = main.append("g")
                    .attr("clip-path", "url(#clip)")

  //mini item rects
  mini.append("g").selectAll("miniItems")
    .data(items)
    .enter().append("rect")
    .attr("x", d => x(d.start))
    .attr("y", d => y2(d.lane + .5) + f - (getMiniItemHeight() / 2))
    .attr("width", d => x(d.end) - x(d.start))
    .attr("height", getMiniItemHeight)
    .style("fill", d => "")
    .attr("class", d => `q${d.lane}-${laneLength}`)

  //mini labels
  mini.append("g").selectAll(".miniLabels")
    .data(items)
    .enter().append("text")
    .text(d => d.id)
    .attr("x", d => x(d.start))
    .attr("y", d => y2(d.lane + .5) + f)
    .attr("dy", ".5ex")

  //brush
  var brush = d3.svg.brush()
              .x(x)
              .on("brush", display)

  mini.append("g")
    .attr("class", "x brush")
    .call(brush)
    .selectAll("rect")
    .attr("y", 1 + f)
    .attr("height", miniHeight)

  mini.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${miniHeight + f})`)
    .call(xAxis)

  display()

  function display() {

    var rects
    var labels
    var minExtent = brush.empty() ? t.domain()[0] : brush.extent()[0]
    var maxExtent = brush.empty() ? t.domain()[1] : brush.extent()[1]
    var visItems = items.filter(d => d.start < maxExtent && d.end > minExtent)

    if (!brush.empty()) {
      mini.select(".brush")
        .call(brush.extent([minExtent, maxExtent]))
    }

    t.domain([minExtent, maxExtent])

    focus.select(".t.axis").call(tAxis)

    // add lines

    lines = itemRects.selectAll("line")
        .data(visItems, d => d.id)
      .attr("x1", d => t(d.start))
      .attr("x2", d => t(d.end))
      //.attr("width", d => t(d.end) - t(d.start))

    lines.enter().append("line")
      .attr("class", d => `line q${d.lane}-${laneLength}`)
      .attr("x1", d => t(d.start))
      .attr("x2", d => t(d.end))
      .attr("y1", d => y1(d.lane + 0.5) + f)
      .attr("y2", d => y1(d.lane + 0.5) + f)
      //.attr("width", d => t(d.end) - t(d.start))
      //.attr("height", getMainItemHeight)

    lines.exit().remove()

    endmarker = itemRects.selectAll(".endmarker")
               .data(visItems, d => d.id)
               .attr("transform", d => `translate(${t(d.end)}, ${y1(d.lane + 0.5) + f}) rotate(45)`)

    endmarker.enter().append("path")
         .attr("d", d3.svg.symbol().type("cross").size(200))
         .attr("transform", d => `translate(${t(d.end)}, ${y1(d.lane + 0.5) + f}) rotate(45)`)
         .attr("class", d => `endmarker shape q${d.lane}-${laneLength}`)

    endmarker.exit().remove()

    startmarker = itemRects.selectAll(".startmarker")
               .data(visItems, d => d.id)
               .attr("transform", d => `translate(${t(d.start)}, ${y1(d.lane + 0.5) + f}) rotate(45)`)

    startmarker.enter().append("path")
         .attr("d", d3.svg.symbol().type("cross").size(200))
         .attr("transform", d => `translate(${t(d.start)}, ${y1(d.lane + 0.5) + f}) rotate(45)`)
         .attr("class", d => `startmarker shape q${d.lane}-${laneLength}`)

    startmarker.exit().remove()

    //update the item labels
    labels = itemRects.selectAll("text")
      .data(visItems, d => d.id)
      .attr("x", d => t(Math.max(d.start, minExtent)) + 10)

    labels.enter().append("text")
      .text(d => d.id)
      .attr("x", d => t(Math.max(d.start, minExtent)) + 10)
      .attr("y", d => y1(d.lane + .5) + f - 10)
      .attr("text-anchor", "start")

    labels.exit().remove()

  }

})
