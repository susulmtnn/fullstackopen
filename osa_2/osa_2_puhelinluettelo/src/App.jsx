import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import personService from './services/person'
import './App.css'

const BetterError = ({ message, errorBoolean }) => {
  if (message === null) {
    return null
  }

  return <div className={errorBoolean ? 'error' : 'betterError'}>{message}</div>
}

const Person = (props) => (
<p>
  {props.person.name} {props.person.number} <button type="button" onClick={() => props.onDelete(props.person.id)}>delete</button>
</p>
)

const FilterForm = (props) => (
   <>
 <h2>Filter Form</h2>
 <form onSubmit={props.addSearch}>
        <div>
          search: <input value={props.newSearch} onChange={props.handleNewSearch} />
        </div>
         <div>
          <button type="submit">search</button>
        </div>
      </form>
      <div>
        <Persons persons={props.filteredPersons} onDelete={props.onDelete} />
      </div>
      </>
)

const Persons = (props) => (
  <div>
    {props.persons.map((person) => (
      <Person key={person.id} person={person} onDelete={props.onDelete} />
    ))}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([
    // { name: 'Arto Hellas', number: '040-123456', id:1 },
    // { name: 'Ada Lovelace', number: '39-44-5323523', id:2 },
    // { name: 'Dan Abramov', number: '12-43-234345' , id:3},
    // { name: 'Mary Poppendieck', number: '39-23-6423122', id:4 }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [newBetterError, setNewBetterError] = useState(null)
  const [errorBoolean, setErrorBoolean] = useState(false)

  
   useEffect(() => {
    // console.log('effect')
    // axios
    //   .get('http://localhost:3001/persons')
    //   .then(response => {
    //     console.log('promise fulfilled')
    //     setPersons(response.data)
    //   })
    personService
      .getAll()
        .then(initialPerson =>
          setPersons(initialPerson)
        )

  }, [])
  console.log('render', persons.length, 'persons')

  const handleNewPerson = (event) => {
    setNewName(event.target.value)
  }

    const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNewSearch= (e) =>{
    setNewSearch(e.target.value)
  }
  const deletePerson = (id) => { const person = persons.find(person => person.id === id)
  if (window.confirm(`Delete ${person.name}?`)) {
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        setErrorBoolean(false)
        setNewBetterError(`Deleted ${person.name}`)
        setTimeout(() => {
          setNewBetterError(null)
        }, 5000)
      })
      .catch(() => {
        setErrorBoolean(true)
        setNewBetterError(`Failed to delete ${person.name}`)
        setTimeout(() => {
          setNewBetterError(null)
        }, 5000)
      })
  }
  }

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(newSearch.toLowerCase())
  )

  const addSearch =(e) => {
    e.preventDefault()
    setNewSearch('')
  }


  const addPerson =(event) => {
    event.preventDefault()
    const personObject={
      name: newName,
      number: newNumber,
    }
    const personsList = persons.map((person) => person.name)
    if (personsList.includes(newName)){
      // update the person
      const existingPerson = persons.find(person => person.name === newName)

      if (window.confirm(`Replace the old number with a new one?`)) {
        const changedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(
              persons.map(person =>
                person.id !== existingPerson.id ? person : returnedPerson
              )
            )
            setErrorBoolean(false)
            setNewBetterError(`Updated ${returnedPerson.name}`)
            setTimeout(() => {
              setNewBetterError(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(() => {
            setErrorBoolean(true)
            setNewBetterError(`Failed to update ${existingPerson.name}`)
            setTimeout(() => {
              setNewBetterError(null)
            }, 5000)
          })
      }

      return
    }
    //aad new person
     if (personObject.name && personObject.number){
    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setErrorBoolean(false)
        setNewBetterError(`Added ${returnedPerson.name}`)
        setTimeout(() => {
          setNewBetterError(null)
        }, 5000)
        setNewName('')
        setNewNumber('')
      })
      .catch(() => {
        setErrorBoolean(true)
        setNewBetterError(`Failed to add ${personObject.name}`)
        setTimeout(() => {
          setNewBetterError(null)
        }, 5000)
      })

    // axios
    //   .post('http://localhost:3001/persons', personObject)
    //   .then(response => {
    //     setPersons(persons.concat(response.data))
    //     setNewName('')
    //     setNewNumber('')
    //   })
  } else {
    console.log("person could not be added, missing details")
  }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <BetterError message={newBetterError} errorBoolean={errorBoolean} />
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNewPerson} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNewNumber} />
        </div>
         <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>{persons.map(person =>
        <Person key={person.id} person={person} onDelete = {deletePerson}/>
        )}
      </div>
      <FilterForm
        addSearch={addSearch}
        newSearch={newSearch}
        handleNewSearch={handleNewSearch}
        filteredPersons={filteredPersons}
        onDelete={deletePerson}
        />
      </div>
      )

      }


export default App