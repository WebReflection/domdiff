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


### Example

```js
var nodes = {
  a: document.createTextNode('a'),
  b: document.createTextNode('b'),
  c: document.createTextNode('c')
};

var parentNode = document.createElement('p');
var childNodes = [nodes.a, nodes.c];
parentNode.append(...childNodes);
parentNode.textContent;
// "ac"

childNodes = domdiff(
  parentNode,
  childNodes,
  [nodes.a, nodes.b, nodes.c]
);

parentNode.textContent;
// "abc"
```


### Compatibility:

Every. JavaScript. Engine.


### A `getNode` callback for complex data

The `getNode(item, info)` is invoked per each operation on the DOM.

This can be useful to represent node through wrappers, whenever that is needed.

The passed `info` value can be:

  * `1` when the item/node is being appended
  * `0` when the item/node is being used as insert _before_ reference
  * `-0` when the item/node is being used as insert _after_ reference
  * `-1` when the item/node is being removed

```js
function getNode(item, i) {
  // case removal or case after
  if ((1 / i) < 0) {
    // case removal
    if (i) {
      // if the item has more than a node
      // remove all other nodes at once
      if (item.length > 1) {
        const range = document.createRange();
        range.setStartBefore(item[1]);
        range.setEndAfter(item[item.length - 1]);
        debugger;
        range.deleteContents();
      }
      // return the first node to be removed
      return item[0];
    }
    // case after
    else {
      return item[item.length - 1];
    }
  }
  // case insert
  else if (i) {
    const fragment = document.createDocumentFragment();
    fragment.append(...item);
    return fragment;
  }
  // case before
  else {
    return item[0];
  }
}

const and = [document.createTextNode(' & ')];

const Bob = [
  document.createTextNode('B'),
  document.createTextNode('o'),
  document.createTextNode('b')
];

const Lucy = [
  document.createTextNode('L'),
  document.createTextNode('u'),
  document.createTextNode('c'),
  document.createTextNode('y')
];

// clean the body for demo purpose
document.body.textContent = '';
let content = domdiff(
  document.body,
  [],
  [Bob, and, Lucy],
  getNode
);

// ... later on ...
content = domdiff(
  document.body,
  content,
  [Lucy, and, Bob],
  getNode
);

// clean up
domdiff(
  document.body,
  content,
  [],
  getNode
);

```
