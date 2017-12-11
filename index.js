var domdiff = (function () {
'use strict';

/*! (c) 2017 Andrea Giammarchi (ISC) */

/**
 * This code is a revisited port of the snabbdom vDOM diffing logic,
 * the same that fuels as fork Vue.js or other libraries.
 * @credits https://github.com/snabbdom/snabbdom
 */

var identity = function identity(O) {
  return O;
};

var domdiff = function domdiff(parentNode, // where changes happen
currentNodes, // Array of current items/nodes
futureNodes, // Array of future items/nodes
getNode, // optional way to retrieve a node from an item
beforeNode // optional item/node to use as insertBefore delimiter
) {
  var get = getNode || identity;
  var before = beforeNode == null ? null : get(beforeNode, 0);
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
    } else if (currentStartNode == futureStartNode) {
      currentStartNode = currentNodes[++currentStart];
      futureStartNode = futureNodes[++futureStart];
    } else if (currentEndNode == futureEndNode) {
      currentEndNode = currentNodes[--currentEnd];
      futureEndNode = futureNodes[--futureEnd];
    } else if (currentStartNode == futureEndNode) {
      parentNode.insertBefore(get(currentStartNode, 1), get(currentEndNode, -0).nextSibling);
      currentStartNode = currentNodes[++currentStart];
      futureEndNode = futureNodes[--futureEnd];
    } else if (currentEndNode == futureStartNode) {
      parentNode.insertBefore(get(currentEndNode, 1), get(currentStartNode, 0));
      currentEndNode = currentNodes[--currentEnd];
      futureStartNode = futureNodes[++futureStart];
    } else {
      var index = currentNodes.indexOf(futureStartNode);
      if (index < 0) {
        parentNode.insertBefore(get(futureStartNode, 1), get(currentStartNode, 0));
        futureStartNode = futureNodes[++futureStart];
      } else {
        var el = currentNodes[index];
        currentNodes[index] = null;
        parentNode.insertBefore(get(el, 1), get(currentStartNode, 0));
        futureStartNode = futureNodes[++futureStart];
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
      // TODO: this case never happens but it was previously essential.
      //       anything to further investigate?
      // if (currentNodes[currentStart] == null) currentStart++;
      if (currentStart === currentEnd) {
        parentNode.removeChild(get(currentNodes[currentStart], -1));
      } else {
        var range = parentNode.ownerDocument.createRange();
        range.setStartBefore(get(currentNodes[currentStart], -1));
        range.setEndAfter(get(currentNodes[currentEnd], -1));
        range.deleteContents();
      }
    }
  }
  return futureNodes;
};



return domdiff;

}());
