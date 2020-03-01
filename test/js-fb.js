const domdiff = require('../cjs').default;

const node = o => o;

class Dommy {
  constructor() {
    this.lastElementChild = new Nody(this, '');
    this.operations = 0;
    this._childNodes = [this.lastElementChild];
  }
  get childNodes() {
    return this._childNodes.slice(0, -1);
  }
  get textContent() {
    return this._childNodes.map(node => node.value).join('');
  }
  insertBefore(before, after) {
    this.operations++;
    if (before !== after) {
      this._removeChild(before);
      this._childNodes.splice(
        this._childNodes.indexOf(after),
        0,
        before
      );
    }
  }
  replaceChild(newChild, oldChild) {
    this.operations++;
    if (newChild !== oldChild) {
      this._removeChild(newChild);
      this._childNodes.splice(
        this._childNodes.indexOf(oldChild),
        1,
        newChild
      );
    }
  }
  removeChild(child) {
    this.operations++;
    this._removeChild(child);
  }
  _removeChild(child) {
    var i = this._childNodes.indexOf(child);
    if (-1 < i)
      this._childNodes.splice(i, 1);
  }
}

class Nody {
  constructor(dommy, value) {
    this.dommy = dommy;
    this.value = value;
  }
  get nextSibling() {
    return this.dommy.childNodes[
      this.dommy.childNodes.indexOf(this) + 1
    ] || this.dommy.lastElementChild;
  }
}

let parent = new Dommy();
const before = parent.lastElementChild;

const append1000 = parent => {
  const start = parent.childNodes.length - 1;
  const childNodes = parent.childNodes.slice();
  for (let i = 0; i < 1000; i++)
    childNodes.push(new Nody(parent, start + i));
  return domdiff(
    parent,
    parent.childNodes,
    childNodes,
    {node, before}
  );
};

const clear = parent => {
  return domdiff(
    parent,
    parent.childNodes,
    [],
    {node, before}
  );
};

const create1000 = parent => {
  const start = parent.childNodes.length;
  const childNodes = [];
  for (let i = 0; i < 1000; i++)
    childNodes.push(new Nody(parent, start + i));
  return domdiff(
    parent,
    parent.childNodes,
    childNodes,
    {node, before}
  );
};

const create10000 = parent => {
  const childNodes = [];
  for (let i = 0; i < 10000; i++)
    childNodes.push(new Nody(parent, i));
  return domdiff(
    parent,
    parent.childNodes,
    childNodes,
    {node, before}
  );
};

const swapRows = parent => {
  const childNodes = parent.childNodes.slice();
  const $1 = childNodes[1];
  childNodes[1] = childNodes[998];
  childNodes[998] = $1;
  return domdiff(
    parent,
    parent.childNodes,
    childNodes,
    {node, before}
  );
};

const updateEach10thRow = parent => {
  const childNodes = parent.childNodes.slice();
  for (let i = 0; i < childNodes.length; i += 10)
    childNodes[i].value += '!';
  return domdiff(
    parent,
    parent.childNodes,
    childNodes,
    {node, before}
  );
};

//* warm up + checking everything works upfront
create1000(parent);
console.assert(parent.childNodes.length === 1000);
append1000(parent);
console.assert(parent.childNodes.length === 2000);
clear(parent);
console.assert(parent.childNodes.length === 0);
create10000(parent);
console.assert(parent.childNodes.length === 10000);
clear(parent);
console.assert(parent.childNodes.length === 0);
create1000(parent);
swapRows(parent);
console.assert(parent.childNodes[1].value == 998);
console.assert(parent.childNodes[998].value == 1);
clear(parent);
create1000(parent);
updateEach10thRow(parent);
console.assert(/!$/.test(parent.childNodes[0].value));
console.assert(!/!$/.test(parent.childNodes[1].value));
console.assert(/!$/.test(parent.childNodes[10].value));
clear(parent);
console.assert(parent.childNodes.length === 0);
//*/

// actual benchmark
parent.operations = 0;
console.time('create 1000');
var rows = create1000(parent);
console.timeEnd('create 1000');
console.assert(parent.childNodes.every((row, i) => row === rows[i]));
console.log('operations', parent.operations, '\n');
parent.operations = 0;

console.time('clear');
var rows = clear(parent);
console.timeEnd('clear');
console.assert(parent.childNodes.every((row, i) => row === rows[i]) && rows.length === 0);
console.log('operations', parent.operations, '\n');
parent.operations = 0;

create1000(parent);
parent.operations = 0;
console.time('replace 1000');
var rows = create1000(parent);
console.timeEnd('replace 1000');
console.assert(parent.childNodes.every((row, i) => row === rows[i]));
console.log('operations', parent.operations, '\n');
clear(parent);
parent.operations = 0;

create1000(parent);
parent.operations = 0;
console.time('append 1000');
var rows = append1000(parent);
console.timeEnd('append 1000');
console.assert(parent.childNodes.every((row, i) => row === rows[i]) && rows.length === 2000);
console.log('operations', parent.operations, '\n');
parent.operations = 0;

console.time('append more');
var rows = append1000(parent);
console.timeEnd('append more');
console.assert(parent.childNodes.every((row, i) => row === rows[i]) && rows.length === 3000);
console.log('operations', parent.operations, '\n');
parent.operations = 0;
clear(parent);

create1000(parent);
parent.operations = 0;
console.time('swap rows');
swapRows(parent);
console.timeEnd('swap rows');
console.log('operations', parent.operations, '\n');
parent.operations = 0;

create1000(parent);
parent.operations = 0;
console.time('update every 10th row');
updateEach10thRow(parent);
console.timeEnd('update every 10th row');
console.log('operations', parent.operations, '\n');
parent.operations = 0;

clear(parent);
parent.operations = 0;
console.time('create 10000 rows');
create10000(parent);
console.timeEnd('create 10000 rows');
console.log('operations', parent.operations, '\n');
parent.operations = 0;

console.time('swap over 10000 rows');
swapRows(parent);
console.timeEnd('swap over 10000 rows');
console.log('operations', parent.operations, '\n');
parent.operations = 0;

console.time('clear 10000');
clear(parent);
console.timeEnd('clear 10000');
console.log('operations', parent.operations, '\n');
parent.operations = 0;

//*/
