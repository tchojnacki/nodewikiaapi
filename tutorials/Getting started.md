## Installation
```npm install nodewikiaapi```
## Import
Import the module using `require`.
```JavaScript
const WikiaAPI = require('nodewikiaapi')
```
## Your first request
Create an instance of `WikiaAPI` and use any of the documented methods.
```JavaScript
const WikiaAPI = require('nodewikiaapi')

const mywiki = new WikiaAPI('mylang.mysubdomain')

mywiki.getLatestActivity().then(data => {
  console.log(data)
}).catch(error => {
  console.error(error)
})
```

You can also see the tests file containing some usage of the methods: [api.test.js](https://github.com/tchojnacki/nodewikiaapi/blob/master/tests/api.test.js).
