const axios = require("axios");
const moment = require("moment");

let searchArr = [];

function limitSearchHistoryTo3(searchArr) {
  if (searchArr.length > 3) {
    searchArr.splice(0, 1);
  }
}

async function searchWeatherByCity(req, res) {
  const { city, state } = req.params;
  const res2 = await axios
    .get(
      `https://api.weatherapi.com/v1/current.json?key=6a3fb009f4b94023b7734027212909&q=${city},${state}&aqi=no`
    )
    .catch((err) => console.log(err));
  const { localtime } = res2.data.location;
  const dateTime = moment(localtime).format("dddd, MMMM Do YYYY, h:mm a");
  const dataObj = { data: res2.data, timeStamp: dateTime };
  res.status(200).send(dataObj);
}

async function getTheForecast(req, res) {
  const { city, state } = req.params;
  const res2 = await axios
    .get(
      `https://api.weatherapi.com/v1/forecast.json?key=6a3fb009f4b94023b7734027212909&q=${city}, ${state}&days=4&aqi=no&alerts=no`
    )
    .catch((err) => console.log(err));
    const { date } = res2.data.forecast.forecastday[2];
    const dateInNewFormat = moment(date).format("dddd, MMMM Do YYYY");
    
    const dateArr = dateInNewFormat.split(",")
    const thirdDayOfTheWeek = dateArr[0]
    const dataObj = { data: res2.data, dayOfWeek: thirdDayOfTheWeek };
    
    res.status(200).send(dataObj);
}

function saveTheSearch(req, res) {
  const { city, state } = req.body;
  let searchObj = { cityName: city, stateName: state };
  searchArr.push(searchObj);
  limitSearchHistoryTo3(searchArr);
  
  res.status(200).send(searchArr);
}

module.exports = {
  searchWeatherByCity,
  saveTheSearch,
  getTheForecast,
};
