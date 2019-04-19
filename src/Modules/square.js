import * as d3 from 'd3';

// adjust the text
function drawSquare(nValue, data, housingPrice, min) {

  const width = 1000;
  const height = 500;
  const margin = {t:32, r:32, b:64, l:64};

  const values =  data.map(a=> a.values[5].value);
  console.log(values)

  let closest = values.sort( (a, b) => Math.abs(housingPrice - a) - Math.abs(housingPrice - b) )[1];
  console.log(closest)

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
    .attr("fill", "#ff5a5f")
    .attr("opacity",0.8);

  plotEnter.append("rect")
    .attr("class","fix")
    .attr("fill", "none")
    .attr("stroke","#999999");
  
   plotEnter.append("rect")
    .attr("class","near")
    .attr("fill", "#b3b3b3")
    .attr("opacity","0.7")
    .style("stroke-dasharray", "10, 5")
    .attr("stroke","#999999")


  plotEnter.append("text")
    .attr("class","text")

  plotEnter.append("text")
    .attr("class","fixText")

  plotEnter.append("text")
    .attr("class","nearText")

  plotEnter.append("text")
    .attr("class","nearText2")


  const plot = svg.merge(svgEnter).select('.plot');
  const area = nValue * 6.71/housingPrice * 1000000 * 10.7639;//usd -> rmb; m2 -> ft2
  const side = Math.sqrt(area);
  const maxArea = nValue  * 6.71/min* 1000000 * 10.7639;//usd -> rmb; m2 -> ft2
  const maxSide = Math.sqrt(maxArea);
  const nearestArea = nValue  * 6.71/closest * 1000000 * 10.7639;//usd -> rmb; m2 -> ft2
  const nearestSide = Math.sqrt(nearestArea);
  let nearName = data.filter( d => d.values[5].value === closest);
  nearName = nearName[0].name;
  console.log(nearName);
    // adjust the value

  plot.select(".rect")
    .attr("x", 0)
    .attr("y", 10) 
    .attr("width",  0)
    .attr("height", 0)
    .transition()
    .duration(2000)
    .attr("x", 0)
    .attr("y", 10) 
    .attr("width",  side * 5)
    .attr("height", side * 5);
    
  plot.select(".near")
    .attr("x", 0)
    .attr("y", 10) 
    .attr("width",  0)
    .attr("height", 0)
    .transition()
    .duration(2000)
    .delay(2000)
    .attr("x", 0)
    .attr("y", 10) 
    .attr("width",  nearestSide * 5)
    .attr("height", nearestSide * 5);


  plot.select(".fix")
    .attr("x", 0)
    .attr("y", 10) 
    .attr("width",  0)
    .attr("height", 0)
    .transition()
    .duration(2000)
    .delay(4000)
    .attr("x", 0)
    .attr("y", 10)
    .attr("width", maxSide * 5 )
    .attr("height",maxSide *5 ); 

  plot.select(".text")
    .style("opacity", 0)
    .transition()
    .duration(2000)
    .style("opacity", 1)
    .attr("x", 300)
    .attr("y", 40)
    .text('You could buy a ' + area.toFixed(1) + "ft² house")
 
  plot.select(".nearText")
    .style("opacity", 0)
    .transition()
    .delay(2000)
    .duration(2000)
    .style("opacity", 1)
    .attr("x", 300)
    .attr("y", 80)
    .text("You could also spend the same amount of money to buy ")

  plot.select(".nearText2")
    .style("opacity", 0)
    .transition()
    .delay(2000)
    .duration(2000)
    .style("opacity", 1)
    .attr("x", 300)
    .attr("y", 120)
    .text("a similar size house -- "+ nearestArea.toFixed(1) + "ft² -- in " + nearName )

  plot.select(".fixText")
    .style("opacity", 0)
    .transition()
    .delay(4000)
    .duration(2000)
    .style("opacity", 1)
    .attr("x", 300)
    .attr("y", 160 )
    .text("With that amount of money, you could buy the biggest one in Fangshan District: " + maxArea.toFixed(1) + "ft²")


}

export default drawSquare;