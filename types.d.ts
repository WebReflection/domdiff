export interface IDomDiffNodeMarkerOptions {
  before: Node;
}

export interface IDomDiffOptionsGenericComparisonFn {
  /**
   * A callback to compare between two generic nodes. returns `true` to indicate they are the same
   */
  compare: (currentNode: Node, futureNode: Node) => boolean;
}

export interface IDomDiffOPtionsEachNodeCallbackFn {
  /**
   * The optional `{node: (generic, info) => node}` is invoked per each operation on the DOM.
   * This can be useful to represent node through wrappers, whenever that is needed.
   * @param info
   * `1` when the item/node is being appended
   * `0` when the item/node is being used as insert _before_ reference
   * `-0` when the item/node is being used as insert _after_ reference
   * `-1` when the item/node is being removed
   */
  node: (generic: Node, info: -1 | -0 | 0 | 1) => Node;
}

/**
 * A vDOM-less implementation of the [petit-dom](https://github.com/yelouafi/petit-dom) diffing logic
 * that will mutate child nodes the first argument - parentNode
 * @param parentNode Where changes happen
 * @param currentNodes Array of current items / nodes
 * @param futureNodes Array of future items / nodes
 */
export default function domdiff(
  parentNode: Node,
  currentNodes: ArrayLike<Node>,
  futureNodes: ArrayLike<Node>,
  options?: IDomDiffNodeMarkerOptions | IDomDiffOptionsGenericComparisonFn | IDomDiffOPtionsEachNodeCallbackFn
): void;
