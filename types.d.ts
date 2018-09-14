export interface IDomDiffNodeMarkerOptions<T = Node> {
  /**
   * A specific live node to use as boundary for all nodes operations.
   * With live nodes [a,d] and {before: d}, the operation [] => [b, c]
   * would place nodes right before d, resulting a live collection of [a, b, c, d].
   * 
   * `before` doesn't necessarily have to be a node
   */
  before: T;
}

export interface IDomDiffOptionsGenericComparisonFn {
  /**
   * A callback to compare between two generic objects, each could be a node or anything. returns `true` to indicate they are the same
   */
  compare: <T1 = any, T2 = any>(currentNode: T1, futureNode: T2) => boolean;
}

export interface IDomDiffOPtionsEachNodeCallbackFn {
  /**
   * The optional function is invoked per each operation on the list of current"Nodes".
   * This can be useful to represent node through wrappers, whenever that is needed.
   * @param info
   * `1` when the item/node is being appended
   * `0` when the item/node is being used as insert _before_ reference
   * `-0` when the item/node is being used as insert _after_ reference
   * `-1` when the item/node is being removed
   */
  node: <T = any>(generic: T, info: -1 | -0 | 0 | 1) => Node;
}

/**
 * A vDOM-less implementation of the [petit-dom](https://github.com/yelouafi/petit-dom) diffing logic
 * that will mutate child nodes the first argument - parentNode
 * @param parentNode Where changes happen
 * @param currentNodes Array of current items / nodes.
 * @param futureNodes Array of future items / nodes
 */
export default function domdiff<TCurrentItems extends any[], TFutureItems extends any[]>(
  parentNode: Node,
  currentNodes: TCurrentItems,
  futureNodes: TFutureItems,
  options?: IDomDiffNodeMarkerOptions | IDomDiffOptionsGenericComparisonFn | IDomDiffOPtionsEachNodeCallbackFn
): void;
