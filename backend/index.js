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

const get = async (key) => {
    let data = await redis.get(key)
    if (data) {
        data = JSON.parse(data)
    } else {
        data = []
    }
    return data
}

const add = async (key, newElem) => {
    const data = await get(key)
    await redis.set(key, JSON.stringify([...data, newElem]))
}

const del = async (key, code) => {
    const data = await get(key)
    await redis.set(key, JSON.stringify(data.filter((v) => v.code !== code)))
}

const getAppointments = async () => { return get('appointments') }
const addAppointment = async (newAppointment) => { add('appointments', newAppointment) }
const delAppointment = async (code) => { del('appointments', code) }

const getCalls = async () => { return get('calls') }
const addCall = async (newCall) => { add('calls', newCall) }
const arrivedCall = async (code) => {
    const calls = await get('calls')
    const call = calls.find((v) => v.code === code)
    call.arrived = true
    await redis.set('calls', JSON.stringify(calls))
}

app.get('/appointments', async (req, res) => {
    const appointments = await getAppointments()
    res.json(appointments)
})

app.post('/appointments', async (req, res) => {
    const door = Math.floor(Math.random()*4)
    const newAppointment = {
        code: faker.string.uuid().substring(0, 4).toUpperCase(),
        name: faker.person.fullName(),
        type: ['General check', 'Cardiology check', 'Cardiology revision', 'Pre-surgery check'][door],
        door
    }
    await addAppointment(newAppointment)
    res.json(newAppointment)
})

app.get('/calls', async (req, res) => {
    const calls = await getCalls()
    res.json(calls)
})

app.post('/calls', async (req, res) => {
    const code = req.body.code
    const appointments = await getAppointments()
    delAppointment(code)
    const appointment = appointments.find((v) => v.code === code)
    addCall({
        code: appointment.code,
        door: appointment.door,
        arrived: false,
    })
    res.sendStatus(200)
})

app.post('/calls/:code/remind', (req, res) => {
  res.send('Hello World!')
})

app.post('/calls/:code/arrived', async (req, res) => {
    await arrivedCall(req.params.code)
})

app.listen(port, async () => {
  await redis.connect();
  console.log(`Doctor queue app demo listening on port ${port}`)
})
