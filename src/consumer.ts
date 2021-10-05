import express from 'express'
import fetch from 'node-fetch'
import * as jwt from 'jsonwebtoken'
import * as crypto from 'crypto'
import {stringifySort} from './utils'

const PRIVATE_KEY = [
  '-----BEGIN RSA PRIVATE KEY-----',
  'MIIBOgIBAAJBAKxkzOrZub0Uyz12vTklnjWMLjxRigxnr7yKGQoOPMqqdfkKIdZF',
  '4u+Q9Jj6VUWGqUfw9lFwDuYdBguYGEb7Fx8CAwEAAQJAR6Fun9qt2YntVPGkeD1Q',
  'OpGvmHKM+NCQbbe35by6t75jtzhWGmNoaEx0FWwQYKp5cOHIQUieMj8cVl7eY038',
  'oQIhANfrsRj1ncsFKKCQAS8sIroipCUnwQRjaa9pZRFOP/HvAiEAzGTCHdgw3KBA',
  '2+tDuEdVrmDmj37xbUBFE9DYbBQJndECIQCewxKIw7CuYrCovrngMZenPWlsWHq3',
  '+1DuRZSm0N57yQIgfKmny9QkWSxU4s1njGnV1Hm9ph/i2KOufhuPJLxD8UECIFgS',
  'Je4C7mKAK2NVzd1GKoLg7/26cfgFbZKGV/uWm4eR',
  '-----END RSA PRIVATE KEY-----',
].join('\n')

export const consumerApp = express()

consumerApp.get('/', async (req, res) => {
  const payload = {
    data: 'Ariel',
    foo: 'bar',
  }

  const body = JSON.stringify(payload, stringifySort)

  const hash = crypto.createHash('sha1').update(body).digest('hex')

  const i = 'Mysoft corp' // Issuer
  const s = 'some@user.com' // Subject
  const a = 'http://mysoftcorp.in' // Audience

  const token = jwt.sign({hash}, PRIVATE_KEY, {
    // issuer: i,
    // subject: s,
    // audience: a,
    expiresIn: '10s',
    algorithm: 'RS256',
  })
  // {expiresIn: '5s', algorithm: 'RS256'})

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
