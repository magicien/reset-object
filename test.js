const expect = require('chai').expect
const resetObject = require('./index')

class TestClass {
  constructor() {
    this.value = 'TestClass.value'

    this._computedValue = 'TestClass.computedValue'
  }

  funcA() {
    return 'TestClass.funcA'
  }

  funcB() {
    return 'TestClass.funcB'
  }

  get computedValueA() {
    return 'TestClass.computedValueA'
  }

  get computedValueB() {
    return this._computedValue
  }
  set computedValueB(newValue) {
    this._computedValue = newValue
  }
}

class TestSubClass extends TestClass {
  constructor() {
    super()
    this.value = 'TestSubClass.value'
    this.valueSub = 'TestSubClass.valueSub'
  }

  funcA() {
    return 'TestSubClass.funcA'
  }

  funcSubA() {
    return 'TestSubClass.funcSubA'
  }
}

describe('resetObject', () => {
  let objA, objB

  beforeEach(() => {
    objA = new TestClass()

    objA.value = 'overwritten value'
    objA.funcA = () => 'overwritten funcA'
    Object.defineProperty(objA, 'funcB', {
      enumerable: true,
      writable: false,
      configurable: true
    })
    Object.defineProperty(objA, 'computedValueA', {
      get: () => 'overwritten computedValueA',
      set: () => {},
      enumerable: true,
      configurable: true
    })

    objA.ownFuncA = () => 'ownFuncA'
    objA.ownValue = 'ownValue'


    objB = new TestSubClass()

    objB.value = 'overwritten value'
    objB.funcA = () => 'overwritten funcA'
    Object.defineProperty(objB, 'funcB', {
      enumerable: true,
      writable: false,
      configurable: true,
      value: () => 'overwritten funcB'
    })
    Object.defineProperty(objB, 'computedValueA', {
      get: () => 'overwritten computedValueA',
      set: () => {},
      enumerable: true,
      configurable: true
    })

    objB.ownFuncA = () => 'ownFuncA'
    objB.ownValue = 'ownValue'
  })

  it('should reset overwritten functions', () => {
    expect(objA.funcA()).to.deep.equal('overwritten funcA')
    resetObject(objA)
    expect(objA.funcA()).to.deep.equal('TestClass.funcA')
  })

  it('should reset overwritten function propertyDescriptors', () => {
    const beforeProp = Object.getOwnPropertyDescriptor(objA, 'funcB')
    expect(beforeProp.enumerable).to.be.true
    expect(beforeProp.writable).to.be.false

    resetObject(objA)

    const afterProp = Object.getOwnPropertyDescriptor(objA, 'funcB')
    expect(afterProp.enumerable).to.be.false
    expect(afterProp.writable).to.be.true
  })

  it('should reset overwritten accessors', () => {
    expect(objA.computedValueA).to.deep.equal('overwritten computedValueA')
    resetObject(objA)
    expect(objA.computedValueA).to.deep.equal('TestClass.computedValueA')
  })

  it('should reset overwritten accessor propertyDescriptors', () => {
    const beforeProp = Object.getOwnPropertyDescriptor(objA, 'computedValueA')
    expect(beforeProp.enumerable).to.be.true
    expect(beforeProp.set).to.not.be.undefined

    resetObject(objA)
    
    const afterProp = Object.getOwnPropertyDescriptor(objA, 'computedValueA')
    expect(afterProp.enumerable).to.be.false
    expect(afterProp.set).to.be.undefined
  })

  it('should keep overwritten values', () => {
    expect(objA.value).to.deep.equal('overwritten value')
    resetObject(objA)
    expect(objA.value).to.deep.equal('overwritten value')
  })

  it('should keep its own functions', () => {
    expect(objA.ownFuncA()).to.deep.equal('ownFuncA')
    resetObject(objA)
    expect(objA.ownFuncA()).to.deep.equal('ownFuncA')
  })

  it('should keep its own values', () => {
    expect(objA.ownValue).to.deep.equal('ownValue')
    resetObject(objA)
    expect(objA.ownValue).to.deep.equal('ownValue')
  })

  it('should reset superclass functions', () => {
    expect(objB.funcA()).to.deep.equal('overwritten funcA')
    expect(objB.funcB()).to.deep.equal('overwritten funcB')
    resetObject(objB)
    expect(objB.funcA()).to.deep.equal('TestSubClass.funcA')
    expect(objB.funcB()).to.deep.equal('TestClass.funcB')
  })

  it('should reset superclass function propertyDescriptors', () => {
    const beforeProp = Object.getOwnPropertyDescriptor(objB, 'funcB')
    expect(beforeProp.enumerable).to.be.true
    expect(beforeProp.writable).to.be.false

    resetObject(objB)

    const afterProp = Object.getOwnPropertyDescriptor(objB, 'funcB')
    expect(afterProp.enumerable).to.be.false
    expect(afterProp.writable).to.be.true
  })

  it('should reset superclass accessors', () => {
    expect(objB.computedValueA).to.deep.equal('overwritten computedValueA')
    resetObject(objB)
    expect(objB.computedValueA).to.deep.equal('TestClass.computedValueA')

  })

  it('should reset superclass accessor propertyDescriptors', () => {
    const beforeProp = Object.getOwnPropertyDescriptor(objB, 'computedValueA')
    expect(beforeProp.enumerable).to.be.true
    expect(beforeProp.set).to.not.be.undefined

    resetObject(objB)
    
    const afterProp = Object.getOwnPropertyDescriptor(objB, 'computedValueA')
    expect(afterProp.enumerable).to.be.false
    expect(afterProp.set).to.be.undefined
  })

  it('should keep superclass values', () => {
    expect(objB.value).to.deep.equal('overwritten value')
    resetObject(objB)
    expect(objB.value).to.deep.equal('overwritten value')
  })

  it('should throw Error if the object is sealed', () => {
    Object.seal(objA)
    expect(resetObject.bind(null, objA)).to.throw('resetObject: obj is sealed')

    Object.freeze(objB)
    expect(resetObject.bind(null, objB)).to.throw('resetObject: obj is sealed')
  })

  it('should ignore unconfigurable properties', () => {
    Object.defineProperty(objA, 'computedValueB', {
      get: () => 'overwritten computedValueB',
      set: () => {},
      enumerable: true,
      configurable: false
    })

    expect(objA.computedValueB).to.deep.equal('overwritten computedValueB')
    expect(resetObject.bind(null, objA)).to.not.throw()
    expect(objA.computedValueB).to.deep.equal('overwritten computedValueB')
  })
})

