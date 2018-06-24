var domdiff = (function () {
'use strict';

/*! (c) 2017 Andrea Giammarchi (ISC) */

/**
 * This code is a revisited port of the snabbdom vDOM diffing logic,
 * the same that fuels as fork Vue.js or other libraries.
 * @credits https://github.com/snabbdom/snabbdom
 */

var eqeq = function eqeq(a, b) {
  return a == b;
};

var identity = function identity(O) {
  return O;
};

var remove = function remove(get, parentNode, before, after) {
  if (after == null) {
    parentNode.removeChild(get(before, -1));
  } else {
    var range = parentNode.ownerDocument.createRange();
    range.setStartBefore(get(before, -1));
    range.setEndAfter(get(after, -1));
    range.deleteContents();
  }
};

var domdiff = function domdiff(parentNode, // where changes happen
currentNodes, // Array of current items/nodes
futureNodes, // Array of future items/nodes
options // optional object with one of the following properties
//  before: domNode
//  compare(generic, generic) => true if same generic
//  node(generic) => Node
) {
  if (!options) options = {};
  var compare = options.compare || eqeq;
  var get = options.node || identity;
  var before = options.before == null ? null : get(options.before, 0);
  var currentStart = 0,
      futureStart = 0;
  var currentEnd = currentNodes.length - 1;
  var currentStartNode = currentNodes[0];
  var currentEndNode = currentNodes[currentEnd];
  var futureEnd = futureNodes.length - 1;
  var futureStartNode = futureNodes[0];
  var futureEndNode = futureNodes[futureEnd];
  while (currentStart <= currentEnd && futureStart <= futureEnd) {
    if (currentStartNode == null) {
      currentStartNode = currentNodes[++currentStart];
    } else if (currentEndNode == null) {
      currentEndNode = currentNodes[--currentEnd];
    } else if (futureStartNode == null) {
      futureStartNode = futureNodes[++futureStart];
    } else if (futureEndNode == null) {
      futureEndNode = futureNodes[--futureEnd];
    } else if (compare(currentStartNode, futureStartNode)) {
      currentStartNode = currentNodes[++currentStart];
      futureStartNode = futureNodes[++futureStart];
    } else if (compare(currentEndNode, futureEndNode)) {
      currentEndNode = currentNodes[--currentEnd];
      futureEndNode = futureNodes[--futureEnd];
    } else if (compare(currentStartNode, futureEndNode)) {
      parentNode.insertBefore(get(currentStartNode, 1), get(currentEndNode, -0).nextSibling);
      currentStartNode = currentNodes[++currentStart];
      futureEndNode = futureNodes[--futureEnd];
    } else if (compare(currentEndNode, futureStartNode)) {
      parentNode.insertBefore(get(currentEndNode, 1), get(currentStartNode, 0));
      currentEndNode = currentNodes[--currentEnd];
      futureStartNode = futureNodes[++futureStart];
    } else {
      var index = currentNodes.indexOf(futureStartNode);
      if (index < 0) {
        parentNode.insertBefore(get(futureStartNode, 1), get(currentStartNode, 0));
        futureStartNode = futureNodes[++futureStart];
      } else {
        var i = index;
        var f = futureStart;
        while (i <= currentEnd && f <= futureEnd && currentNodes[i] === futureNodes[f]) {
          i++;
          f++;
        }
        if (1 < i - index) {
          if (--index === currentStart) {
            parentNode.removeChild(get(currentStartNode, -1));
          } else {
            remove(get, parentNode, currentStartNode, currentNodes[index]);
          }
          currentStart = i;
          futureStart = f;
          currentStartNode = currentNodes[i];
          futureStartNode = futureNodes[f];
        } else {
          var el = currentNodes[index];
          currentNodes[index] = null;
          parentNode.insertBefore(get(el, 1), get(currentStartNode, 0));
          futureStartNode = futureNodes[++futureStart];
        }
      }
    }
  }
  if (currentStart <= currentEnd || futureStart <= futureEnd) {
    if (currentStart > currentEnd) {
      var pin = futureNodes[futureEnd + 1];
      var place = pin == null ? before : get(pin, 0);
      if (futureStart === futureEnd) {
        parentNode.insertBefore(get(futureNodes[futureStart], 1), place);
      } else {
        var fragment = parentNode.ownerDocument.createDocumentFragment();
        while (futureStart <= futureEnd) {
          fragment.appendChild(get(futureNodes[futureStart++], 1));
        }
        parentNode.insertBefore(fragment, place);
      }
    } else {
      if (currentNodes[currentStart] == null) currentStart++;
      if (currentStart === currentEnd) {
        parentNode.removeChild(get(currentNodes[currentStart], -1));
      } else {
        remove(get, parentNode, currentNodes[currentStart], currentNodes[currentEnd]);
      }
    }
  }
  return futureNodes;
};



return domdiff;

}());
