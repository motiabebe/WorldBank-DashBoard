const loadingSpinner = document.querySelector('#loadingSpinner');
const showLoadingSpinner = () => {
    loadingSpinner.classList.remove('d-none');
}
const hideLoadingSpinner = () => {
    loadingSpinner.classList.add('d-none');
}

const customPopulationFetch = document.querySelector('#customPopulationFetch')


// Population chart
Highcharts.chart('customPopulationChart', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Select a country and a date range to see the population'
    },
    subtitle: {
        text: 'Source: World Bank'
    },
    xAxis: {
        categories: ['1960', '1965', '1970', '1975', '1980'],
        title: {
            text: 'Year'
        }
    },
    yAxis: {
        title: {
            text: 'Population'
        }
    },
    plotOptions: {
        line: {
            dataLabels: {
                enabled: true
            },
            enableMouseTracking: false,
            color: '#FF0000'
        }
    },
    series: [{
        name: 'Population',
    }]
});


// function that fetches the population of a country between two dates
customPopulationFetch.onclick = async () => {
    showLoadingSpinner()

    const getSelectedCountry = document.querySelector('#customPopulationCountry').value
    const getStartDate = document.querySelector('#customPopulationStartYear').value
    const getEndDate = document.querySelector('#customPopulationEndYear').value

    const request = await fetch(`https://api.worldbank.org/v2/country/${getSelectedCountry}/indicator/SP.POP.TOTL?date=${getStartDate}:${getEndDate}&format=json`)
    if(!request.ok) {
        alert('Error fetching data')
        hideLoadingSpinner()
        return
    }
    const response = await request.json()
    const populationReport = response[1]

    const populationChart = Highcharts.charts[0]

    // update chart title with country name
    populationChart.setTitle({ text: populationReport[0].country.value })
    // clear chart series
    populationChart.series[0].setData([])
    // clear xAxis categories
    populationChart.xAxis[0].setCategories([])

    // update chart xAxis with each date from populationReport
    const dates = populationReport.map(report => report.date).reverse()
    populationChart.xAxis[0].setCategories(dates)

    // update chart series with each date from populationReport
    populationReport.reverse().forEach(report => {
        const population = report.value
        populationChart.series[0].addPoint([population])
    })

    hideLoadingSpinner()
}

// Population by region chart
Highcharts.chart('populationByRegionChart', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: 1000
    },
    title: {
        text: 'Population by Region',
        align: 'left'
    },
    subtitle: {
        text: 'Data avaiable from 1960 to 2020',
        align: 'left'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Region',
        colorByPoint: true,
        data: [{
            name: 'Africa',
            y: 1338612955,
            sliced: true,
            selected: true
        }, {
            name: 'East Asia & Pacific',
            y: 2313682459
        }, {
            name: 'Europe & Central Asia',
            y: 746622014
        }, {
            name: 'Latin America & Caribbean',
            y: 646834047
        }, {
            name: 'Middle East & North Africa',
            y: 455980113
        }, {
            name: 'North America',
            y: 368869647
        }, {
            name: 'South Asia',
            y: 1844944386
        }]
    }]
});



// function that fetches the population of the world by region
const fetchPopulationByRegion = async () => {
    showLoadingSpinner()

    const request = await fetch('https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?date=2022&format=json&per_page=1000')

    if(!request.ok) {
        alert('Error fetching data')
        hideLoadingSpinner()
        return
    }
    const response = await request.json()
    // console.log(response)
    const populationReport = response[1]

    const populationByRegionChart = Highcharts.charts[1]

    // update chart title with country name
    populationByRegionChart.setTitle({ text: 'Population by Region' })

    
    // slice the populationReport array and remove the first 48 items
    const populationReportSliced = populationReport.slice(49)
    
    // loop through populationReport and get the population of each region and add it to the chart
    const data = populationReportSliced.map(report => ({ name: report.country.value, y: report.value }));
    populationByRegionChart.series[0].setData(data);

    // console.log('finsihed')

    hideLoadingSpinner()
}


fetchPopulationByRegion()

// column to compare population of two countries
Highcharts.chart('comparePopulationChart', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Select two countries to compare their population'
    },
    subtitle: {
        text: 'Source: World Bank'
    },
    xAxis: {
        categories: [
            'Population'
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Population (millions)'
        }
    },
    series: [{
        name: 'Population',
        data: []
    }]

});


const comparePopulationBtn = document.querySelector('#comparePopulationBtn')

// function that fetches the population of a two countries and compares them
comparePopulationBtn.onclick = async () => {
    showLoadingSpinner()

    const getFirstCountry = document.querySelector('#compareCountrySelect1').value
    const getSecondCountry = document.querySelector('#compareCountrySelect2').value

    const request = await fetch(`https://api.worldbank.org/v2/country/${getFirstCountry};${getSecondCountry}/indicator/SP.POP.TOTL?date=2022&format=json`)
    if(!request.ok) {
        alert('Error fetching data')
        hideLoadingSpinner()
        return
    }
    const response = await request.json()
    const populationReport = response[1]
    console.log(populationReport)

    const comparePopulationChart = Highcharts.charts[2]

    // update chart title with country name
    comparePopulationChart.setTitle({ text: `Comparison Population of ${populationReport[0].country.value} and ${populationReport[1].country.value}` })

    // update chart series data with population of each country
    comparePopulationChart.series[0].setData([populationReport[0].value, populationReport[1].value])

    // update chart xAxis categories with each country name
    comparePopulationChart.xAxis[0].setCategories([populationReport[0].country.value, populationReport[1].country.value])

    hideLoadingSpinner()

}


// function used to create the select options for the countries
const getData = async () => {

    const request = await fetch('https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?date=2019&format=json&per_page=1000')

    if(!request.ok) {
        alert('Error fetching data')
        hideLoadingSpinner()
        return
    }
    const response = await request.json()
    const countries = response[1]
    console.log(countries)


    // print all countries id and name
    countries.forEach(country => {
        const countryId = country.country.id
        const countryName = country.country.value
        // console.log(countryId, countryName)

        const select = document.querySelector('#selectCountry')
        const option = document.createElement('option')
        option.value = countryId
        option.textContent = countryName
        select.appendChild(option)
    })
}

// getData()
