import * as d3 from 'd3';

function drawHistogramRoom(rootdom, data){

  // set the dimensions and margins of the graph
  const margin = {top: 10, right: 30, bottom: 40, left: 40},
    width = 200 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  // X axis: scale and draw:
  const x = d3.scaleLinear()
    .domain([1, 10])    
    .range([0, width]);
 
  // set the parameters for the histogram
  const histogram = d3.histogram()
    .value(function(d) { return d.room; })   
    .domain(x.domain())  
    .thresholds(x.ticks(10));

  // And apply this function to data to get the bins
  const bins = histogram(data);

  // Y axis: scale and draw:
  const y = d3.scaleLinear()
    .range([height, 0]);
  y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
  
  const xAxis = d3.axisBottom(x)
  const yAxis = d3.axisLeft(y)
    .ticks(6)
    .tickSize(-innerWidth);

   // .ticks()
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
    .attr("class","axis axis-x")
    .attr("transform", "translate(0," + height + ")")

  rectsEnter.append("g")
    .attr("class","axis axis-y")

  
  rectsEnter.append('rect')
    .attr("class","rect")
    .style("fill", "#ff5a5f")

  rectsEnter.append('text')
    .attr("class","xAxis")
    .style("text-anchor", "middle")

  rectsEnter.append('text')
    .attr("class","yAxis")
    .style("text-anchor", "middle")

 //Update 
  plot.selectAll('.rect')
    .data(bins)
    .transition()
    .duration(500)
    .attr("x", 1)
    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1 ; })
    .attr("height", function(d) { return height - y(d.length); })
  
  plot.select(".axis-x")
    .call(xAxis);
  plot.select(".axis-y")
    .call(yAxis);
  plot.select(".xAxis") 
    .attr("transform",
          "translate(" + width/2 + " ," + (height+40)  + ")")
    .attr("dy","0em")            
    .text("Number of Bedroom")
    .style("font-size",13);
  plot.select(".yAxis") 
    .attr("transform","rotate(-90)")
    .attr("y", -30)
    .attr('x', -height/2)
    .attr("dy","0em")            
    .text("Count")
    .style("font-size",13);

}



export default drawHistogramRoom;

