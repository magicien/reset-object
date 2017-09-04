function setValues(src, dst, finishedKeys) {
  const keys = Object.getOwnPropertyNames(src)
  for(const key of keys){
    if(finishedKeys.indexOf(key) >= 0){
      continue
    }
    finishedKeys.push(key)
    const dstProp = Object.getOwnPropertyDescriptor(dst, key)
    if(typeof dstProp !== 'undefined' && !dstProp.configurable){
      continue
    }
    const srcProp = Object.getOwnPropertyDescriptor(src, key)
    if(typeof srcProp.get !== 'undefined' || typeof srcProp.set !== 'undefined'){
      Object.defineProperty(dst, key, srcProp)
    }else if(typeof src[key] === 'function'){
      Object.defineProperty(dst, key, srcProp)
    }else{
      srcProp.value = dst[key]
      Object.defineProperty(dst, key, srcProp)
    }
  }
}

function resetObject(obj) {
  if(typeof obj.constructor === 'undefined'){
    throw 'resetObject: obj is not an instance object'
  }
  if(Object.isSealed(obj)){
    throw 'resetObject: obj is sealed'
  }
  let p = obj.constructor.prototype
  let finishedKeys = []
  while(p){
    setValues(p, obj, finishedKeys)
    p = Object.getPrototypeOf(p)

    if(p.constructor === Object){
      break
    }
  }
}

module.exports = resetObject
