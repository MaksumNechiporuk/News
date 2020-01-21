const indicator = document.querySelector(".nav-indicator");
const items = document.querySelectorAll(".nav-item");
let Country = document.querySelector(".Country");
let blockNews = document.querySelector(".News");
let Business = document.querySelector(".Business");
let Entertainment = document.querySelector(".Entertainment");
let Health = document.querySelector(".Health");
let Science = document.querySelector(".Science");
let Sports = document.querySelector(".Sports");
let Technology = document.querySelector(".Technology");
let btnSearch = document.querySelector(".btn");
Business.value = "business";
Entertainment.value = "entertainment";
Health.value = "health";
Science.value = "science";
Sports.value = "sports";
Technology.value = "technology";
btnSearch.addEventListener("click", initGoogleAPI);
document.querySelector(".city-search").value = "Rivne";
Business.addEventListener("click", changeCategory);
Entertainment.addEventListener("click", changeCategory);
Health.addEventListener("click", changeCategory);
Science.addEventListener("click", changeCategory);
Sports.addEventListener("click", changeCategory);
Technology.addEventListener("click", changeCategory);
let searchForm = document.querySelector(".searchForm");
searchForm.addEventListener("submit", initGoogleAPI);
let curentCountry = "ua";
let curentCategory = "business";
Request(curentCountry, curentCategory, ShowNews);

fillSelect();
function fillSelect() {
  let countries = [
    {
      country: "Ukraine",
      value: "ua"
    },
    {
      country: "United States",
      value: "us"
    },
    {
      country: "United Kingdom",
      value: "gb"
    },
    {
      country: "China",
      value: "cn"
    },
    {
      country: "Germany",
      value: "de"
    }
  ];

  Array.from(countries).map(country => {
    Country.options.add(new Option(country.country, country.value));
  });
  Country.addEventListener("change", changeCountry);
}
function changeCategory() {
  curentCategory = this.value;
  Request(curentCountry, curentCategory, ShowNews);
}
async function changeCountry() {
  curentCountry = this.value;
  Request(curentCountry, curentCategory, ShowNews);
}
async function Request(country, category, callback) {
  Preloader();

  const URL = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=93395f34a1bd41ea945fea1ef380ff4c`;
  console.log(URL);
  await fetch(URL, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      callback(data);
    })
    .catch(err => {
      console.log("Catch => ", err);
    });
}
async function ShowNews(data) {
  await RemoveChildren();

  let src;
  for (let i = 0; i < data.totalResults; i++) {
    let url = document.createElement("a");
    url.href = data.articles[i].url;
    let divInformation = document.createElement("div");

    divInformation.setAttribute("class", "blockNews row");
    if (data.articles[i].urlToImage) src = data.articles[i].urlToImage;
    else src = "https://pokrovsk.news/i/news.svg";

    let img = document.createElement("img");
    img.src = src;
    img.setAttribute("class", "newsImage");

    img.onerror = function() {
      this.src = "https://pokrovsk.news/i/news.svg";
    };

    divInformation.appendChild(img);
    let desc = document.createElement("div");
    desc.className = "newsArticle";
    desc.innerHTML = data.articles[i].description;
    divInformation.appendChild(desc);
    let date = document.createElement("span");
    date.className = "newsPublishedAt";
    date.innerHTML = data.articles[i].publishedAt;
    divInformation.appendChild(date);
    let author = document.createElement("span");
    author.className = "newsAuthor";
    author.innerHTML = data.articles[i].author;
    divInformation.appendChild(author);
    url.appendChild(divInformation);
    blockNews.appendChild(url);
  }
}
function RemoveChildren() {
  if (blockNews.children.length == 0) return;

  blockNews.removeChild(blockNews.lastChild);
  RemoveChildren();
}
function handleIndicator(el) {
  items.forEach(item => {
    item.classList.remove("is-active");
    item.removeAttribute("style");
  });

  indicator.style.width = `${el.offsetWidth}px`;
  indicator.style.left = `${el.offsetLeft}px`;
  indicator.style.backgroundColor = el.getAttribute("active-color");

  el.classList.add("is-active");
  el.style.color = el.getAttribute("active-color");
}

items.forEach((item, index) => {
  item.addEventListener("click", e => {
    handleIndicator(e.target);
  });
  item.classList.contains("is-active") && handleIndicator(item);
});
function Preloader() {
  let pr = document.querySelector(".load");
  if (pr == null) {
    let preloader = document.createElement("div");
    preloader.innerHTML = " <hr/><hr/><hr/><hr/>";
    preloader.setAttribute("class", "load");
    blockNews.append(preloader);
  }
}

function staggerFade() {
  setTimeout(function() {
    $(".fadein-stagger > *").each(function() {
      $(this).addClass("js-animated");
    });
  }, 30);
}

function skycons() {
  var i,
    icons = new Skycons({
      color: "#FFFFFF",
      resizeClear: true // nasty android hack
    }),
    list = [
      // listing of all possible icons
      "clear-day",
      "clear-night",
      "partly-cloudy-day",
      "partly-cloudy-night",
      "cloudy",
      "rain",
      "sleet",
      "snow",
      "wind",
      "fog"
    ];

  // loop thru icon list array
  for (i = list.length; i--; ) {
    var weatherType = list[i], // select each icon from list array
      // icons will have the name in the array above attached to the
      // canvas element as a class so let's hook into them.
      elements = document.getElementsByClassName(weatherType);

    // loop thru the elements now and set them up
    for (e = elements.length; e--; ) {
      icons.set(elements[e], weatherType);
    }
  }

  // animate the icons
  icons.play();
}

// =================================================
// Temperature Converter
// =================================================

// convert degrees to celsius
function fToC(fahrenheit) {
  var fTemp = fahrenheit,
    fToCel = ((fTemp - 32) * 5) / 9;

  return fToCel;
}

// =================================================
// Weather Reporter
// =================================================

function weatherReport(latitude, longitude) {
  // variables config for coordinates, url and api key
  // latitude and longitude are accepted arguments and passed
  // once a user has submitted the form.
  var apiKey = "2c1cd940ef8b447e75c73cd627e5159d",
    url = "https://api.darksky.net/forecast/",
    lati = latitude,
    longi = longitude,
    api_call =
      url + apiKey + "/" + lati + "," + longi + "?extend=hourly&callback=?";

  // Hold our days of the week for reference later.
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  // Hold hourly values for each day of the week.
  // This will store our 24 hour forecast results.
  var sunday = [],
    monday = [],
    tuesday = [],
    wednesday = [],
    thursday = [],
    friday = [],
    saturday = [];

  // Celsius button check. Is it toggled or not?
  var isCelsiusChecked = true;

  // Hourly report method to reference in our daily loop
  function hourlyReport(day, selector) {
    for (var i = 0, l = day.length; i < l; i++) {
      $("." + selector + " " + "ul").append(
        "<li>" + Math.round(day[i]) + "</li>"
      );
    }
  }

  // Call to the DarkSky API to retrieve JSON
  $.getJSON(api_call, function(forecast) {
    // Loop thru hourly forecasts
    for (var j = 0, k = forecast.hourly.data.length; j < k; j++) {
      var hourly_date = new Date(forecast.hourly.data[j].time * 1000),
        hourly_day = days[hourly_date.getDay()],
        hourly_temp = forecast.hourly.data[j].temperature;

      // If Celsius is checked then convert degrees to celsius
      // for general forecast report.
      if (isCelsiusChecked) {
        hourly_temp = fToC(hourly_temp);
        hourly_temp = Math.round(hourly_temp);
      }

      // push 24 hour forecast values to our empty days array
      switch (hourly_day) {
        case "Sunday":
          sunday.push(hourly_temp);
          break;
        case "Monday":
          monday.push(hourly_temp);
          break;
        case "Tuesday":
          tuesday.push(hourly_temp);
          break;
        case "Wednesday":
          wednesday.push(hourly_temp);
          break;
        case "Thursday":
          thursday.push(hourly_temp);
          break;
        case "Friday":
          friday.push(hourly_temp);
          break;
        case "Saturday":
          saturday.push(hourly_temp);
          break;
        default:
          console.log(hourly_date.toLocaleTimeString());
          break;
      }
    }

    // Loop thru daily forecasts
    for (var i = 0, l = forecast.daily.data.length; i < l - 1; i++) {
      var date = new Date(forecast.daily.data[i].time * 1000),
        day = days[date.getDay()],
        skicons = forecast.daily.data[i].icon,
        time = forecast.daily.data[i].time,
        humidity = forecast.daily.data[i].humidity,
        summary = forecast.daily.data[i].summary,
        temp = Math.round(forecast.hourly.data[i].temperature),
        tempMax = Math.round(forecast.daily.data[i].temperatureMax);

      // If Celsius is checked then convert degrees to celsius
      // for 24 hour forecast results
      if (isCelsiusChecked) {
        temp = fToC(temp);
        tempMax = fToC(tempMax);
        temp = Math.round(temp);
        tempMax = Math.round(tempMax);
      }

      // Append Markup for each Forecast of the 7 day week
      $("#forecast").append(
        '<li class="shade-' +
          skicons +
          '"><div class="card-container"><div><div class="front card"><div>' +
          "<div><b>Day</b>: " +
          date.toLocaleDateString() +
          "</div>" +
          "<div><b>Temperature</b>: " +
          temp +
          "</div>" +
          "<div><b>Max Temp.</b>: " +
          tempMax +
          "</div>" +
          "<div><b>Humidity</b>: " +
          humidity +
          "</div>" +
          '<p class="summary">' +
          summary +
          "</p>" +
          "</div></div>"
      );
      // $("#forecast").append(
      //   '<li class="shade-' +
      //     skicons +
      //     '"><div class="card-container"><div><div class="front card"><div>' +
      //     "<div class='graphic'><canvas class=" +
      //     skicons +
      //     "></canvas></div>" +
      //     "<div><b>Day</b>: " +
      //     date.toLocaleDateString() +
      //     "</div>" +
      //     "<div><b>Temperature</b>: " +
      //     temp +
      //     "</div>" +
      //     "<div><b>Max Temp.</b>: " +
      //     tempMax +
      //     "</div>" +
      //     "<div><b>Humidity</b>: " +
      //     humidity +
      //     "</div>" +
      //     '<p class="summary">' +
      //     summary +
      //     "</p>" +
      //     '</div></div><div class="back card">' +
      //     '<div class="hourly' +
      //     " " +
      //     day +
      //     '"><b>24hr Forecast</b><ul class="list-reset"></ul></div></div></div></div></li>'
      // );

      // Daily forecast report for each day of the week
      switch (day) {
        case "Sunday":
          hourlyReport(sunday, days[0]);
          break;
        case "Monday":
          hourlyReport(monday, days[1]);
          break;
        case "Tuesday":
          hourlyReport(tuesday, days[2]);
          break;
        case "Wednesday":
          hourlyReport(wednesday, days[3]);
          break;
        case "Thursday":
          hourlyReport(thursday, days[4]);
          break;
        case "Friday":
          hourlyReport(friday, days[5]);
          break;
        case "Saturday":
          hourlyReport(saturday, days[6]);
          break;
      }
    }

    skycons();
    staggerFade();
  });
}

function RemoveChildrenWeather() {
  let Weather = document.querySelector(".screen");
  if (Weather.children.length === 1) return;
  console.log(Weather.lastChild);
  if (Weather.lastChild.className != "form")
    Weather.removeChild(Weather.lastChild);
  RemoveChildrenWeather();
}

async function start(lat, long) {
  await RemoveChildrenWeather();

  let city_name = document.querySelector(".city-search").value;
  if (lat && long !== "") {
    $(".form").fadeOut(100, function() {
      weatherReport(lat, long);
      $(".screen").append(
        '<h3 class="city">' +
          city_name +
          '</h3><ul class="list-reset fadein-stagger" id="forecast"></ul>'
      );
    });
  }
}
let lat = 50.6199,
  lng = 26.251617;

function insertGoogleScript() {
  let map = document.querySelector(".map");
  if (map != null) document.body.removeChild(map);

  var google_api = document.createElement("script"),
    api_key = "AIzaSyCz0UhlW0qV80pB1DxqV6L3-mT0kNQ1gLg";
  google_api.setAttribute("class", "map");
  google_api.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyCz0UhlW0qV80pB1DxqV6L3-mT0kNQ1gLg&callback=initGoogleAPI&libraries=places,geometry";
  document.body.appendChild(google_api);
}

// SearchBox Method
async function initGoogleAPI() {
  var autocomplete = new google.maps.places.SearchBox(
    document.querySelector(".city-search")
  );
  console.log("Map");
  autocomplete.addListener("places_changed", function() {
    var place = autocomplete.getPlaces()[0];
    lat = place.geometry.location.lat();
    lng = place.geometry.location.lng();
  });
  start(lat, lng);
}

insertGoogleScript();
