const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')

app.use(express.json());
app.use(express.static('build'))

app.use(morgan('tiny'));
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body :req[content-length]'));

app.use(cors())

let persons = [
    { id: 1,
      name: "Arto Hellas", 
      number: "040-123456" 
    },
    { 
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-535954"
    }, 
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-32-5678" 
    },
    { 
      id: 4,
      name: "Dan Abramov", 
      number: "12-32-5678" 
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

app.get('/info', (req,res) => {
    const count = Object.keys(persons).length;
    console.log("assadas", count);
    const time = new Date();
    res.send(`Phonebook has info of ${count} people.<br/><br/>${time}`);

})
  
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {    
        response.json(person)  
    } else {    
        response.status(404).end()  
    }
})
  
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const generateId = () => {
    const randomId = Math.floor(Math.random() * (5000 - 5) + 5);
    return randomId
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    if (persons.map(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
      }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})