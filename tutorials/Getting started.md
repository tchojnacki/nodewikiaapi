# Getting started
## Installation
Copy the entire directory to your `node_modules` folder. Using `npm` might be supported in the future.
## Import
Import the module using `require`.
```JavaScript
const WikiaAPI = require('nodewikiaapi')
```
## Your first request
Create an instance of `WikiaAPI` and use any of the documented functions.
```JavaScript
const WikiaAPI = require('nodewikiaapi')

const mywiki = new WikiaAPI('mylang.mysubdomain')

mywiki.getLatestActivity().then(data => {
  console.log(data)
}).catch(error => {
  console.error(error)
})
```