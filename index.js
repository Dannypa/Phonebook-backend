require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
// app.use(express.static('dist'))
const morgan = require('morgan')

const getPostBody = (req) => {
    if (req['method'] === 'POST') {
        return JSON.stringify(req.body)
    } else {
        return ''
    }
}

app.use(morgan(function (tokens, req, res) {
    return [tokens.method(req, res), tokens.url(req, res), tokens.status(req, res), tokens.res(req, res, 'content-length'), '-', tokens['response-time'](req, res), 'ms', getPostBody(req)].join(' ')
}))

app.use(express.static('dist'))
const Contact = require('./models/contact')
require('express')

// i wanted to have "contacts", but fine. you win.
app.get('/api/persons', (request, response, next) => {
    Contact.find({}).then(contacts => response.json(contacts)).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    const rid = request.params.id
    Contact.findById(rid).then(contact => {
        if (contact) {
            response.json(contact)
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const name = request.body.name
    const number = request.body.number

    Contact.find({ name }).then(result => {
        if (result.length > 0) {
            return response.status(400).json({ error: 'names must be unique' })
        } else {
            const newId = Math.round(Math.random() * 1e9).toString() // lmao please work
            const newContact = new Contact({ id: newId, name, number })
            newContact.save().then(_ => response.json(newContact))
                .catch(error => next(error))
        }
    })
})


app.put('/api/persons/:id', (request, response, next) => {
    const name = request.body.name
    const number = request.body.number

    const rid = request.params.id
    Contact.findByIdAndUpdate(rid, { name, number }, { new: true, runValidators: true }).then(updated => {
        response.json(updated)
    }).catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
    const rid = request.params.id
    console.log(rid)
    Contact.findByIdAndDelete(rid).then(_ => {
        response.status(204).end()
    }).catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    Contact.find({}).then(result => {
        const page = `<div>
            <p>Phonebook has info about ${result.length} people.</p>
            <p>${Date()}</p>
        </div>`
        response.send(page)
    }).catch(error => next(error))
})

app.use((request, response) => response.status(404).send({ error: 'unknown endpoint' }))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'bad id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
