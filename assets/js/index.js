const apikey = 'f92b209bc59ca78b321b21929b2c998e'
const url = 'https://api.openweathermap.org/data/2.5/';
var cities=[]

$('#findWeather').on('click', function(){
    var cityName = $('#cityName').val();
    cities.push(cityName)
    cityFind(cityName)
    saveCitySearch()
})

function cityFind(cityName){

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&APPID=" + apikey;

    $.ajax({
        url:queryURL,
        method: 'GET'
    }).then(function(response){
        console.log(response)
        $('#cityTitle').html("<span class='cityName'>" + response.name + " " +(moment().format('L')) + "</span>");
        
        var icon = $('<img>')
        var weatherIcon = response.weather[0].icon;
        icon.attr('src', `http://openweathermap.org/img/w/${weatherIcon}.png`)
        $('#openWeatherIcon').html(icon)
        $('#currentTemp').html("<span class='currentTemp'> Current Temperature: " + response.main.temp +"</span>");
        $('#currentMin').html("<span class='minTemp'> Low: " + Math.floor(response.main.temp_min) +"</span>");
        $('#currentMax').html("<span class='maxTemp'> High: " + Math.floor(response.main.temp_max) +"</span>");
        $('#currentHumidity').html("<span class='currentHumidity'> Humidity: " + response.main.humidity +"% </span>");
        $('#currentWindspeed').html("<span class='currentWindspeed'> Windspeed: " + response.wind.speed +" mph </span>");
        $('#currentUV').html("<span class='currentTemp'> Current Temperature: " + response.main.temp +"</span>");
    
        inputUV(response);


        var queryURL5Day = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=imperial&APPID=' + apikey;

        $.ajax({
            url: queryURL5Day,
            method: 'GET'
        }).then(function(data){

            console.log(data)
            $('#5DayForecast').empty();

            for( i = 5; i < 40; i += 8){
                var fiveDaySpace = $('<div>').addClass('card card-color');
                var date5Day = $('<h7>').text(moment.unix(data.list[i].dt).format('MM/DD/YYYY'));
                var icon5day = $('<img>').attr('src', `http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`)
                icon5day.attr('width', 75)
                var temp5Day = $('<h7>').text('Temp: ' + Math.floor(data.list[i].main.temp) + ' °F');
                var humidity5Day = $('<h7>').text('Humidity: ' + data.list[i].main.humidity+ '%')
                fiveDaySpace.append(date5Day, icon5day, temp5Day, humidity5Day)
                $('#5DayForecast').append(fiveDaySpace)
            }
        })
})   
}

function inputUV(response) {
    // takes latitude and longitude from previous funciton and inputs into  this function
    cityLocation = `lat=${parseInt(response.coord.lat)}&lon=${parseInt(response.coord.lon)}`;
  
    // set queryURL based on type of query
    requestType = 'uvi';
    query = `?${cityLocation}&appid=f92b209bc59ca78b321b21929b2c998e`;
    queryURL = `${url}${requestType}${query}`;
  
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function (response) {
      var background = "violet";
  
      var uv = parseFloat(response.value)
  
      if (uv < 3) {
        background = 'green';
      } else if (uv < 6) {
        background = 'yellow'
      } else if (uv < 8) {
        background = 'orange'
      } else if (uv < 11) {
        background = 'red';
      }
  
      let title = '<span>UV Index: </span>';
      let color = title + `<span style="background-color:${background}; padding: 0 0px 0 0px;">${response.value}</span>`;
  
      $('#currentUV').html(color);
    })
}

function saveCitySearch (){
    $('#previousCities').empty();

    for(i=0; i < cities.length; i++){
        var cityList = $('<li>');
        cityList.addClass('list-group-item city');
        cityList.attr('data-city', cities[i]);
        cityList.text(cities[i])
        $('#previousCities').append(cityList);

        localStorage.setItem('city-name', JSON.stringify(cities))
    }
}
$(document).on('click', '.city', function(){
    var cityInput = $(this).attr('data-city');
    console.log(cityInput)
    cityFind(cityInput)
})
$(document).ready(function(){
    cities  = JSON.parse(localStorage.getItem('city-name'));
    if(cities === null){
        cities = []
    }
    saveCitySearch()
})