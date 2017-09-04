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

### Node
```
npm install --save reset-object
```

### Browser
```
<script src="https://cdn.rawgit.com/magicien/reset-object/v0.1.2/reset-object.js"></script>
```
