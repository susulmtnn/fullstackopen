import { useState } from 'react'
import { useEffect } from 'react'
import countryService from './services/country'
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

const Country = (props) => (
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
  </div>
)


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
  console.log('render', countries.length, 'countries')


   const handleNewSearch= (e) =>{
    setNewSearch(e.target.value)
  }

   const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(newSearch.toLowerCase())
  )

  const addSearch =(e) => {
    e.preventDefault()
    setNewSearch('')
  }

  const showCountries = () => {
    if (filteredCountries.length > 10) {
      return <p>Too many matches, specify another filter</p>
    }

    if (filteredCountries.length === 1) {
      return <Country country={filteredCountries[0]} />
    }

    return filteredCountries.map(country => (
      <p key={country.name.common}>{country.name.common}</p>
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