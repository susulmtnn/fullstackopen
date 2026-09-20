import { useState } from 'react'

const Person = (props) => (
<p>
  {props.person.name} {props.person.number}
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
        {props.filteredPersons.map((person) => (
  <Person key={person.id} person={person} />
))}
      </div>
      </>
)



const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id:1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id:2 },
    { name: 'Dan Abramov', number: '12-43-234345' , id:3},
    { name: 'Mary Poppendieck', number: '39-23-6423122', id:4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')

  const handleNewPerson = (event) => {
    setNewName(event.target.value)
  }

    const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNewSearch= (e) =>{
    setNewSearch(e.target.value)
  }

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(newSearch.toLowerCase())
  )

  const addSearch =(e) => {
    e.preventDefault()
  }


  const addPerson =(event) => {
    event.preventDefault()
    const personObject={
      name: newName,
      number: newNumber,
      id: String(persons.length+1),
    }
    const personsList = persons.map((person) => person.name)
    if (personsList.includes(newName)){
      alert(`${newName} is already added to phonebook`)
      return
    }
    if (personObject.name && personObject.number)
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')

  }


  return (
    <div>
      <h2>Phonebook</h2>
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
        <Person key={person.id} person={person}/>
        )}
      </div>
      <FilterForm
        addSearch={addSearch}
        newSearch={newSearch}
        handleNewSearch={handleNewSearch}
        filteredPersons={filteredPersons}
        />
      </div>
      )

      }


export default App