import * as d3 from 'd3';

function LineChart(){

	const bisect = d3.bisector(function(d){ return d.key; }).left;
	let yearChangeCallback;

	function drawLinechart(rootDOM, data, key){

		const W = 200;
		const H = 200;
		//const W = rootDOM.clientWidth;
		//const H = rootDOM.clientHeight;
		const margin = {t:32, r:32, b:64, l:32};
		const innerWidth = W - margin.l - margin.r;
		const innerHeight = H - margin.t - margin.b;
		const parseTime = d3.timeParse("%Y");

		const scaleX = d3.scaleLinear().domain(d3.extent(data, function(d) { return d.key; })).range([0, innerWidth]);
		const scaleY = d3.scaleLinear().domain([0,40]).range([innerHeight, 0]);

		//take array of xy values, and produce a shape attribute for <path> element
		//housing price to income ratio: median house prices to median familial disposable incomes
		const lineGenerator = d3.line()
			.x(d => scaleX(d.key))
			.y(d => scaleY(d.value.price*d.value.square/d.income/2.45)); //function
		const areaGenerator = d3.area()
			.x(d => scaleX(d.key))
			.y0(innerHeight)
			.y1(d => scaleY(d.value.price*d.value.square/d.income/2.45));

		const axisX = d3.axisBottom()
			.scale(scaleX)
			.ticks(6)
			.tickFormat(function(value){ return "'"+String(value).slice(-2)})

		const axisY = d3.axisLeft()
			.scale(scaleY)
			//.tickSize(-innerWidth)
			.ticks(3)
		    .tickSize(-innerWidth);

		//Build DOM structure
		const svg = d3.select(rootDOM)
			.classed('line-chart',true)
			.style('position','relative') //necessary to position <h3> correctly
			.selectAll('svg')
			.data([1])
		const svgEnter = svg.enter()
			.append('svg');
		svg.merge(svgEnter)
			.attr('width', W)
			.attr('height', H);


		//Append rest of DOM structure in the enter selection
		const plotEnter = svgEnter.append('g')
			.attr('class','plot')
			.attr('transform', `translate(${margin.l}, ${margin.t})`);
		plotEnter.append('path')
			.attr('class','line')
			.style('fill','none')
			.style('stroke','#ff5a5f')
			.style('stroke-width','2px')
		plotEnter.append('path')
			.attr('class','area')
			.style('fill-opacity',0.03)
		plotEnter.append('g')
			.attr('class','axis axis-x')
			.attr('transform',`translate(0, ${innerHeight})`)
		plotEnter.append('g')
			.attr('class','axis axis-y')
		const tooltipEnter = plotEnter.append('g')
			.attr('class','tool-tip')
			.style('opacity',0)
		tooltipEnter.append('circle').attr('r',3)
		tooltipEnter.append('text').attr('text-anchor','middle')
			.attr('dy', -10)
		plotEnter.append('rect')
			.attr('class','mouse-target')
			.attr('width', innerWidth)
			.attr('height', innerHeight)
			.style('opacity', 0.01);
		
		plotEnter.append('text')
			.attr("class", "title")
			.attr("transform","translate(20,"+ 3*H/4 +")")
			.style("font-size",12)

		

		//Update the update + enter selections
		const plot = svg.merge(svgEnter).select('.plot');

		plot.select('.line')
			.datum(data)
			.transition()
			.attr('d', data => lineGenerator(data))
		plot.select('.area')
			.datum(data)
			.transition()
			.attr('d', data => areaGenerator(data))
		plot.select('.axis-x')
			.transition()
			.call(axisX)
		plot.select('.axis-y')
			.transition()
			.call(axisY);
		plot.select('.title')
			.data(data)
			.text(key)

		data.sort(function(x, y){
   				return d3.ascending(x.key, y.key);
			});

		//Event handling
		plot
			.select('.mouse-target')
			.on('mouseenter', function(d){
				plot.select('.tool-tip')
					.style('opacity',1)
			})
			.on('mousemove', function(d){
				const mouse = d3.mouse(this);
				const mouseX = mouse[0];
				const year = scaleX.invert(mouseX);
				
				const idx = bisect(data, year);
				const datum = data[idx];
				
				const ratio = datum.value.price*datum.value.square/datum.income/2.45;
				
				plot.select('.tool-tip')
					.attr('transform', `translate(${scaleX(datum.key)}, ${scaleY(ratio)})`)
					.select('text')
					.text(ratio.toFixed(1));

				yearChangeCallback(datum.key);

			})
			.on('mouseleave', function(d){
				plot.select('.tool-tip')
					.style('opacity',0)
			});

	}

	drawLinechart.onChangeYear = function(callback){
		//event ==> year:change
		//callback 
		yearChangeCallback = callback; // arg => console.log(arg) // can be used anywhere, since it be defined globally
		return this;
	}

	return drawLinechart;

}

export default LineChart;
