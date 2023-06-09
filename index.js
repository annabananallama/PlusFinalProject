let currentTempCelsius;
let currentTempFahrenheit;
let isCelsius = true;

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const h4 = document.querySelector("h4");
const cityNameElement = document.getElementById("cityName");
const temperatureElement = document.querySelector(".current-temp");
const enterButton = document.getElementById("enterButton");
const locationInput = document.getElementById("locationInput");
const currentLocationButton = document.querySelector(".currentLocation");
const h5 = document.querySelector("h5");

function formatDate() {
  const now = new Date();
  const currentDayOfWeek = daysOfWeek[now.getDay()];
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  h4.innerHTML = `${currentDayOfWeek} ${hours}:${minutes}`;
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    let apiKey = "535cacbb3f8a0df0aeb4790235b9541f";
    let currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    let forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly&units=metric&appid=${apiKey}`;

    axios
      .all([axios.get(currentWeatherApiUrl), axios.get(forecastApiUrl)])
      .then(
        axios.spread((currentWeatherResponse, forecastResponse) => {
          showTemperature(currentWeatherResponse);
          displayForecast(forecastResponse);
        })
      );
  });
}

function currentPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  let apiKey = "535cacbb3f8a0df0aeb4790235b9541f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(showTemperature);
}

function getWeatherData(city) {
  let apiKey = "535cacbb3f8a0df0aeb4790235b9541f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(displayWeatherData);
}

function showTemperature(response) {
  let city = response.data.name;
  let windSpeed = Math.round(response.data.wind.speed);
  let description = response.data.weather[0].description;
  currentTempCelsius = Math.round(response.data.main.temp);
  currentTempFahrenheit = Math.round((currentTempCelsius * 9) / 5 + 32);

  cityNameElement.innerHTML = `${city}`;
  temperatureElement.innerHTML = `<strong>Temperature:</strong></br> ${currentTempCelsius}°C`;

  const windSpeedElement = document.querySelector(".speed");
  windSpeedElement.innerHTML = `${windSpeed} m/s`;

  const descriptionElement = document.querySelector(".description");
  descriptionElement.innerHTML = `${description}`;

  let iconElement = document.querySelector(".icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function displayWeatherData(response) {
  let city = response.data.name;
  let windSpeed = Math.round(response.data.wind.speed);
  let description = response.data.weather[0].description;
  currentTempCelsius = Math.round(response.data.main.temp);
  currentTempFahrenheit = Math.round((currentTempCelsius * 9) / 5 + 32);

  cityNameElement.innerHTML = city;
  temperatureElement.innerHTML = `<strong>Temperature:</strong></br> ${currentTempCelsius}°C`;

  const windSpeedElement = document.querySelector(".speed");
  windSpeedElement.innerHTML = `${windSpeed} m/s`;

  const descriptionElement = document.querySelector(".description");
  descriptionElement.innerHTML = `${description}`;

  let iconElement = document.querySelector(".icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function toggleTemperature() {
  if (isCelsius) {
    temperatureElement.innerHTML = `<strong>Temperature:</strong></br>${currentTempFahrenheit}°F`;
    isCelsius = false;
  } else {
    temperatureElement.innerHTML = `<strong>Temperature:</strong></br>${currentTempCelsius}°C`;
    isCelsius = true;
  }
}

enterButton.addEventListener("click", function (event) {
  event.preventDefault();
  let city = locationInput.value.trim();
  getWeatherData(city);
});

locationInput.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    let city = locationInput.value.trim();
    getWeatherData(city);
  }
});

currentLocationButton.addEventListener("click", getCurrentPosition);

h5.addEventListener("click", toggleTemperature);

formatDate();
getCurrentPosition();

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = daysOfWeek[date.getDay()];
  return day;
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> H:${Math.round(
            forecastDay.temp.max
          )}°C </span>
          <span class="weather-forecast-temperature-min"> L:${Math.round(
            forecastDay.temp.min
          )}°C </span>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "535cacbb3f8a0df0aeb4790235b9541f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
