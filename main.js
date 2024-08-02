const d = document;
const $main = d.querySelector; /*("main");

const mqLarge  = window.matchMedia( '(min-width: 800px)' );



function mqHandler(e) {
   console.log(e.matches ? 'large' : 'not large');  
  if (e.matches) {
    $main.innerHTML = `
      
    `;
  } else {
    $main.innerHTML = `<h1> Version Mobile</h1  >`;
  }
 
}*/

/*
mqLarge.addEventListener('change', mqHandler);
d.addEventListener("DOMContentLoaded", e => mqHandler(mqLarge));*/

const getDate = (timezone, lat, lon) => {
  let date = new Date();
  fetch(
    `http://worldtimeapi.org/api/timezone/${timezone}?lat=${lat}&lng=${lon}`
  )
    .then((res) => res.json())
    .then((data) => (date = new Date(data.datetime)));

  const options = { month: "long", day: "numeric", year: "numeric" };
  let fullDate = date.toLocaleDateString("es-ES", options);

  const dayOption = { weekday: "long" };
  let dayDate = date.toLocaleDateString("es-ES", dayOption);
  dayDate = dayDate.charAt(0).toUpperCase() + dayDate.slice(1);

  return {
    fullDate,
    dayDate,
  };
};

const $weatherData = d.querySelector(".weather-data");
const $weatherDate = d.querySelector(".weather-date");
const $templateNextWheather = d.getElementById(
  "template-next-wheather"
).content;
const $nextWheather = d.querySelector(".next-wheather");
const $fragment = d.createDocumentFragment();

const apiKey = `52e15649f4f849388022ebdf377a9d10`;
d.addEventListener("DOMContentLoaded", (e) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let lon = position.coords.longitude;
      let lat = position.coords.latitude;

      let url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=5&key=${apiKey}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          const date = getDate(data.timezone, data.lat, data.lon);
          console.log(date);
          $weatherDate.querySelector(".weather-date h1").innerHTML =
            date.dayDate;
          $weatherDate.querySelector(".weather-date small").innerHTML =
            date.fullDate;
          $weatherData.querySelector(".location p").innerHTML = data.city_name;
          $weatherData.querySelector(".degrees h1").innerHTML = `${parseInt(
            data.data[0].temp
          )}°C`;
          $weatherData.querySelector(".degrees p").innerHTML = `${parseInt(
            data.data[0].max_temp
          )}°C / ${parseInt(data.data[0].min_temp)}°C`;

          const weekdays = data.data.filter((_, index) => index !== 0);
          console.log(weekdays);

          weekdays.forEach((el) => {
            let dayDate = new Date(el.valid_date).toLocaleDateString("es-ES", {
              weekday: "long",
            });
            dayDate = dayDate.charAt(0).toUpperCase() + dayDate.slice(1, 3);

            console.log(dayDate, el.max_temp, el.min_temp);

            $templateNextWheather.querySelector("img").src =
              "./assets/cloudy-day-2.svg";
            $templateNextWheather.querySelector(".day").innerHTML = dayDate;
            $templateNextWheather.querySelector(
              ".degrees"
            ).innerHTML = `${parseInt(el.max_temp)}°C / ${parseInt(
              el.min_temp
            )}°C`;

            let $clone = d.importNode($templateNextWheather, true);
            $fragment.appendChild($clone);
          });
          $nextWheather.innerHTML = "";
          $nextWheather.appendChild($fragment);
        });
    });
  }
});
