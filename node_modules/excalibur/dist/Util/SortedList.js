/**
 * A sorted list implementation. NOTE: this implementation is not self-balancing
 */
var SortedList = /** @class */ (function () {
    function SortedList(getComparable) {
        this._getComparable = getComparable;
    }
    SortedList.prototype.find = function (element) {
        return this._find(this._root, element);
    };
    SortedList.prototype._find = function (node, element) {
        if (node == null) {
            return false;
        }
        else if (this._getComparable.call(element) === node.getKey()) {
            if (node.getData().indexOf(element) > -1) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (this._getComparable.call(element) < node.getKey()) {
            return this._find(node.getLeft(), element);
        }
        else {
            return this._find(node.getRight(), element);
        }
    };
    // returns the array of elements at a specific key value
    SortedList.prototype.get = function (key) {
        return this._get(this._root, key);
    };
    SortedList.prototype._get = function (node, key) {
        if (node == null) {
            return [];
        }
        else if (key === node.getKey()) {
            return node.getData();
        }
        else if (key < node.getKey()) {
            return this._get(node.getLeft(), key);
        }
        else {
            return this._get(node.getRight(), key);
        }
    };
    SortedList.prototype.add = function (element) {
        if (this._root == null) {
            this._root = new BinaryTreeNode(this._getComparable.call(element), [element], null, null);
            return true;
        }
        else {
            return this._insert(this._root, element);
        }
    };
    SortedList.prototype._insert = function (node, element) {
        if (node != null) {
            if (this._getComparable.call(element) === node.getKey()) {
                if (node.getData().indexOf(element) > -1) {
                    return false; // the element we're trying to insert already exists
                }
                else {
                    node.getData().push(element);
                    return true;
                }
            }
            else if (this._getComparable.call(element) < node.getKey()) {
                if (node.getLeft() == null) {
                    node.setLeft(new BinaryTreeNode(this._getComparable.call(element), [element], null, null));
                    return true;
                }
                else {
                    return this._insert(node.getLeft(), element);
                }
            }
            else {
                if (node.getRight() == null) {
                    node.setRight(new BinaryTreeNode(this._getComparable.call(element), [element], null, null));
                    return true;
                }
                else {
                    return this._insert(node.getRight(), element);
                }
            }
        }
        return false;
    };
    SortedList.prototype.removeByComparable = function (element) {
        this._root = this._remove(this._root, element);
    };
    SortedList.prototype._remove = function (node, element) {
        if (node == null) {
            return null;
        }
        else if (this._getComparable.call(element) === node.getKey()) {
            var elementIndex = node.getData().indexOf(element);
            // if the node contains the element, remove the element
            if (elementIndex > -1) {
                node.getData().splice(elementIndex, 1);
                // if we have removed the last element at this node, remove the node
                if (node.getData().length === 0) {
                    // if the node is a leaf
                    if (node.getLeft() == null && node.getRight() == null) {
                        return null;
                    }
                    else if (node.getLeft() == null) {
                        return node.getRight();
                    }
                    else if (node.getRight() == null) {
                        return node.getLeft();
                    }
                    // if node has 2 children
                    var temp = this._findMinNode(node.getRight());
                    node.setKey(temp.getKey());
                    node.setData(temp.getData());
                    node.setRight(this._cleanup(node.getRight(), temp)); //"cleanup nodes" (move them up recursively)
                    return node;
                }
                else {
                    // this prevents the node from being removed since it still contains elements
                    return node;
                }
            }
        }
        else if (this._getComparable.call(element) < node.getKey()) {
            node.setLeft(this._remove(node.getLeft(), element));
            return node;
        }
        else {
            node.setRight(this._remove(node.getRight(), element));
            return node;
        }
        return null;
    };
    // called once we have successfully removed the element we wanted, recursively corrects the part of the tree below the removed node
    SortedList.prototype._cleanup = function (node, element) {
        var comparable = element.getKey();
        if (node == null) {
            return null;
        }
        else if (comparable === node.getKey()) {
            // if the node is a leaf
            if (node.getLeft() == null && node.getRight() == null) {
                return null;
            }
            else if (node.getLeft() == null) {
                return node.getRight();
            }
            else if (node.getRight() == null) {
                return node.getLeft();
            }
            // if node has 2 children
            var temp = this._findMinNode(node.getRight());
            node.setKey(temp.getKey());
            node.setData(temp.getData());
            node.setRight(this._cleanup(node.getRight(), temp));
            return node;
        }
        else if (this._getComparable.call(element) < node.getKey()) {
            node.setLeft(this._cleanup(node.getLeft(), element));
            return node;
        }
        else {
            node.setRight(this._cleanup(node.getRight(), element));
            return node;
        }
    };
    SortedList.prototype._findMinNode = function (node) {
        var current = node;
        while (current.getLeft() != null) {
            current = current.getLeft();
        }
        return current;
    };
    SortedList.prototype.list = function () {
        var results = new Array();
        this._list(this._root, results);
        return results;
    };
    SortedList.prototype._list = function (treeNode, results) {
        if (treeNode != null) {
            this._list(treeNode.getLeft(), results);
            treeNode.getData().forEach(function (element) {
                results.push(element);
            });
            this._list(treeNode.getRight(), results);
        }
    };
    return SortedList;
}());
export { SortedList };
/**
 * A tree node part of [[SortedList]]
 */
var BinaryTreeNode = /** @class */ (function () {
    function BinaryTreeNode(key, data, left, right) {
        this._key = key;
        this._data = data;
        this._left = left;
        this._right = right;
    }
    BinaryTreeNode.prototype.getKey = function () {
        return this._key;
    };
    BinaryTreeNode.prototype.setKey = function (key) {
        this._key = key;
    };
    BinaryTreeNode.prototype.getData = function () {
        return this._data;
    };
    BinaryTreeNode.prototype.setData = function (data) {
        this._data = data;
    };
    BinaryTreeNode.prototype.getLeft = function () {
        return this._left;
    };
    BinaryTreeNode.prototype.setLeft = function (left) {
        this._left = left;
    };
    BinaryTreeNode.prototype.getRight = function () {
        return this._right;
    };
    BinaryTreeNode.prototype.setRight = function (right) {
        this._right = right;
    };
    return BinaryTreeNode;
}());
export { BinaryTreeNode };
/**
 * Mock element for testing
 *
 * @internal
 */
var MockedElement = /** @class */ (function () {
    function MockedElement(key) {
        this._key = 0;
        this._key = key;
    }
    MockedElement.prototype.getTheKey = function () {
        return this._key;
    };
    MockedElement.prototype.setKey = function (key) {
        this._key = key;
    };
    return MockedElement;
}());
export { MockedElement };
//# sourceMappingURL=SortedList.js.map