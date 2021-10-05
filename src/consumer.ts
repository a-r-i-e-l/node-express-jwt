import express, {json} from 'express'
import fetch from 'node-fetch'
import * as jwt from 'jsonwebtoken'
import * as crypto from 'crypto'
import {stringifySort} from './utils'

const SECRET_KEY = 'secretKey'

export const consumerApp = express()

consumerApp.get('/', async (req, res) => {
  const payload = {
    data: 'Ariel',
    foo: 'bar',
  }

  const body = JSON.stringify(payload, stringifySort)

  const hash = crypto.createHash('sha1').update(body).digest('hex')

  const token = jwt.sign({hash}, SECRET_KEY, {expiresIn: '5s'})

  const test = await fetch('http://localhost:3003/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body,
  })
  // res.json(await test.json())
  res.send('<pre><code>' + JSON.stringify(await test.json(), null, 4) + '</code></pre>')
})
