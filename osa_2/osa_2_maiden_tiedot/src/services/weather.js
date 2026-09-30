import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY
// muuttujassa api_key on nyt käynnistyksessä annettu API-avaimen arvo

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const getWeather = (lat, lon) => {
  return axios.get(`${baseUrl}?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
    .then(response => response.data)
}



export default { getWeather : getWeather
                 }