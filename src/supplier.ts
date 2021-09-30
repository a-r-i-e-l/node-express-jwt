import express, {NextFunction, Request, Response} from 'express'
import * as jwt from 'jsonwebtoken'

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
  console.log({bearerToken})
  jwt.verify(bearerToken, SECRET_KEY, (err: jwt.VerifyErrors | null, decoded?: jwt.JwtPayload) => {
    if (err) {
      return res.status(403).json({error: 'Access forbidden. Invalid credentials were supplied'})
    }
    if (decoded && decoded.data !== req.body.data) {
      return res.status(403).json({error: 'Access forbidden. Invalid payload'})
    }
    next()
  })
}

router.route('/api').post(authenticateToken, (req: Request, res: Response) => {
  res.json({message: 'OK'})
})

router.route('/test').get((req, res) => {
  res.json({message: 'you got it'})
})

supplierApp.use('/', router)
