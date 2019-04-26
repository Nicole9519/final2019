import * as d3 from 'd3';



function drawMap(){

  let code = '01';

	function exportFunction(rootDOM,data,geo){

		const W = 500;
		const H = 500;
		const m = {t:32,r:32,b:32,l:32};

		const colorScale = d3.scaleLinear()
			.range([
				'#FFFFFF',
				"#AF4034"
			])
			.domain([10000,100000]);

		const dataFilter = data.filter(d => d.district === code);

		const lngLatBNG = [116.405609,39.896948];

		const projection = d3.geoMercator()
			.center(lngLatBNG)
			.translate([W/2, H/2])
			.scale(40000);


		const path = d3.geoPath()
	  		.projection(projection)

		const svg = d3.select(rootDOM)
			.classed("map", true)
			.selectAll("svg")
			.data([1])
	    
		
		const svgEnter = svg.enter().append("svg");

		svg.merge(svgEnter)
			.attr("width", W)
			.attr("height", H);

		const plotEnter = svgEnter.append("g")
			.attr("class","plot")
			.attr('transform', `translate(0,0)`);

		//console.log(geo);
		plotEnter.append('path')
			.attr("class","geo")
			.style("fill","none")
			.style("stroke","#e6e6e6")
			.style("stroke-width","2px");

		plotEnter.append("text")
			.attr("class","text")

		plotEnter.append("text")
			.attr("class","text2")

		
		const plot = svg.merge(svgEnter).select(".plot");
		
		plot.select('.geo')
			.datum(geo)
			.attr("d", path);

		// plot.append('g')
		// 	.attr("class",'bkg')
		// 	.selectAll('circle')
		// 	.data(data)
		// 	.enter().append("circle")
		// 	.attr('r','3')
		// 	.attr('transform', d => {
		// 		const xy = projection(d.lngLat);
		// 		return `translate(${xy[0]}, ${xy[1]})`;
		// 	})
		// 	.style('fill','#e6e6e6')

		plot.select('.text')
			.attr("x","30")
			.attr("y","450")
			.style("fill","#a6a6a6")
			.attr("font-size","14px")
			.text("Note: This map shows the listing distribution in main district in Beijing")

		plot.select('.text2')
			.attr("x","30")
			.attr("y","470")
			.style("fill","#a6a6a6")
			.attr("font-size","14px")
			.text("Data Source: Lianjia.com")


		const nodes = svg.merge(svgEnter).selectAll(".node")
			.data(dataFilter);

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

	exportFunction.code = function(_){
    	code = _;
    	return this;
  	}

	return exportFunction;
}

export default drawMap;

