const mongoose = require('mongoose')
const assert = require("node:assert")

if (![3, 5].includes(process.argv.length)) { // we need either 3 or 5 args
    console.log('wrong number of arguments')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://danny:${password}@fullstackcoursecluster.7vhinzg.mongodb.net/contacts?
    retryWrites=true&w=majority&appName=FullStackCourseCluster`


// mongoose.set('strictQuery', false) // looks like it is not needed currently

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema) // i really want it to be named contacts.


if (process.argv.length === 3) {
    Contact.find({}).then(result => {
        console.log("contacts:")
        result.forEach(contact => console.log(`${contact.name} ${contact.number}`))
        mongoose.connection.close()
    })
} else {
    console.assert(process.argv.length === 5)
    const [name, number] = process.argv.slice(3)
    const newContact = new Contact({name, number})
    newContact.save().then(_ => {
        console.log(`added ${name} with number ${number} to the phonebook`)
        mongoose.connection.close()
    })
}