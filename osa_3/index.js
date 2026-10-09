const express = require('express')
const app = express()

let persons = [
    {
      "name": "Arto Hellas",
      "number": "393394934",
      "id": "1"
    },
    {
      "name": "Ada Lovelace",
      "number": "9293938",
      "id": "2"
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": "3"
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": "4"
    },
    {
      "name": "Arto Hellas ",
      "number": "1234",
      "id": "l3ztXHPLp3I"
    },
    {
      "name": "keffioejf",
      "number": "12234",
      "id": "PGlgXAl4RFM"
    }
]

app.use(express.json())


app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
    const calculated = persons.length
    let date = Date()

  response.send(`<p>Phonebook has info for ${calculated} people </p>
    <p>${date} </p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const matched_id = persons.find((matched_id) => matched_id.id ===id)

    if (matched_id) {
        response.json(matched_id)
    }
    else {
    response.status(404).end()
  }
    
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
    id: String(Math.random()),
  }

  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/delete/:id', (request, response)=>{
    const id = request.params.id
    const personExists = persons.find((personExists) => personExists.id === id)
    if (personExists){
        persons = persons.filter((person) => person.id !== id)
        response.status(204).end()
    }
    else
     {response.status(404).end()}
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})