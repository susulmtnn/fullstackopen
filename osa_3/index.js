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


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})