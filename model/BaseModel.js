import _ from 'lodash'
import { Model } from 'racer'

export default class BaseModel extends Model.ChildModel {

  getId () {
    let actualField = this.dereferenceSelf()
    return actualField.leaf()
  }

  dereferenceSelf () {
    let model = this.root
    let segments = model._splitPath(this.path())
    return model.scope(model._dereference(segments, true).join('.'))
  }

  static now () {
    return (typeof window !== 'undefined' && window.timeSync)
      ? window.timeSync.server()
      : Date.now()
  }

  isEqual ($item, cb) {
    let equal = $item && $item.get('id') && this.get('id') === $item.get('id')
    return cb(null, equal)
  }

}
