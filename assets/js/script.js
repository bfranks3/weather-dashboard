var cityFormEl = document.querySelector("#city-search");
var cityInputEl = document.querySelector("#city-name");
var currentWeather = document.querySelector("#current-weather");
var fiveDayIcon = document.querySelector("#five-day-icon");
var forecastCardsContainerEl = document.querySelector("#forecast-cards");
var savedBox = document.querySelector("#saved-box");
var city = "";
var searchedCities = [];
var apiKey = "a42035ac268e1618342dba6f73c69192";
var index = "";
var latAndLon = "";
var weatherInfo = "";


var getLocation = async function () {
    var locationApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;
    await fetch(locationApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                if (!data.length) {
                    alert("Error: City Not Found. Make sure you're entering a city name ONLY.");
                } else {
                    latAndLon = data[0]
                    getForecast();
                }

            });
        } else {
            alert("Error: City Not Found");
            return false;
        }
    });
};

var getForecast = function () {
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latAndLon.lat + "&lon=" + latAndLon.lon + "&exclude=minutely,hourly&units=imperial&appid=" + apiKey;
    fetch(weatherApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                weatherInfo = data;
                displayCurrentWeather();
                displayFiveDayWeather();

            });
        } else {
            alert("Error: Forecast Not Found");
            return false;
        }
    });
};

var setCurrentText = function (id, text) {
    document.getElementById(`current-${id}`).textContent = text

}
var displayCurrentWeather = function () {
    setCurrentText("city-name", `The Current Weather in ${latAndLon.name}, ${latAndLon.state}, ${latAndLon.country}`);
    setCurrentText("temp", "Temp: " + weatherInfo.current.temp + "°F");
    setCurrentText("wind", "Wind: " + weatherInfo.current.wind_speed + " MPH");
    setCurrentText("humidity", "Humidity: " + weatherInfo.current.humidity + "%");
    setCurrentText("uv", "UV Index: ");
    setCurrentText("uv-color", weatherInfo.current.uvi);
    if (weatherInfo.current.uvi < 3) {
        document.getElementById(`current-uv-color`).setAttribute("class", "ml-2 bg-primary rounded px-1 pb-0 font-weight-bold");

    } else if (weatherInfo.current.uvi >= 3 && weatherInfo.current.uvi < 6) {
        document.getElementById(`current-uv-color`).setAttribute("class", "ml-2 bg-success rounded px-1 pb-0 font-weight-bold");
    } else if (weatherInfo.current.uvi >= 6 && weatherInfo.current.uvi < 8) {
        document.getElementById(`current-uv-color`).setAttribute("class", "ml-2 bg-warning rounded px-1 pb-0 font-weight-bold");
    } else {
        document.getElementById(`current-uv-color`).setAttribute("class", "ml-2 bg-danger rounded px-1 pb-0 font-weight-bold");
    }
}


var displayFiveDayWeather = function () {
    forecastCardsContainerEl.innerHTML = `
        ${weatherInfo.daily.map((forecastDay, index) => {
        if (index < 5) {
            return `<div class="card col-10 mx-auto p-1 col-md-2 m-md-1 ">
            <span>${new Date(forecastDay.dt * 1000).toDateString()}</span>
            <img width="50" src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}.png"/>
            <span>Temp: ${forecastDay.temp.day}°F</span>
            <span>Wind: ${forecastDay.wind_speed} MPH</span>
            <span>Humidity: ${forecastDay.humidity}%</span>
        </div>`}
    }).join('')}`;
}


var formSubmitHandler = async function (event) {
    event.preventDefault();
    city = cityInputEl.value.trim();
    var pastSearchesEl = document.createElement("button");
    pastSearchesEl.textcontet = city;
    if (city) {
        searchedCities.push(city);
        saveSearch();
        displaySavedSearches();
        await getLocation(city).then(() => {
            console.log(latAndLon);
            cityInputEl.value = "";
        });
    } else {
        alert("Please enter a city");
    }
};

var saveSearch = function () {
    // var previousCities = new Set(searchedCities);
    // console.log(previousCities);

    localStorage.setItem("previous cities", JSON.stringify(searchedCities));
}


var displaySavedSearches = function () {
    var localSavedCities = JSON.parse(localStorage.getItem("previous cities"));
    console.log(localSavedCities);
    if (localSavedCities && localSavedCities.length) {
        var cityBtns = '';
        for (var i = 0; i < localSavedCities.length; i++) {
            cityBtns += `<button class="text-capitalize" id="${localSavedCities[i]}">${localSavedCities[i]}</button>`
        }
        savedBox.innerHTML = cityBtns
    }
}

var displayPreviousWeather = function (e) {
    city = e.target.id;
    getLocation();
    // console.log(e.target.id);
}

savedBox.addEventListener("click", function (e) { displayPreviousWeather(e) });







cityFormEl.addEventListener("submit", formSubmitHandler);