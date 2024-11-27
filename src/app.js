const express = require('express')
const mongoose = require('mongoose')
const bookRoutes = require('./routes/book.routes')
const bodyParser = require('body-parser')
const { config } = require('dotenv')

config()
const port = process.env.PORT || 3000

const app = express()
app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME })
const db = mongoose.connection

app.use('/books', bookRoutes)
app.listen(port, () => {
    console.log(`Puerto ${3000}`)
})