const key = "6fc9ac47c4cb1b28f122d2c1edc9df51";

// Global variables to set default attributes
let city, feels_like, humidity, pressure, temp, temp_max, temp_min, wind_speed, cloudiness, visibility;
let tempUnit = "°C", humidityUnit = "%", pressureUnit = "hPa"; // Default units

async function setAttributes() {
   
    document.querySelector(".main-temp").innerText = Math.round(temp) + " " + tempUnit;
    document.querySelector(".feels_text").innerText = Math.round(feels_like) + " " + tempUnit;
    document.querySelector(".humidity_text").innerText = Math.round(humidity) + " " + humidityUnit;
    document.querySelector(".pressure_text").innerText = Math.round(pressure) + " " + pressureUnit;
    document.querySelector(".temp_max_text").innerText = Math.round(temp_max) + " " + tempUnit;
    document.querySelector(".temp_min_text").innerText = Math.round(temp_min) + " " + tempUnit;
    document.querySelector(".wind-speed").innerText = Math.round(wind_speed);
    document.querySelector(".cloudiness").innerText = Math.round(cloudiness);
    document.querySelector(".visibility").innerText = Math.round(visibility);
    document.querySelector(".city-name").innerText = city;
}

function getname() {
    let cityname = document.querySelector("#search").value;
    if (!cityname) {
        cityname = "Karachi"; // Default to Karachi if no city name is provided
    }
    let s = cityname.toLowerCase();
    let a = s[0].toUpperCase();
    let x = s.slice(1);
    let newname = a + x;
    return newname;
}

async function getWeatherUnits() {
    try {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=Karachi&appid=${key}`;
        let response = await fetch(url);
        let data = await response.json();

        // Check if units are available in the response
        if (data.units && data.units.temp && data.units.humidity && data.units.pressure) {
            tempUnit = data.units.temp;
            humidityUnit = data.units.humidity;
            pressureUnit = data.units.pressure;
        } else {
            console.error("Units not found in API response. Using default units.");
        }
    } catch (error) {
        console.error("Error fetching units:", error.message);
    }
}

async function getmainIcon(ic) {
    let icon = await ic;
    let url3 = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    let tempIconRaw = await fetch(url3);
    let tempIcon = await tempIconRaw.blob();
    let n = document.querySelector(".main-view img");
    n.src = URL.createObjectURL(tempIcon);
}

async function geticonCode(lat, lon) {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
    let locationResponseRaw = await fetch(url);
    let locationResponse = await locationResponseRaw.json();
    let iconCode = locationResponse.weather[0].icon;
    return iconCode;
}

async function getLocation(lat, lon) {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
    let locationResponseRaw = await fetch(url);
    let locationResponse = await locationResponseRaw.json();
    return locationResponse;
}

async function getWeatherAttributes(resp) {
    let x = await resp;
    city = x.name; // Set the global city variable
    feels_like = x.main.feels_like;
    humidity = x.main.humidity;
    pressure = x.main.pressure;
    temp = x.main.temp;
    temp_max = x.main.temp_max;
    temp_min = x.main.temp_min;
    wind_speed = x.wind.speed;
    cloudiness = x.clouds.all;
    visibility = x.visibility;
}

async function getWeatherInfo() {
    await getWeatherUnits(); // Fetch units first

    let cityName = getname();

    let url2 = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${key}`;
    let x = await fetch(url2);
    let y = await x.json();
    let lat = y[0].lat;
    let lon = y[0].lon;
    let url4 = `https://api.maptiler.com/maps/basic-v2/?key=fCMbVxiioLXNd94VGGoU#10/${lat}/${lon}`;

    document.querySelector("iframe").src = url4;

    let iconCode = await geticonCode(lat, lon);
    getmainIcon(iconCode);
    getWeatherAttributes(getLocation(lat, lon));

    setTimeout(() => {
        setAttributes();
    }, 500);
}

document.getElementById("search-btn").addEventListener("click", () => {
    getWeatherInfo();
});


document.addEventListener("DOMContentLoaded", () => {
    getWeatherInfo();
});
