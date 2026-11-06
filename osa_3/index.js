require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

// app.use(morgan('tiny'))

morgan.token('posttoken', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan('method :url :status :response-time ms :posttoken'));

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())



app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(calculated => {
      const date = Date()

      response.send(`
        <p>Phonebook has info for ${calculated} people</p>
        <p>${date}</p>
      `)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        person.name = name
        person.number = number
        return person.save()
      } else {
        response.status(404).end()
        return null
      }
    })
    .then(updatedPerson => {
      if (updatedPerson != null) {
        response.json(updatedPerson)
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'person name missing' })
  }

  if (!body.number) {
    return response.status(400).json({ error: 'person number missing' })
  }

  const person =  new Person({
    name: body.name,
    number: body.number,
    //id: String(Math.random()),
})

person.save().then(savedPerson => {
  response.json(savedPerson)
})
  .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next)=>{
    Person.findByIdAndDelete(request.params.id)
      .then(result =>(
        response.status(204).end()
      ))
      .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {return response.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)

// const PORT = 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
