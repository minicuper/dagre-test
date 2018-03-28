import {Model} from 'racer'
import {promisifyAll} from 'bluebird'
import Global from './GlobalModel'

// Promisify the default model methods like subscribe, fetch, set, push, etc.
promisifyAll(Model.prototype)

export default function (racer) {
  racer.model('Global', '', Global)
}
