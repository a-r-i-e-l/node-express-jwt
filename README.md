# node-express-jwt

Understanding JWT

- The Backend that consumes the data is running in http://localhost:3004/
- The endpoint of the data supplier backend is: http://localhost:3003/api

## Key Generation

Keys were generated with http://travistidwell.com/jsencrypt/demo/

Other online option would be:
https://www.csfieldguide.org.nz/en/interactives/rsa-key-generator/

A better and safer approach is to use:

```
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
```

And then read them from the file system:

```.ts
const PRIVATE_KEY = fs.readFileSync('jwtRS256.key', 'utf8')
const PUBLIC_KEY = fs.readFileSync('jwtRS256.key.pub', 'utf8')
```

or, if the approach would be to leave them in a **.env** file:

- Bash

  `cat jwtRS256.key | base64`

- .env

  `JWT_KEY=base64:XXXMYXKEYXASXBASE64o=`

Last but not least, Keys can be also generated safely with this function:

```.ts
const generateJWTSecrets = (): Record<string, string> => {
  const keys = crypto.generateKeyPairSync('ec', {
    namedCurve: 'secp256k1',
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'sec1',
      format: 'pem',
    },
  })
  return {
    jwtPublicKey: keys.publicKey.toString(),
    jwtPrivateKey: keys.privateKey.toString(),
  }
}
```
