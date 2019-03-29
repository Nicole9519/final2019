import {nest, timeParse, timeFormat} from 'd3';


function parseData(d){
	return {
		lngLat: [+d.Lng,+d.Lat],
		price: d.price,
		district: d.district.padStart(2,"0"),
		time:d.tradeTime,
		square: d.square,
		room:d.livingRoom
	}
}

function parseIncomeData(d){
	return {
		name: d.Name, 
		year: d.Year,
		income: d.Income
		
	}
}

function parseDistrictData(d){
    return {
	    name: d["Name"],
	    code: d["Division code[1]"].slice(-2),
	    area: d["Area (km_)"],
	    population: d["Population (2017_"]
  	}
}

function groupByYear(d){
	const parseDate = timeParse("%Y-%m-%d")
	
	const formatTime = timeFormat("%Y");
    
	let data = nest()
			.key(d => formatTime(parseDate(d.tradeTime)))
			.entries(housing)

	data = data.filter(d => d.key === "2012" || d.key === "2013" || d.key === "2014" || d.key === "2015" || d.key === "2016" || d.key === "2017")

	return data
}


function groupByDistrict(d){
	
	const housing_tem = nest()
			.key(d => d.district)
			.entries(housing);

	return housing_tem;
}


export{
	parseData,
	parseIncomeData,
	parseDistrictData,
	groupByYear,
	groupByDistrict
}
