import express, {json} from 'express'
import fetch from 'node-fetch'
import * as jwt from 'jsonwebtoken'

const SECRET_KEY = 'secretKey'

export const consumerApp = express()

consumerApp.get('/test1', async (req, res) => {
  const test = await fetch('https://api.thecatapi.com/v1/images/search?breed_id=beng', {
    method: 'GET',
  })
  // res.json(await test.json())
  res.send('<pre><code>' + JSON.stringify(await test.json(), null, 4) + '</code></pre>')
})

consumerApp.get('/test2', async (req, res) => {
  const test = await fetch('http://localhost:3003/test', {
    method: 'GET',
  })
  // res.json(await test.json())
  res.send('<pre><code>' + JSON.stringify(await test.json(), null, 4) + '</code></pre>')
})

consumerApp.get('/', async (req, res) => {
  const payload = {
    data: 'Ariel',
  }
  const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '5s'})
  console.log({token})

  const test = await fetch('http://localhost:3003/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  // res.json(await test.json())
  res.send('<pre><code>' + JSON.stringify(await test.json(), null, 4) + '</code></pre>')
})
