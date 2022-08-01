### Installation
```bash
npm install nodewikiaapi
```

### Import
Import the module using ESM. See more information [here](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#file-esm-package-md).
```JavaScript
import WikiaAPI from 'nodewikiaapi'
```

### Your first request
Create an instance of `WikiaAPI` and use any of the documented methods.
```JavaScript
import WikiaAPI from 'nodewikiaapi'

const devApi = new WikiaAPI('dev')
console.log(await devApi.getTopArticles())
```

You can also see the test file containing some usage of the methods: [api.test.js](https://github.com/tchojnacki/nodewikiaapi/blob/master/tests/api.test.js).
