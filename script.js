async function getWeather() {
    const city = document.getElementById('cityInput').value;
    const apiKey = '02d10b200fe816bff4a85a27b4ace47b'; // Replace with your OpenWeather API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    // Show the spinner
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('weatherCard').style.display = 'none';
    document.getElementById('forecastContainer').style.display = 'none';

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('City not found');

        const data = await response.json();
        displayWeather(data);
        await getForecast(city); // Fetch forecast data
    } catch (error) {
        alert(error.message);
    } finally {
        // Hide the spinner after fetching data
        document.getElementById('spinner').style.display = 'none';
    }
}

function displayWeather(data) {
    document.getElementById('cityName').innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').innerText = `Temperature: ${data.main.temp}°C`;
    document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById('condition').innerText = `Condition: ${data.weather[0].description}`;
    document.getElementById('windSpeed').innerText = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById('visibility').innerText = `Visibility: ${(data.visibility / 1000).toFixed(2)} km`;

    // Set weather icon
    const iconId = data.weather[0].icon;
    document.getElementById('weatherIcon').src = `http://openweathermap.org/img/wn/${iconId}@2x.png`;

    // Show the weather card
    document.getElementById('weatherCard').style.display = 'block';
}

async function getForecast(city) {
    const apiKey = '02d10b200fe816bff4a85a27b4ace47b'; // Replace with your OpenWeather API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Forecast not found');

        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        alert(error.message);
    }
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    // Get the next three forecasts
    const forecastList = data.list.filter((item, index) => index % 8 === 0).slice(0, 3);

    forecastList.forEach((item) => {
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        const date = new Date(item.dt * 1000);
        const weatherIcon = item.weather[0].icon;
        const temp = item.main.temp;

        forecastItem.innerHTML = `
            <h3>${date.toLocaleDateString()}</h3>
            <img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="Weather Icon">
            <p>Temp: ${temp}°C</p>
        `;

        forecastContainer.appendChild(forecastItem);
    });

    // Show the forecast container
    forecastContainer.style.display = 'flex';
}

// Event listener for button click
document.getElementById('getWeatherBtn').addEventListener('click', getWeather);
