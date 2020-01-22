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
  await fetch(URL, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      callback(data);
      console.log(URL);
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

    divInformation.setAttribute("class", "blockNews grid-item");
    if (data.articles[i].urlToImage) src = data.articles[i].urlToImage;

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
  let preloader = document.createElement("div");
  preloader.innerHTML = " <hr/><hr/><hr/><hr/>";
  preloader.setAttribute("class", "load");
  blockNews.append(preloader);
  console.log("load");
}

function staggerFade() {
  setTimeout(function() {
    $(".fadein-stagger > *").each(function() {
      $(this).addClass("js-animated");
    });
  }, 30);
}

function fToC(fahrenheit) {
  var fTemp = fahrenheit,
    fToCel = ((fTemp - 32) * 5) / 9;

  return fToCel;
}

function weatherReport(latitude, longitude) {
  var apiKey = "2c1cd940ef8b447e75c73cd627e5159d",
    url = "https://api.darksky.net/forecast/",
    lati = latitude,
    longi = longitude,
    api_call =
      url + apiKey + "/" + lati + "," + longi + "?extend=hourly&callback=?";

  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  var sunday = [],
    monday = [],
    tuesday = [],
    wednesday = [],
    thursday = [],
    friday = [],
    saturday = [];
  function hourlyReport(day, selector) {
    for (var i = 0, l = day.length; i < l; i++) {
      $("." + selector + " " + "ul").append(
        "<li>" + Math.round(day[i]) + "</li>"
      );
    }
  }
  $.getJSON(api_call, function(forecast) {
    for (var j = 0, k = forecast.hourly.data.length; j < k; j++) {
      var hourly_date = new Date(forecast.hourly.data[j].time * 1000),
        hourly_day = days[hourly_date.getDay()],
        hourly_temp = forecast.hourly.data[j].temperature;

      hourly_temp = fToC(hourly_temp);
      hourly_temp = Math.round(hourly_temp);

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

    for (var i = 0, l = forecast.daily.data.length; i < l - 1; i++) {
      var date = new Date(forecast.daily.data[i].time * 1000),
        day = days[date.getDay()],
        skicons = forecast.daily.data[i].icon,
        time = forecast.daily.data[i].time,
        humidity = forecast.daily.data[i].humidity,
        summary = forecast.daily.data[i].summary,
        temp = Math.round(forecast.hourly.data[i].temperature),
        tempMax = Math.round(forecast.daily.data[i].temperatureMax);
      temp = fToC(temp);
      tempMax = fToC(tempMax);
      temp = Math.round(temp);
      tempMax = Math.round(tempMax);

      $(".forecast").addClass("grid");
      $(".forecast").append(
        '<li class=" grid-item shade-' +
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
          '</h3><ul class="list-reset fadein-stagger forecast" ></ul>'
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
$(".grid").masonry({
  itemSelector: ".grid-item",
  columnWidth: 160
});
