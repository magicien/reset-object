# reset-object
Reset a JavaScript Object instance to its prototype definition

```
const resetObject = require('reset-object')

class MyClass {
  myFunc() {
    return 'this is myFunc'
  }
}

const obj = new MyClass()
obj.myFunc = () => 'new myFunc'

console.log(obj.myFunc()) // -> 'new myFunc'

resetObject(obj)

console.log(obj.myFunc()) // -> 'this is myFunc'
```

## Install

```
npm install --save reset-object
```
