const mongoose = require('mongoose')
const assert = require("node:assert")
require("dotenv").config()

const uri = process.env.MONGODB_URI
// mongoose.set('strictQuery', false) // looks like it is not needed in the current version of mongoose

console.log(`connecting to ${uri}...`)
mongoose.connect(uri)
    .then(result => {
        console.log('Successfully connected to the database!')
    }).catch(error => {
        console.log(`Error when connecting to the db: ${error.message}`)
    })

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

// i really want it to be named contacts.
module.exports = mongoose.model('Contact', contactSchema)