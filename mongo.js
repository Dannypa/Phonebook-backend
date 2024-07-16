require('dotenv').config()
const mongoose = require('mongoose')
const assert = require("node:assert")

if (![2, 4].includes(process.argv.length)) { // we need either 2 or 4 args
    console.log('wrong number of arguments')
    process.exit(1)
}


const uri = process.env.MONGODB_URI

// mongoose.set('strictQuery', false) // looks like it is not needed currently

mongoose.connect(uri)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema) // i really want it to be named contacts.


if (process.argv.length === 2) {
    Contact.find({}).then(result => {
        console.log("contacts:")
        result.forEach(contact => console.log(`${contact.name} ${contact.number}`))
        mongoose.connection.close()
    })
} else {
    console.assert(process.argv.length === 4)
    const [name, number] = process.argv.slice(2)
    const newContact = new Contact({name, number})
    newContact.save().then(_ => {
        console.log(`added ${name} with number ${number} to the phonebook`)
        mongoose.connection.close()
    })
}