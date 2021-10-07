import express, {NextFunction, Request, Response} from 'express'
import * as jwt from 'jsonwebtoken'
import * as crypto from 'crypto'
import {stringifySort} from './utils'
import {EXPIRATION_TIME_IN_SECONDS} from './config'

const PUBLIC_KEY = [
  '-----BEGIN PUBLIC KEY-----',
  'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKxkzOrZub0Uyz12vTklnjWMLjxRigxn',
  'r7yKGQoOPMqqdfkKIdZF4u+Q9Jj6VUWGqUfw9lFwDuYdBguYGEb7Fx8CAwEAAQ==',
  '-----END PUBLIC KEY-----',
].join('\n')

const i = 'Mysoft corp' // Issuer
const s = 'some@user.com' // Subject
const a = 'http://mysoftcorp.in' // Audience

export const supplierApp = express()
supplierApp.use(express.json())
const router = express.Router()

const isValidExp = (decoded: jwt.JwtPayload) => {
  const {iat, exp} = decoded
  return iat && exp && exp - iat <= EXPIRATION_TIME_IN_SECONDS
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const barerHeader = req.headers.authorization
  if (typeof barerHeader === 'undefined') {
    return res.status(401).json({error: 'Access unauthorized. No credentials were supplied'})
  }
  const bearerToken = req.headers.authorization!.substring(7)
  jwt.verify(
    bearerToken,
    PUBLIC_KEY,
    {
      algorithms: ['RS256'],
      // issuer: i,
      // subject: s,
      // audience: a,
    },
    (err: jwt.VerifyErrors | null, decoded?: jwt.JwtPayload) => {
      if (err) {
        return res.status(403).json({error: 'Access forbidden. Invalid credentials were supplied'})
      }

      if (!decoded) {
        return res.status(403).json({error: 'Access forbidden. Invalid credentials were supplied'})
      }

      if (!isValidExp(decoded)) {
        return res
          .status(403)
          .json({error: "Access forbidden. Expiration time claim ('exp') is too far in the future"})
      }

      const body = JSON.stringify(req.body, stringifySort)

      const hash = crypto.createHash('sha1').update(body).digest('hex')

      if (decoded && decoded.hash !== hash) {
        return res.status(403).json({error: 'Access forbidden. Invalid payload'})
      }
      next()
    }
  )
}

router.route('/api').post(authenticateToken, (req: Request, res: Response) => {
  res.json({message: 'OK'})
})

supplierApp.use('/', router)
