import * as d3 from 'd3';


function drawOpening(rootDOM,data){

	const W = rootDOM.clientWidth;
	const H = rootDOM.clientHeight;
	const m = {t:32,r:32,b:32,l:32};

	const colorScale = d3.scaleLinear()
		.range([		 
			'#FFFFFF',
			"#AF4034"
		])
		.domain([10000,100000]);

	const lngLatBNG = [116.405609,39.896948];

	const projection = d3.geoMercator()
		.center(lngLatBNG)
		.translate([W/2, H/2])
		.scale(30000);

	// const path = d3.geoPath()
 //  		.projection(projection)

	const svg = d3.select(rootDOM)
		.classed("map", true)
		.selectAll("svg")
		.data([1])

	const svgEnter = svg.enter().append("svg");


	svg.merge(svgEnter)
		.attr("width", W)
		.attr("height", H);

	const parseDate = d3.timeParse("%Y-%m-%d")

	const formatTime = d3.timeFormat("%Y");
    
	const text = svg.merge(svgEnter)
		.select("text")
        .data(data)
        .enter()
        .append("text");

//Add SVG Text Element Attributes
	// var textLabels = text
	// 	.attr("x",W/2)
	//     .attr("y", H/2)
	//     .text(d => formatTime(parseDate(d.tradeTime)))
	//     .attr("font-family", "sans-serif")
	//     .attr("font-size", "20px")
	//     .attr("fill", "black");


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
		.attr('transform', d => {
			const xy = projection(d.lngLat);
			return `translate(${xy[0]}, ${xy[1]})`;
		})
		.style("fill-opacity",0.5)
		.style("fill", d => colorScale(d.price))
	
	nodes.exit().remove()



}

export default drawOpening;