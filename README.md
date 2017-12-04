# domdiff

[![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/WebReflection/donate) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/domdiff/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/domdiff?branch=master) [![Build Status](https://travis-ci.org/WebReflection/domdiff.svg?branch=master)](https://travis-ci.org/WebReflection/domdiff) [![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)


A vDOM-less implementation of the [snabbdom](https://github.com/snabbdom/snabbdom) diffing logic.


### Signature

```js
futureNodes = domdiff(
  parentNode,     // where changes happen
  currentNodes,   // Array of current items/nodes
  futureNodes,    // Array of future items/nodes (returned)
  getNode,        // optional way to retrieve a node from an item
  beforeNode      // optional item/node to use as insertBefore delimiter
);
```


### How to import it:

  * via **CDN**, as global variable: `https://unpkg.com/domdiff`
  * via **ESM**, as external module: `https://unpkg.com/domdiff/esm/index.js`
  * via **CJS**: `const EventTarget = require('domdiff').default;` <sup><sub>( or `require('domdiff/cjs').default` )</sub></sup>
  * via bundlers/transpilers: `import domdiff from 'domdiff';` <sup><sub>( or `from 'domdiff/esm'` )</sub></sup>


### Compatibility:

Every. JavaScript. Engine.
