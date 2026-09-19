import { useState } from 'react'

const Person = (props) => (
<p>
  {props.person.name}
</p>
)



const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas'
     }
  ]) 
  const [newName, setNewName] = useState('')

  const handleNewPerson = (event) => {
    setNewName(event.target.value)
  }

  const addPerson =(event) => {
    event.preventDefault()
    const personObject={
      name: newName,
      id: String(persons.length+1),
    }

    setPersons(persons.concat(personObject))
    setNewName('')

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNewPerson} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>{persons.map(person =>
        <Person key={person.name} person={person}/>
        )}
        </div>
    </div>
  )

}

export default App