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
  navigator.geolocation.getCurrentPosition(currentPosition);
}

function currentPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  let apiKey = "16c0c42e9a748ab88f78a65c6f902070";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(showTemperature);
}

function getWeatherData(city) {
  let apiKey = "16c0c42e9a748ab88f78a65c6f902070";
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
