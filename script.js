let lineChart, barChart, pieChart;

async function loadData() {
    let response = await fetch("aqi_data.json");
    return await response.json();
}

async function loadCityData() {

    let city = document.getElementById("citySelect").value;
    let data = await loadData();

    let cityData = data.filter(d => d.City === city);

    let dates = cityData.map(d => d.Date);
    let aqi = cityData.map(d => d.AQI);

    let pm25 = cityData.map(d => d["PM2.5"]);
    let pm10 = cityData.map(d => d["PM10"]);
    let no2 = cityData.map(d => d["NO2"]);

    // 📊 STATS
    let min = Math.min(...aqi);
    let max = Math.max(...aqi);
    let avg = (aqi.reduce((a,b)=>a+b,0)/aqi.length).toFixed(2);

    document.getElementById("result").innerHTML = `City: ${city}`;
    document.getElementById("stats").innerHTML =
        `Min: ${min} | Max: ${max} | Avg: ${avg}`;

    // Destroy old charts
    if (lineChart) lineChart.destroy();
    if (barChart) barChart.destroy();
    if (pieChart) pieChart.destroy();

    // 📈 LINE CHART
    lineChart = new Chart(document.getElementById("lineChart"), {
        type: "line",
        data: {
            labels: dates,
            datasets: [{
                label: "AQI Trend",
                data: aqi
            }]
        }
    });

    // 📊 BAR CHART (average pollutants)
    let avgPM25 = average(pm25);
    let avgPM10 = average(pm10);
    let avgNO2 = average(no2);

    barChart = new Chart(document.getElementById("barChart"), {
        type: "bar",
        data: {
            labels: ["PM2.5", "PM10", "NO2"],
            datasets: [{
                label: "Average Pollution",
                data: [avgPM25, avgPM10, avgNO2]
            }]
        }
    });

    // 🥧 PIE CHART (AQI categories)
    let good = aqi.filter(v => v <= 50).length;
    let moderate = aqi.filter(v => v > 50 && v <= 100).length;
    let unhealthy = aqi.filter(v => v > 100).length;

    pieChart = new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels: ["Good", "Moderate", "Unhealthy"],
            datasets: [{
                data: [good, moderate, unhealthy]
            }]
        }
    });
}

function average(arr) {
    return (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(2);
}

// Load default city on start
loadCityData();