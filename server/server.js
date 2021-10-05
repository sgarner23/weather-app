const express = require("express");
const cors = require("cors");
const app = express();
const ctrl = require("./controller");
app.use(cors());
app.use(express.json()); // When we want to be able to accept JSON

app.get('/api/weather/:city/:state', ctrl.searchWeatherByCity)
app.get('/api/weather/forecast/:city/:state', ctrl.getTheForecast)
app.post('/api/save', ctrl.saveTheSearch)


const port = 4000;
app.listen(port, () => console.log(`Lightning has struck at ${port}`));
