import * as d3 from 'd3';

function drawScatterplot(rootDOM,data){

	const W = 1000;
	const H = 500;
	const m = {t:32,r:32,b:32,l:32};

	const colorScale = d3.scaleLinear()
		.range([
			'#FFFFFF',
			"#AF4034"
		])
		.domain([10000,100000]);

	var x = d3.scaleLinear()
    .domain([1900, 2020])   
    .range([0, W]);

  	var y = d3.scaleLinear()
    .range([H, 0])
    .domain([0, 10]);   
  	const axisX = d3.axisBottom()
    .scale(x)
    //.tickFormat(function(value){ return "'"+String(value).slice(-2)})
    .ticks(4)
    .tickSize(-innerWidth);

 	const axisY = d3.axisLeft()
    .scale(y)
    //.tickSize(-innerWidth)
    .ticks(4);


	const svg = d3.select(rootDOM)
		.classed("scattleplot", true)
		.selectAll("svg")
		.data([1])
    
	
	const svgEnter = svg.enter().append("svg");

	svg.merge(svgEnter)
		.attr("width", W)
		.attr("height", H);


	const nodes = svg.merge(svgEnter).selectAll(".node")
		.data(data);

	const nodesEnter = nodes
		.enter()
		.append("g")
		.attr("class","node");

	nodesEnter.append("circle");
	

	nodes.merge(nodesEnter)
		.select("circle")
		.attr("r",3)
		.attr('cx', d => x(d.constructionTime))
		.attr('cy', d => y(d.renovationCondition))
		.style("fill-opacity",0.5)
		.style("fill", d => colorScale(d.price))	

	nodes.exit().remove()
}


export default drawScatterplot;
