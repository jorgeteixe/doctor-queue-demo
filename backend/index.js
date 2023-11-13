const { createClient } = require('redis')
const express = require('express')
const cors = require('cors')
const { faker } = require('@faker-js/faker')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const redis = createClient();

redis.on('connect', () => {
    console.log('redis connected')
})

app.use(bodyParser.json())
app.use(cors())

app.get('/appointments', async (req, res) => {
    let appointments = await redis.get('appointments')
    if (appointments) {
        appointments = JSON.parse(appointments)
    } else {
        appointments = []
    }
    res.json(appointments)
})

app.post('/appointments', async (req, res) => {
    let appointments = await redis.get('appointments')
    if (appointments) {
        appointments = JSON.parse(appointments)
    } else {
        appointments = []
    }
    const newAppointment = {
        id: faker.string.uuid().substring(0, 4).toUpperCase(),
        name: faker.person.fullName(),
        type: ['General check', 'Cardiology check', 'Cardiology revision', 'Pre-surgery check'][Math.floor(Math.random()*4)]
    }
    appointments.push(newAppointment)
    await redis.set('appointments', JSON.stringify(appointments))
    res.json(newAppointment)
})

app.get('/calls', (req, res) => {
  res.send('Hello World!')
})

app.post('/calls', (req, res) => {
  res.send('Hello World!')
})

app.post('/calls/remind', (req, res) => {
  res.send('Hello World!')
})

app.post('/calls/arrived', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, async () => {
  await redis.connect();
  console.log(`Doctor queue app demo listening on port ${port}`)
})
