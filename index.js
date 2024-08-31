const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())
const cors = require('cors')


let persons = 
[
  {
    "id" : "1",
    "name" : "Arto Hellas",
    "number" : "040-123456"
  },
  {
    "id" : "2",
    "name" : "Ada Lovelace",
    "number" : "39-44-5323523"
  },
  {
    "id" : "3",
    "name" : "Dan Abramov",
    "number" : "12-43-234345"
  },
  {
    "id" : "4",
    "name" : "Mary Poppendiek",
    "number" : "39-23-6423122"
  }

]
app.use(cors())
// Custom token for logging request body
morgan.token('body', (req, res) => JSON.stringify(res.body))

// Use morgan with custom format
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/', (request, response) => {
  response.send('<h1>Welcome to Phonebook</h1>')
})
app.get('/api/persons', (request, response) => {
  response.json(persons)
})
app.get('/api/info', (request, response) => {
  let people = persons.length
  response.send(`<p>Phonebook has info for ${people} people
    <br><br>${Date()}</p>`)
})
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).json({
      error: 'Person not found'
    })
  }
})
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})
const generatedId = () => {
  //generate a random number and convert it to base 36 string
  const randomPart = Math.random().toString(36).substring(2);
  //Get the current timestamp in milliseconds
  const timestamp = Date.now().toString(36);
  //combine the rando part and the timestamp
  const uniqueId = randomPart + timestamp;

  return uniqueId;

}
app.post('/api/persons', (request, response) => {
  const body = request.body
  
  //Validate if name and number are provided
  if (!body.name || !body.number ) {
    return response.status(400).json({
      error: "name and number are required"
    })
  }
  //Check for existing name 
  const existingPerson = persons.find(person => person.name === body.name);
  console.log(existingPerson)
  if (existingPerson) {
    return response.status(409).json({
      error: "name must be unique"
    });
  }
  
  const person = {
    name: body.name,
    number : String(body.number),//ensure the number is a string
    id: generatedId()
  }
  persons = persons.concat(person)
  response.json(person)
})
// Error handling middleware

app.use((request, response) => {
  response.status(404).json({ error: 'Unknown endpoint'})
})
const PORT = 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})