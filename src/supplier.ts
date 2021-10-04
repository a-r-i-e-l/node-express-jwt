import express, {NextFunction, Request, Response} from 'express'
import * as jwt from 'jsonwebtoken'
import * as crypto from 'crypto'

const SECRET_KEY = 'secretKey'

export const supplierApp = express()
//supplierApp.use(express.json())
const router = express.Router()

const customJsonBodyParser1 = (req: Request) => {
  const body: Uint8Array[] = []
  req.on('data', (chunk: Uint8Array) => {
    body.push(chunk)
  })
  req.on('end', () => {
    const parsedBody = Buffer.concat(body).toString()
    console.log('jsonBody 1', JSON.parse(parsedBody))
  })
}

const customJsonBodyParser2 = (req: Request) => {
  var data = ''
  req.on('data', function (chunk: string) {
    data += chunk
  })
  req.on('end', function () {
    const jsonBody = JSON.parse(data)
    console.log('jsonBody 2', jsonBody)
  })
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const barerHeader = req.headers.authorization
  if (typeof barerHeader === 'undefined') {
    return res.status(401).json({error: 'Access unauthorized. No credentials were supplied'})
  }
  const bearerToken = req.headers.authorization!.substring(7)
  console.log({bearerToken})
  jwt.verify(
    bearerToken,
    SECRET_KEY,
    //{algorithms: ['ES256']},
    (err: jwt.VerifyErrors | null, decoded?: jwt.JwtPayload) => {
      if (err) {
        return res.status(403).json({error: 'Access forbidden. Invalid credentials were supplied'})
      }

      const body = customJsonBodyParser1(req)
      customJsonBodyParser2(req)

      console.log('body1:', body)
      // console.log('body1:', req.body)

      // const body = JSON.stringify(req.body)

      // const hash = crypto.createHash('sha1').update(body.join).digest('hex')

      // if (decoded && decoded.hash !== hash) {
      //   return res.status(403).json({error: 'Access forbidden. Invalid payload'})
      // }
      next()
    }
  )
}

router.route('/api').post(authenticateToken, express.json(), (req: Request, res: Response) => {
  res.json({message: 'OK'})
  console.log('body2:', req.body)
})

router.route('/test').get((req, res) => {
  res.json({message: 'you got it'})
})

supplierApp.use('/', router)
