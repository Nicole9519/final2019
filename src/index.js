console.log('index.js!');

import {select, max, dispatch} from 'd3';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';

import {
	dataPromise2017,
	districtPromise,
	incomePromise,
	dataPromise,
	housingDataCombined
} from './data';
import {
	groupByYear,
	groupByDistrict
} from './utils';

import LineChart from './Modules/multiLine';
import drawHistogramArea from './Modules/histogramArea'
import drawHistogramPrice from './Modules/histogramPrice'
import drawHistogramRoom from './Modules/histogramRoom'
import drawHistogramTradetime from './Modules/histogramTradetime'
import drawMap from './Modules/map2017'
import drawOpening from './Modules/opening'

let originCode = "01";
let currentYear = 2017;

//Create global dispatch object
const globalDispatch = dispatch("change:district","change:year");

globalDispatch.on('change:district',(code, displayName) => {
	originCode = code;

	//Update title

	//Update other view modules
	//console.log(housingDataCombined);
	dataPromise2017.then(data => {
		const filterData = data.filter(d => d.district === originCode);
		renderMap2017(filterData);
		renderHistogramArea(filterData);
		renderHistogramPrice(filterData);
		renderHistogramRoom(filterData);
		renderHistogramTradetime(filterData);

	})

	housingDataCombined.then(data => {
		renderLinechart(data)
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


function renderLinechart(data){

	const lineChart = LineChart()
		.onChangeYear(
			year => globalDispatch.call('change:year',null, year) //function, "callback function" to be executed upon the event
		);
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

function renderMap2017(data) {
	select('.map')
		.each(function(){
			drawMap(
				this,
				data
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
