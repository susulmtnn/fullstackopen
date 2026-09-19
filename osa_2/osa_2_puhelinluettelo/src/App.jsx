import { useState } from 'react'

const Person = (props) => (
<p>
  {props.person.name} {props.person.number}
</p>
)



const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas',
      id: 0
     }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNewPerson = (event) => {
    setNewName(event.target.value)
  }

    const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
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
    </div>
  )

}

export default App