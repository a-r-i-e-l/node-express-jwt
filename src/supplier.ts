import express, {NextFunction, Request, Response} from 'express'
import * as jwt from 'jsonwebtoken'
import * as crypto from 'crypto'
import {stringifySort} from './utils'

const SECRET_KEY = 'secretKey'

export const supplierApp = express()
supplierApp.use(express.json())
const router = express.Router()

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const barerHeader = req.headers.authorization
  if (typeof barerHeader === 'undefined') {
    return res.status(401).json({error: 'Access unauthorized. No credentials were supplied'})
  }
  const bearerToken = req.headers.authorization!.substring(7)
  jwt.verify(
    bearerToken,
    SECRET_KEY,
    //{algorithms: ['ES256']},
    (err: jwt.VerifyErrors | null, decoded?: jwt.JwtPayload) => {
      if (err) {
        return res.status(403).json({error: 'Access forbidden. Invalid credentials were supplied'})
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
