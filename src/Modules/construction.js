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
    .domain([1900, 2020])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, W]);

  	var y = d3.scaleLinear()
    .range([H, 0])
    .domain([0, 10]);   // d3.hist has to be called before the Y axis obviously

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
	
console.log(data)
	nodes.merge(nodesEnter)
		.select("circle")
		.attr("r",3)
		.attr('cx', d => x(d.constructionTime))
		.attr('cy', d => y(d.renovationCondition))
		.style("fill-opacity",0.5)
		.style("fill", d => colorScale(d.price))
		// .style("fill", d => {
		// 	const district1 = data.filter(d=> d.district === 8);
		// 	return 
		// })
		// .on("mouseenter", function(d) {
		// 		    d3.select(this)
		// 		    .attr("r","6")
		// 		    .attr("fill","red")
				    

		// 		    d3.select("#tooltip")
		// 				.transition()
		// 				.style("opacity",1)
		// 				.style("stroke","black");
				    
		// 		    console.log(d.intro)
		// 		    d3.select("#name").text(d.name);
		// 		    d3.select("#district").text("District: " + d.city)
		// 		    d3.select("#type").text("Type: " + d.type);
		// 		    d3.select("#year").text("Year: " + d.year);
		// 		    d3.select("#summary").text(d.intro);
		// 		    d3.select("#story-link").attr("href", d.website).html("Click here to view the website.");
				    
		// 		})
		// .on("mouseleave", function(d) {
		// 	    d3.select(this)
		// 		      .attr("r", "3")
		// 		      .attr("fill", "grey")
		// 		      .attr("class", "points")
		// 		      .attr("opacity",0.75);
		// });

	

	nodes.exit().remove()
}


export default drawScatterplot;
