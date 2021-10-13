//Declaring all global variables
const form = document.querySelector("form");
const input = document.querySelector("input");
const weatherWidget = document.querySelector(".weather-widget");
const errorMsg = document.querySelector("small");
const weatherData = document.querySelectorAll(".temp-container");
const temperature = document.querySelector("h4");
const precipitation = document.querySelector(".precipitation");
const domHumidity = document.querySelector(".humidity");
const domWind = document.querySelector(".wind");
const locationDisplay = document.querySelector(".city-display");
const dayAndTime = document.getElementById("time");
const weatherCondition = document.getElementById("weather-condition");
const selectElement = document.getElementById("recent-searches");
const todayHighTemp = document.getElementById("today-high-temp");
const todayLowTemp = document.getElementById("today-low-temp");
const tomorrowHighTemp = document.getElementById("tomorrow-high-temp");
const tomorrowLowTemp = document.getElementById("tomorrow-low-temp");
const thirdDayHighTemp = document.getElementById("third-high-temp");
const thirdDayLowTemp = document.getElementById("third-low-temp");
const thirdDayOf = document.getElementById("third-day-week");
const forecastHeader = document.getElementById("forecast-header");
const forecastContainer = document.querySelector(".forecast-container");

let lastBackgroundClass = "";

//Populating UI from last session
// retrieveLocalStorage();
//This is a comment

//defining all functions
function populateForecast(today, tomorrow, thirdDay, dayOfWeek) {
  document.getElementById("today-icon").src = `${today.weatherIcon}`;
  document.getElementById("tomorrow-icon").src = `${tomorrow.weatherIcon}`;
  document.getElementById("third-day-icon").src = `${thirdDay.weatherIcon}`;
  console.log(typeof dayOfWeek);

  todayHighTemp.innerHTML = `<p>${today.maxTemp}&#xb0;</p>`;
  todayLowTemp.innerHTML = `<p>${today.minTemp}&#xb0;</p>`;
  tomorrowHighTemp.innerHTML = `<p>${tomorrow.maxTemp}&#xb0;</p>`;
  tomorrowLowTemp.innerHTML = `<p>${tomorrow.minTemp}&#xb0;</p>`;
  thirdDayHighTemp.innerHTML = `<p>${thirdDay.maxTemp}&#xb0;</p>`;
  thirdDayLowTemp.innerHTML = `<p>${thirdDay.minTemp}&#xb0;</p>`;
  thirdDayOf.innerHTML = `<p>${dayOfWeek}</p>`;
  forecastHeader.style.visibility = "unset";
  forecastContainer.style.visibility = "unset";
}
function showMeTheForecast(city, state) {
  axios
    .get(`http://localhost:4000/api/weather/forecast/${city}/${state}`)
    .then((res) => {
      const forecastArr = res.data.data.forecast.forecastday;
      const { dayOfWeek } = res.data;
      const todayMax = Math.floor(forecastArr[0].day.maxtemp_f);
      const todayMin = Math.floor(forecastArr[0].day.mintemp_f);
      const tomorrowMax = Math.floor(forecastArr[1].day.maxtemp_f);
      const tomorrowMin = Math.floor(forecastArr[1].day.mintemp_f);
      const thirdDayMax = Math.floor(forecastArr[2].day.maxtemp_f);
      const thirdDayMin = Math.floor(forecastArr[2].day.mintemp_f);
      const todayObj = {
        maxTemp: todayMax,
        minTemp: todayMin,
        weatherIcon: `https:${forecastArr[0].day.condition.icon}`,
      };
      const tommorrowObj = {
        maxTemp: tomorrowMax,
        minTemp: tomorrowMin,
        weatherIcon: `https:${forecastArr[1].day.condition.icon}`,
      };
      const thirdDayObj = {
        maxTemp: thirdDayMax,
        minTemp: thirdDayMin,
        weatherIcon: `https:${forecastArr[2].day.condition.icon}`,
      };

      populateForecast(todayObj, tommorrowObj, thirdDayObj, dayOfWeek);
    })
    .catch((err) => console.log(err));
}
function hitMyAPI(city, state) {
  axios
    .get(`http://localhost:4000/api/weather/${city}/${state}`)
    .then((res) => {
      populateUI(res.data);
    })
    .catch((err) => console.log(err));
}
function populateSelectElement(searches) {
  selectElement.innerHTML = `<option value="" disabled selected hidden >Recent Searches</option>`;

  for (let i = 0; i < searches.length; i++) {
    const city = searches[i].cityName;
    const state = searches[i].stateName;

    const newOption = document.createElement("option");
    newOption.textContent = `${city}, ${state}`;
    newOption.setAttribute("value", `${city}, ${state}`);
    selectElement.appendChild(newOption);
  }
}

function saveSearch(city, state) {
  axios
    .post("http://localhost:4000/api/save", { city, state })
    .then((res) => {
      // console.log(res.data)
      populateSelectElement(res.data);
    })
    .catch((err) => console.log(err));
}

function retrieveLocalStorage() {
  const localTemp = JSON.parse(localStorage.getItem("temperature"));
  const localWeatherIcon = JSON.parse(localStorage.getItem("weatherIcon"));
  const localPrecipitation = JSON.parse(localStorage.getItem("precipitation"));
  const localHumidity = JSON.parse(localStorage.getItem("humidity"));
  const localWind = JSON.parse(localStorage.getItem("wind"));
  const localCity = JSON.parse(localStorage.getItem("city"));
  const localState = JSON.parse(localStorage.getItem("state"));
  const localTime = JSON.parse(localStorage.getItem("time"));
  const localCondition = JSON.parse(localStorage.getItem("condition"));
  const localBackground = JSON.parse(localStorage.getItem("background"));

  temperature.textContent = `${localTemp}`;
  precipitation.textContent = `Precipitation: ${localPrecipitation} in`;
  domHumidity.textContent = `Humidity: ${localHumidity}%`;
  domWind.textContent = `Wind: ${localWind} mph`;
  document.getElementById("weather-symbol").src = `${localWeatherIcon}`;

  locationDisplay.textContent = `${localCity}, ${localState}`;
  time.textContent = `${localTime[0]} ${localTime[1]}`;
  weatherCondition.textContent = `${localCondition}`;
  weatherWidget.classList.add(`${localBackground}`);
}

//will change the background gradient class based on weather condition
function updateBackground(res) {
  const { text } = res.data.current.condition;
  const { is_day } = res.data.current;

  if (text.includes("rain") || text.includes("snow")) {
    if (lastBackgroundClass === "") {
      weatherWidget.classList.add("storm-rain");
      lastBackgroundClass = "storm-rain";
      localStorage.setItem("background", JSON.stringify(lastBackgroundClass));
    } else {
      weatherWidget.classList.remove(`${lastBackgroundClass}`);
      weatherWidget.classList.add("storm-rain");
      lastBackgroundClass = "storm-rain";
      localStorage.setItem("background", JSON.stringify(lastBackgroundClass));
    }
  } else if ((text === "Clear" || text === "Sunny") && is_day !== 0) {
    if (lastBackgroundClass === "") {
      weatherWidget.classList.add("clear-sunny");
      lastBackgroundClass = "clear-sunny";
      localStorage.setItem("background", JSON.stringify(lastBackgroundClass));
    } else {
      weatherWidget.classList.remove(`${lastBackgroundClass}`);
      weatherWidget.classList.add("clear-sunny");
      lastBackgroundClass = "clear-sunny";
      localStorage.setItem("background", JSON.stringify(lastBackgroundClass));
    }
  } else if (is_day === 0 && text === "Clear") {
    if (lastBackgroundClass === "") {
      weatherWidget.classList.add("night");
      lastBackgroundClass = "night";
      localStorage.setItem("background", JSON.stringify(lastBackgroundClass));
    } else {
      weatherWidget.classList.remove(`${lastBackgroundClass}`);
      weatherWidget.classList.add("night");
      lastBackgroundClass = "night";
      localStorage.setItem("background", JSON.stringify(lastBackgroundClass));
    }
  } else if (
    text.includes("cloudy") ||
    text.includes("Cloudy") ||
    text === "Overcast" ||
    text.includes("drizzle")
  ) {
    if (lastBackgroundClass === "") {
      weatherWidget.classList.add("cloudy");
      lastBackgroundClass = "cloudy";
      localStorage.setItem("background", JSON.stringify(lastBackgroundClass));
    } else {
      weatherWidget.classList.remove(`${lastBackgroundClass}`);
      weatherWidget.classList.add("cloudy");
      lastBackgroundClass = "cloudy";
      localStorage.setItem("background", JSON.stringify(lastBackgroundClass));
    }
  } else {
    console.log("Didn't meet a condition");
  }
}

//Updates all of the local information for the city searched in the top right of the UI
function updateLocalInfo(condition, resObjLocation, timestamp) {
  const timestampArr = timestamp.split(",");
  const { name } = resObjLocation;
  const { region } = resObjLocation;

  timestampArr.splice(1, 1);

  locationDisplay.textContent = `${name}, ${region}`;
  time.textContent = `${timestampArr[0]} ${timestampArr[1]}`;
  weatherCondition.textContent = `${condition}`;

  //Loading values into local storage
  localStorage.setItem("city", JSON.stringify(name));
  localStorage.setItem("state", JSON.stringify(region));
  localStorage.setItem("time", JSON.stringify(timestampArr));
  localStorage.setItem("condition", JSON.stringify(condition));
}

//Check to make sure user entered correct format: city, state
function incorrectFormat(locationArr) {
  const locationStr = locationArr.join();
  if (!locationStr.includes(",")) {
    errorMsg.style.visibility = "unset";
  }
}

//Updates all temperature information in the middle of the page
function updateTemperature(temp) {
  const currentTemp = Math.floor(temp.temp_f);
  const precipitationInches = temp.precip_in;
  const { humidity } = temp;
  const wind = Math.floor(temp.gust_mph);
  const conditionSymbol = `https:${temp.condition.icon}`;

  temperature.textContent = `${currentTemp}`;
  precipitation.textContent = `Precipitation: ${precipitationInches} in`;
  domHumidity.textContent = `Humidity: ${humidity}%`;
  domWind.textContent = `Wind: ${wind} mph`;
  document.getElementById("weather-symbol").src = `${conditionSymbol}`;

  //Loading everything into local storage
  localStorage.setItem("temperature", JSON.stringify(currentTemp));
  localStorage.setItem("precipitation", JSON.stringify(precipitationInches));
  localStorage.setItem("humidity", JSON.stringify(humidity));
  localStorage.setItem("wind", JSON.stringify(wind));
  localStorage.setItem("weatherIcon", JSON.stringify(conditionSymbol));
}

//Calls on all other functions to populate all of the dynamic information on the page
function populateUI(res) {
  updateTemperature(res.data.current);
  updateLocalInfo(
    res.data.current.condition.text,
    res.data.location,
    res.timeStamp
  );
  updateBackground(res);
}

//All event listeners
form.addEventListener("submit", (e) => {
  errorMsg.style.visibility = "hidden";
  e.preventDefault();
  // console.log(input)
  const userInput = document.getElementById("user-input").value;
  const locationArr = userInput.split(",");
  const city = locationArr[0];
  const state = locationArr[1];

  incorrectFormat(locationArr);
  saveSearch(city, state);
  hitMyAPI(city, state);
  showMeTheForecast(city, state);
});

selectElement.addEventListener("change", (e) => {
  const value = e.target.value.split(",  ");
  hitMyAPI(value[0], value[1]);
  showMeTheForecast(value[0], value[1]);
});
