// set the dimensions and margins of the graph
var margin = {top: 50, right: 30, bottom: 60, left: 60},
    width = 1400- margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Add the grey background that makes ggplot2 famous
svg
  .append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("height", height)
    .attr("width", width)
    .style("fill", "EBEBEB")

// Customization
//svg.selectAll(".tick line").attr("stroke", "white")

// Add X axis label:
svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width/2 + margin.left)
    .attr("y", height + margin.top)
    .text("Current Humidity");

// Y axis label:
svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 20)
    .attr("x", -margin.top - height/2 + 20)
    .text("Air Quality Index(US)")

d3.json("data.json", function(error, data) {
  var data = data.filter(function(d){return d.status === 'success';});
  console.log(data);
  var dataY=[];
  data.forEach(function(element) {
    dataY.push(element.data);
});

console.log(dataY[0].current);
  var elements = Object.keys(dataY[0].current.pollution)
    .filter(function(d){
      return ((d != "ts") & (d != "maincn") & (d != "mainus"));
    });

  //console.log(elements);
  var selection = elements[0];
  //console.log(selection);

  var current = dataY.filter(function(d){return d.current.pollution != null;});
  console.log(current);
    current.forEach(function(d) {

        d.current.pollution.aqius = +d.current.pollution.aqius;
        //console.log(d.current.pollution.aqius)

        //d.current.pollution.aqicn = +d.current.pollution.aqicn;
        //console.log(d.current.pollution.aqicn)
        
        d.current.weather.hu = +d.current.weather.hu;
        //console.log(d.current.weather.hu)

        d.city = d.city
        d.country = d.country

        d.place = d.city + ", " + d.country
        console.log(d.place)
        //console.log(d.city)

    });

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 0])
    .range([ 0, width ]);
  svg.append("g")
    .attr("class", "myXaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .attr("opacity", "0");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(current, function(d){
      return d.current.pollution.aqius;})])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
  // Its opacity is set to 0: we don't see it by default.
  var tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")



  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. 
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }

  var mousemove = function(d) {
    tooltip
      .html("Location:<br>" + d.place)
      .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  var mouseleave = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }


  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(current)
    .enter()
    .append("circle")
      //.attr("x", function (d) { return x(d.xaxis); } )
      .attr("cx", function(d) { return x(d.current.weather.hu); })
      //.attr("y", function (d) { return y(d.yaxis); } )
      .attr("cy", function(d) { return y(d.current.pollution.aqius); })
      .attr("r", 3.5)
      .style("Opacity", 0.5)
      .style("fill", "rgb(26, 26, 255)")

      .on("mouseover", mouseover )
      .on("mousemove", mousemove )
      .on("mouseleave", mouseleave )

  // new X axis
  x.domain([0, d3.max(current, function(d){
    return d.current.weather.hu;})])
  svg.select(".myXaxis")
    .transition()
    .duration(2000)
    .attr("opacity", "1")
    .call(d3.axisBottom(x));

  svg.selectAll("circle")
    .transition()
    .delay(function(d,i){return(i*3)})
    .duration(2000)
    .attr("cx", function(d) { return x(d.current.weather.hu); })
    .attr("cy", function(d) { return y(d.current.pollution.aqius); })

});


















// Plotly:

// function sample(cityweather){
//   return cityweather.status == 'success';
// }
// var filteredSample = data.filter(sample);
// console.log(filteredSample);
// // var filteredSample = data.filter(function (sample) {
// //   return sample != null;
// // });
// //   console.log(filteredSample);
// var xaxis = filteredSample.map(cityweather => cityweather.data.current.weather.hu);
// console.log(xaxis);
// //var yaxis = filteredSample.map(cityweather => cityweather.data.current.pollution.aqicn);
// //console.log(yaxis);
// var trace1 = {
//   x: xaxis,
//   y: yaxis,
//   mode: 'markers',
//   type: 'scatter'
// };

// var data = [trace1];

// Plotly.newPlot('scatter-plot', data);
