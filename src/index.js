console.log('index.js!');

import {select, max} from 'd3';
import './style.css';

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

import drawLinechart from './Modules/multiLine';

renderLinechart(housingDataCombined);


function renderLinechart(data){

	const charts = select('.module')
		.selectAll('.chart')
		.data(data, d => d.key);
	const chartsEnter = charts.enter()
		.append('div')
		.attr('class','chart')
	charts.exit().remove();

	charts.merge(chartsEnter)
		.each(function(d){
			drawLinechart(
				this,
				d.values
			);
		});
}

function renderHistogramArea(data){
	d3.select('.module')
		.each(function(){
	      	drawHis2(
	        	this,
	        	data
	      	);
	    });
}

function renderHistogramPrice(data){

  d3.select('.module')
    	.each(function(){
     		drawHis3(
        		this,
        		data
      		);
    	});
}

