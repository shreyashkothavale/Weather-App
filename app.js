const timeId = document.getElementById("time");
const dateId = document.getElementById("date");
const currentWeatherItemsId = document.getElementById(
  "current__weather__items"
);
const timeZone = document.getElementById("time-zone");
const weatherForecast = document.getElementById("weather-forecast");
const currentTemp = document.getElementById("current-temp");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "March",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

//API FETCH FROM openwearthermap.org
const API_KEY = API_SECRET_KEY;
setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeId.innerHTML =
    hoursIn12HrFormat +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;
  dateId.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

function weatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
}

weatherData();

function showWeatherData(data) {
  let { humidity, pressure, wind_speed } = data.current;

  timeZone.innerHTML = data.timezone;

  currentWeatherItemsId.innerHTML = `<div class="weather-item">
  <div>Humidity</div>
  <div>${humidity}%</div>
</div>
<div class="weather-item">
  <div>Pressure</div>
  <div>${pressure}</div>
</div>
<div class="weather-item">
  <div>Wind speed</div>
  <div>${wind_speed}</div>
</div>



`;

  let otherDayForeCast = "";

  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTemp.innerHTML = `
      <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weathericon" class="w-icon" />
      <div class="other">
          <div class="day">Monday</div>
          <div class="temp">Night :${day.temp.night}°C</div>
          <div class="temp">Day : ${day.temp.day}°C</div>
      </div>`;
    } else {
      otherDayForeCast += `  <div class="weather-forecast-item">
      <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
      <img src="http://openweathermap.org/img/wn/${
        day.weather[0].icon
      }@2x.png" alt="weathericon" class="w-icon" />

      <div class="temp">Night : ${day.temp.night}°C</div>
      <div class="temp">Day : ${day.temp.day}°C</div>
    </div>
    `;
    }
  });
  weatherForecast.innerHTML = otherDayForeCast;
}
