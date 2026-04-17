

const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const path = require('path')

const persons = require('./persons')
const size = persons.length
const today = new Date()



app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



app.get('/', (req,res) => {
    res.send('Hello world')
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})

app.get('/api/persons', (req,res) => {
    res.json(persons)
})

app.get('/info', (req,res) => {
    console.log(today)
    res.send(`Phonebook has info for ${size} people<br>${today}`)
})


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    }
    else {
        response.status(404).end()
    }
  })


app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    
    const person = persons.find(person => person.id === id)
    if(person){
        res.status(204).end()
    }
    else{
        res.status(404).end()
        
    }
  })



  app.post('/api/persons', (req,res) => {

    const body = req.body

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    const nameExists = persons.some(p => p.name === body.name)

    if (nameExists) {
        return res.status(400).json({ error: 'name must be unique' })
    }
    
    const nameOrNumberMissing = (!body.name || !body.number)

    if(nameOrNumberMissing){
        return res.status(400).json({ error: 'name or number empty'})
    }

    persons.push(newPerson)

    res.json(newPerson)
    

  })

  const generateId = () => {
    return Math.floor(Math.random() * 1000000)
  }