require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
const morgan = require('morgan')

const getPostBody = (req) => {
    if (req["method"] === "POST") {
        return JSON.stringify(req.body)
    } else {
        return ''
    }
}

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        getPostBody(req)
    ].join(' ')
}))

app.use(express.static('dist'))
const Contact = require('./models/contact')


// let contacts = [{
//     "id": "1", "name": "Arto Hellas", "number": "040-123456"
// }, {
//     "id": "2", "name": "Ada Lovelace", "number": "39-44-5323523"
// }, {
//     "id": "3", "name": "Dan Abramov", "number": "12-43-234345"
// }, {
//     "id": "4", "name": "Mary Poppendieck", "number": "39-23-6423122"
// }]

// i wanted to have "contacts", but fine. you win.
app.get('/api/persons', (request, response) => {
    Contact.find({}).then(contacts => response.json(contacts))
})

app.get('/api/persons/:id', (request, response) => {
    const rid = request.params.id
    Contact.findById(rid).then(contact => {
        if (contact) {
            response.json(contact)
        } else {
            response.status(400).end()
        }
    })
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

    Contact.find({name}).then(result => {
        if (result.length > 0) {
            return response.status(400).json({error: "names must be unique"})
        } else {
            const newId = Math.round(Math.random() * 1e9).toString() // lmao please work
            const newContact = new Contact({id: newId, name, number})
            newContact.save().then(_ => response.json(newContact))
        }
    })
})


app.delete('/api/persons/:id', (request, response) => {
    const rid = request.params.id
    console.log(rid)
    Contact.findByIdAndDelete(rid).then(_ => {
        response.status(204).end()
    })
})

app.get('/info', (request, response) => {
    Contact.find({}).then(result => {
        const page = `<div>
            <p>Phonebook has info about ${result.length} people.</p>
            <p>${Date()}</p>
        </div>`
        response.send(page)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
