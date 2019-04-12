import * as d3 from 'd3';

// adjust the text
function drawSquare(nValue, housingPrice, min) {
  
  const width = 600;
  const height = 300;
  const margin = {t:32, r:32, b:64, l:64};

  //Build DOM structure
  const svg = d3.select(".square")
    .classed('line-chart',true)
    .style('position','relative') //necessary to position <h3> correctly
    .selectAll('svg')
    .data([1])
  const svgEnter = svg.enter()
    .append('svg');
  svg.merge(svgEnter)
    .attr('width', width)
    .attr('height', height); 

  const plotEnter = svgEnter.append('g')
    .attr('class','plot')
    .attr('transform', `translate(${margin.l}, ${margin.t})`);
   //Draw the Rectangle

  plotEnter.append("rect")
    .attr("class","rect")
    .attr("fill", "#ff5a5f");

  plotEnter.append("rect")
    .attr("class","fix")
    .attr("fill", "none")
    .attr("stroke","#999999");
  
  plotEnter.append("text")
    .attr("class","text")

  plotEnter.append("text")
    .attr("class","fixText")

  const plot = svg.merge(svgEnter).select('.plot');
  const area = nValue/housingPrice * 1000000;
  const maxArea = nValue/min* 1000000;
    // adjust the value
  plot.select(".rect")
    .attr("x", 10)
    .attr("y", 10) 
    .attr("width", area)
    .attr("height", area);
    

  plot.select(".fix")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", maxArea)
    .attr("height",maxArea) 
   
  plot.select(".text")
    .attr("x", area/2)
    .attr("y", area/2)
    .text(area.toFixed(1) + "/㎡")

  plot.select(".fixText")
    .attr("x", maxArea)
    .attr("y", maxArea+30)
    .text("MAX - Fangshan District: " + maxArea.toFixed(1) + "㎡")
}

export default drawSquare;