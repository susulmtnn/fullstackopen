import { useState } from 'react'
import { useEffect } from 'react'
import countryService from './services/country'
import weatherService from './services/weather'
import './App.css'

const CountriesForm = (props) => (
   <>
 <form onSubmit={props.addSearch}>
        <div>
          Find Countries <input value={props.newSearch} onChange={props.handleNewSearch} />
        </div>
      </form>
      </>
)

const Country = (props) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const [latitude, longitude] = props.country.latlng

    weatherService
      .getWeather(latitude, longitude)
      .then(weatherData => setWeather(weatherData))
  }, [props.country])

  const showWeather = () => {
    if (!weather) {
      return null
    }

    const temperature = weather.main.temp
    const weatherIcon = weather.weather[0].icon
    const weatherDescription = weather.weather[0].description

    return (
      <div>
        <p>Temperature {temperature} °C</p>
        <img
          src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
          alt={weatherDescription}
        />
        <p>weather {weatherDescription}</p>
      </div>
    )
  }

  return (
    <div>
      <h2>{props.country.name.common}</h2>
      <p>capital {props.country.capital?.join(', ')}</p>
      <p>area {props.country.area}</p>
      <h3>languages</h3>
      <ul>
        {Object.values(props.country.languages ?? {}).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={props.country.flags.png} width="150" />
      {showWeather()}
    </div>
  )
}


const App = () => {

  const [countries, setCountries] = useState([])
  const [newSearch, setNewSearch] = useState('')


   useEffect(() => {
    // console.log('effect')
    // axios
    //   .get('http://localhost:3001/persons')
    //   .then(response => {
    //     console.log('promise fulfilled')
    //     setPersons(response.data)
    //   })
    countryService
      .getAll()
        .then(initialCountry =>
          setCountries(initialCountry)
        )

  }, [])


   const handleNewSearch= (e) =>{
    setNewSearch(e.target.value)
    setSelectedCountry(null)
  }

   const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(newSearch.toLowerCase())
  )

  const addSearch =(e) => {
    e.preventDefault()
    setNewSearch('')
    setSelectedCountry(null)
  }
  
const [selectedCountry, setSelectedCountry] = useState(null)

const showCountry = (country) => {
  setSelectedCountry(country)
}


  const showCountries = () => {
    if (selectedCountry) {
      return <Country country={selectedCountry} />
    }

    if (filteredCountries.length > 10) {
      return <p>Too many matches, specify another filter </p>
    }

    if (filteredCountries.length === 1) {
      return <Country country={filteredCountries[0]} />
    }

    return filteredCountries.map(country => (
      <p key={country.name.common}>{country.name.common} <button onClick={() => showCountry(country)}>show</button></p>
    ))
  }


  return (
    <div>
      <CountriesForm
        newSearch={newSearch}
        handleNewSearch={handleNewSearch}
        addSearch={addSearch}
      />
      {showCountries()}
    </div>
  )
}

export default App