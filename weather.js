// creates map

mapboxgl.accessToken = MAPBOX_API_TOKEN;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-98.4936, 29.4241],
    zoom: 10
});

// Add the control to the map.
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    })
);

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

//=============================================================

//convert API date?time new date (x * 1000);
function weather(lat, lon) {
    $.get('https://api.openweathermap.org/data/2.5/onecall', {
        appid: WEATHER_APP_ID,
        lat: lat,
        lon: lon,
        units: 'imperial',
        exclude: 'minutely,hourly'
    }).done(function (data) {

        console.log(data);

        // This function takes a number between 0 and 360 and returns a
// wind direction abbreviation. the MapBox API gives us a "wind degrees" datum
// this takes the "wind degrees" and converts it into a familiar abbreviation
        function windCardinalDirection(degrees) {
            let cardinalDirection = '';
            if ((degrees > 348.75 && degrees <= 360) || (degrees >= 0 && degrees <= 11.25)) {
                cardinalDirection = "N";
            } else if (degrees > 11.25 && degrees <= 33.75) {
                cardinalDirection = "NNE";
            } else if (degrees > 33.75 && degrees <= 56.25) {
                cardinalDirection = "NE";
            } else if (degrees > 56.25 && degrees <= 78.75) {
                cardinalDirection = "ENE";
            } else if (degrees > 78.75 && degrees <= 101.25) {
                cardinalDirection = "E";
            } else if (degrees > 101.25 && degrees <= 123.75) {
                cardinalDirection = "ESE";
            } else if (degrees > 123.75 && degrees <= 146.25) {
                cardinalDirection = "SE";
            } else if (degrees > 146.25 && degrees <= 168.75) {
                cardinalDirection = "SSE";
            } else if (degrees > 168.75 && degrees <= 191.25) {
                cardinalDirection = "S";
            } else if (degrees > 191.25 && degrees <= 213.75) {
                cardinalDirection = "SSW";
            } else if (degrees > 213.75 && degrees <= 236.25) {
                cardinalDirection = "SW";
            } else if (degrees > 236.25 && degrees <= 258.75) {
                cardinalDirection = "WSW";
            } else if (degrees > 258.75 && degrees <= 281.25) {
                cardinalDirection = "W";
            } else if (degrees > 281.25 && degrees <= 303.75) {
                cardinalDirection = "WNW";
            } else if (degrees > 303.75 && degrees <= 326.25) {
                cardinalDirection = "NW";
            } else if (degrees > 326.75 && degrees <= 348.75) {
                cardinalDirection = "NNW";
            }
            return cardinalDirection;
        }

        console.log(windCardinalDirection(data.daily[0].wind_deg));

        // this function appends leading zeroes, for example if you need a
// month in the format 08 instead of 8, or a time like 08:00 instead
// of 8:00
        function appendLeadingZeroes(n) {
            if (n <= 9) {
                return "0" + n;
            }
            return n;
        }

        data.daily.forEach(function (day, index) {
            if (index > 4) {
                return;
            }
            const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            let current_datetime = new Date(day.dt * 1000);
            let formatted_date = current_datetime.getDate() + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getFullYear();

            // let dynamicDay = new Date(data.daily[i].dt * 1000).toDateString()

            $("#card-section").append(`<article>
                <p>${formatted_date}</p>
                <p><img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"/></p>
                <p>${day.temp.min}°F / ${day.temp.max}°F</p><p class="list-group-item">Description: ${day.weather[0].description}</p>
                <p>Humidity: ${day.humidity}</p><p class="list-group-item">Wind: ${day.wind_speed} ${windCardinalDirection(day.wind_deg)}</p>
                <p>Pressure: ${day.pressure}</p>   
        </article>`);
        });

    }).fail(function (error) {
        console.log(error);
    });
}

weather(29.4252, -98.4916);