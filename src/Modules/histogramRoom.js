import * as d3 from 'd3';

function drawHistogramRoom(rootdom, data){

  // set the dimensions and margins of the graph
  const margin = {top: 10, right: 30, bottom: 30, left: 40},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // X axis: scale and draw:
  const x = d3.scaleLinear()
    .domain([1, 10])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, width]);
 
  // set the parameters for the histogram
  const histogram = d3.histogram()
    .value(function(d) { return d.room; })   // I need to give the vector of value
    .domain(x.domain())  // then the domain of the graphic
    .thresholds(x.ticks(10)); // then the numbers of bins

  // And apply this function to data to get the bins
  const bins = histogram(data);

  // Y axis: scale and draw:
  const y = d3.scaleLinear()
    .range([height, 0]);
  y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
  
  // append the svg object to the body of the page
  const svg = d3.select(rootdom)
    .classed("histogram",true)
    .selectAll("svg")
    .data([1])

  const svgEnter = svg.enter()
    .append("svg")

  svgEnter
    .append('g').attr('class','plot')
  
  const plot = svg.merge(svgEnter)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .select('.plot')
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")

  const rects = plot.selectAll('.bar')
    .data(bins); 

  rects.exit().remove();  

  // append the bar rectangles to the svg element
   
  const rectsEnter = rects.enter()
    .append('g').attr("class","bar")

  rectsEnter.append("g")
    .attr("class","axis-x")
    .attr("transform", "translate(0," + height + ")")

  rectsEnter.append("g")
    .attr("class","axis-y")

  
  rectsEnter.append('rect')
    .attr("class","rect")
    .style("fill", "#ff5a5f")

 //Update 
  plot.selectAll('.rect')
    .data(bins)
    .transition()
    .attr("x", 1)
    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1 ; })
    .attr("height", function(d) { return height - y(d.length); })
  
  plot.select(".axis-x")
    .call(d3.axisBottom(x));
  plot.select(".axis-y")
    .call(d3.axisLeft(y));

}



export default drawHistogramRoom;

