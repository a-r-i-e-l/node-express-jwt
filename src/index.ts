import {consumerApp} from './consumer'
import {supplierApp} from './supplier'

supplierApp.listen(3003)

consumerApp.listen(3004)
