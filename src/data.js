import{
	parseData,
	parseDistrictData,
	parseIncomeData
} from './utils';

import {csv, timeParse, timeFormat, descending, nest, mean} from 'd3';

const dataPromise2017 = csv("./data/2017.csv", parseData);
const districtPromise = csv("./data/district.csv", parseDistrictData)
//	.then(data => new Map(data));
const dataPromise = csv("./data/new.csv", parseData);
const incomePromise = csv("./data/income.csv", parseIncomeData)

// const districtPromise = csv("district.csv",parseDistrict).then(district => {
// 	const district_tem = district.map(a =>{
// 		return [a.code,a.name]
// 	});
	
// 	const districtMap = new Map(district_tem);

// 	return districtMap

// });


//housing combined with income 
const housingDataCombined = Promise.all([
	dataPromise,
	incomePromise,
	districtPromise
	])
	.then(([housing, income, district]) => {
		
		const district_tem = district.map(a =>{
			return [a.code,a.name]
		});
		//create new map, return?
		const districtMap = new Map(district_tem);

		const parseDate = timeParse("%m/%d/%y")

		const formatTime = timeFormat("%Y");

		const income_tem = nest()
			.key(d => d.name)
			.entries(income);

		const income_tem2 = income_tem.map(a =>{
			return [a.key,a.values]
		})
		const incomeMap = new Map(income_tem2)
		//console.log(incomeMap);
		//console.log(districtMap)
		const housing_ave = nest()
			.key(d => d.district)
			.key(d => formatTime(parseDate(d.time)))
			.rollup(values => mean(values, d => d.price))
			.entries(housing)
		
		/*用map合并数据*/
		let housingAugmented = housing_ave.map(d => {
			const name = districtMap.get(d.key);
		
			d.name = name;

			let income = incomeMap.get(name);
			//console.log(income)

			if(income){
				var i;
				for (i = 0; i < d.values.length; i++) { 
						d.values[i].income = income.filter(a => a.year === d.values[i].key);
				}
				
			//	d.income = income
			}

			d.values = d.values.filter( a=> a.key === '2012' ||a.key === "2013" ||a.key === "2014" ||a.key === "2015" ||a.key === "2016" ||a.key === "2017" );

			let res;

			for (let i = 0; i < d.values.length; i++) {
				d.values[i].income = +d.values[i].income[0].income;
			}

			d.values = d.values.sort(function(x, y){
					return descending(x.key, y.key);
			})


			return d;

		});

		return housingAugmented


	})

export{
	dataPromise2017,
	districtPromise,
	incomePromise,
	dataPromise,
	housingDataCombined
}