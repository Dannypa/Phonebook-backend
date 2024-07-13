const express = require('express')
const app = express()
app.use(express.json())

let contacts = [{
    "id": "1", "name": "Arto Hellas", "number": "040-123456"
}, {
    "id": "2", "name": "Ada Lovelace", "number": "39-44-5323523"
}, {
    "id": "3", "name": "Dan Abramov", "number": "12-43-234345"
}, {
    "id": "4", "name": "Mary Poppendieck", "number": "39-23-6423122"
}]

// i wanted to have "contacts", but fine. you win.
app.get('/api/persons', (request, response) => {
    response.json(contacts)
})

app.get('/api/persons/:id', (request, response) => {
    const rid = request.params.id
    const contact = contacts.find(p => p.id === rid)

    if (contact) {
        response.json(contact)
    } else {
        response.status(400).end()
    }
})

app.post('/api/persons', (request, response) => {
    const name = request.body.name
    const number = request.body.number

    if (!name) {
        return response.status(400).json({error: "name is missing"})
    }

    if (!number) {
        return response.status(400).json({error: "number is missing"})
    }

    if (contacts.find(p => p.name === name)) {
        return response.status(400).json({error: "names must be unique"})
    }

    const newId = Math.round(Math.random() * 1e9).toString() // lmao please work
    contacts.push({id: newId, name, number})

    response.status(400).end()
})


app.delete('/api/persons/:id', (request, response) => {
    const rid = request.params.id
    contacts = contacts.filter(p => p.id !== rid) // not optimal generally but in our case the best we can do

    response.status(204).end()
})

app.get('/info', (request, response) => {
    const page = `<div>
        <p>Phonebook has info about ${contacts.length} people.</p>
        <p>${Date()}</p>
    </div>`
    response.send(page)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
