console.log('index.js!');

import {select, max, dispatch, min} from 'd3';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';

import {
	dataPromise2017,
	districtPromise,
	incomePromise,
	dataPromise,
	housingDataCombined,
	beijingmap
} from './data';
import {
	groupByYear,
	groupByDistrict
} from './utils';

import LineChart from './Modules/multiLine';
import drawHistogramArea from './Modules/histogramArea'
import drawHistogramPrice from './Modules/histogramPrice'
import drawHistogramRoom from './Modules/histogramRoom';
import drawHistogramTradetime from './Modules/histogramTradetime';
import drawMap from './Modules/map2017';
import drawOpening from './Modules/opening';
import drawSquare from './Modules/square';

let originCode = "01";
let currentYear = 2017;

//Create global dispatch object
const globalDispatch = dispatch("change:district","change:year");

globalDispatch.on('change:district',(code, displayName) => {
	originCode = code;

	//Update title

	//Update other view modules
	//console.log(housingDataCombined);
	Promise.all([dataPromise2017,beijingmap])
		.then(([data,geo]) => {
			const filterData = data.filter(d => d.district === originCode);
			renderMap2017(filterData,geo);
			renderHistogramArea(filterData);
			renderHistogramPrice(filterData);
			renderHistogramRoom(filterData);
			renderHistogramTradetime(filterData);

		})

	housingDataCombined.then(data => {
		renderLinechart(data)
		renderSquare(data)
	})

	// dataPromise.then(data => {
	// 	renderOpening(groupByYear(data))
	// })
})

	
globalDispatch.on('change:year', year => {
	currentYear = +year;

	//update other view modules
	housingDataCombined.then(data => {
		renderLinechart(data);
	})
})
	

//Data import
dataPromise2017.then(() => 
	globalDispatch.call(
		'change:district',
		null,
		"01",
		"Dongcheng District"
	));
districtPromise.then(code => renderMenu(code));

housingDataCombined.then(data => {

	const data01 = data.filter(d => d.key === "01");
    const min_price = min(data, d => d.values[0].value)
    const housing01 = data01.map(a=> a.values[0].value);
      
    drawSquare(+document.getElementById("nValue").value, housing01, min_price);

})

function renderLinechart(data){

	const lineChart = LineChart()
		// .onChangeYear(
		// 	year => globalDispatch.call('change:year',null, year) //function, "callback function" to be executed upon the event
		// );
	console.log(data)
	const charts = select('.ViewLinechart')
		.selectAll('.chart')
		.data(data, d => d.key);
	const chartsEnter = charts.enter()
		.append('div')
		.attr('class','chart')
	charts.exit().remove();

	charts.merge(chartsEnter)
		.each(function(d){
			lineChart(
				this,
				d.values,
				d.name
			);
		});
}

function renderHistogramArea(data){
	select('.area')
		.each(function(){
	      	drawHistogramArea(
	        	this,
	        	data
	      	);
	    });
}

function renderHistogramPrice(data){

    select('.price')
    	.each(function(){
     		drawHistogramPrice(
        		this,
        		data
      		);
    	});
}

function renderMap2017(data, geo) {
	select('.map')
		.each(function(){
			drawMap(
				this,
				data,
				geo
			);
		});
}

function renderHistogramTradetime(data){

    select('.time')
    	.each(function(){
     		drawHistogramTradetime(
        		this,
        		data
      		);
    	});
}

function renderHistogramRoom(data){

    select('.room')
    	.each(function(){
     		drawHistogramRoom(
        		this,
        		data
      		);
    	});
}


function renderOpening(data){


	const charts = select('.opening')
		.selectAll(".chart")
		.data(data, d => d.key)

	const chartsEnter = charts.enter()
		.append("div")
		.attr("class","chart")

	charts.exit().remove();

	charts.merge(chartsEnter)
		.each(function(d){
			drawMap(
				this,
				d.values);
		});


}

function renderMenu(code){
	//Get list of countryCode values
	const districtList = Array.from(code.entries());
	//console.log(districtList)
	//Build UI for <select> menu
	let menu = select('.nav')
		.selectAll('select')
		.data([1]);
	menu = menu.enter()
		.append('select')
		.attr('class','form-control form-control-sm')
		.merge(menu);
	//Add <option> tag under <select>
	menu.selectAll('option')
		.data(districtList)
		.enter()
		.append('option')
		.attr('value', d => d[1].code)
		.html(d => d[1].name);

	//Define behavior for <select> menu
	menu.on('change', function(){
		const code = this.value; //3-digit code
		const idx = this.selectedIndex;
		const display = this.options[idx].innerHTML;

		globalDispatch.call('change:district',null,code,display);
	});
}

function renderSquare(data){

    let menu = select(".nav2")
      	.selectAll("select")
      	.data([1]);

    menu = menu.enter()
    	.append('select')
      	.attr('class','form-control form-control-sm')
      	.merge(menu);

    menu.selectAll("option")
      .data(data)
      .enter()
      .append("option")
      .attr("value", d => d.key)
      .html(d=> d.name);

    menu.on("change", function(){

      const code = this.value;

      const data_code = data.filter(d => d.key === code);
      
      const housing = data_code.map(a=> a.values[0].value);
      
      const min_price = min(data, d => d.values[0].value)

      //console.log(min)
      select("#nValue").on("input", function() {
       drawSquare(+this.value, housing, min_price);
      });

      drawSquare(+document.getElementById("nValue").value, housing, min_price);
       
    })
//console.log(housingAugmented.map(a => a.values[0].value))

}