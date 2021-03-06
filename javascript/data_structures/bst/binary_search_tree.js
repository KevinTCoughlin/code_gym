// working BST
// add / remove / travese in, pre, and post order
//
// treats duplicates as an already added value and does nothing with them
var dsalgo = require('../../utilities.js').dsalgo;
var Queue = require('../queue.js').doubly_linked_list;
var Stack = require('../stack.js').array;
var Node = require('./node.js');

var BST = function() {
  this.root = null;
};

BST.prototype = {

  add: function(value) {
    var current;

    if (this.root === null) {
      this.root = new Node(value);
    }

    current = this.root;

    // iterate forever until I say stop
    while (true) {

      if (value < current.value) {
        //if no left, then new node goes on lef
        if (current.left === null) {
          current.left = new Node(value);
          break;
        } else {
          current = current.left;
        }
      } else if (value > current.value) {
        if (current.right === null) {
          current.right = new Node(value);
          break;
        } else {
          current = current.right;
        }
      } else {
        break;
      } // value is equal to an existing value so do nothing
    }

    return this;

  },

  contains: function(value, return_node_mode) {

    if (!return_node_mode) {
      return_node_mode = false;
    }

    var found = false,
      current = this.root;
    parent = null;

    while (!found && current) {

      //if the value is less than the current node's, go left
      if (value < current.value) {
        parent = current;
        current = current.left;

      //if the value is greater than the current node's, go right
      } else if (value > current.value) {
        parent = current;
        current = current.right;

      //value equal, it was found
      } else {
        if (return_node_mode) {
          found = [current, parent];
        } else {
          found = true;
        }
      }
    }

    //only proceed if the node was found
    return found;
  },

  remove: function(value) {

    var parent = null,
      childCount,
      replacement,
      replacementParent;

    var found = this.contains(value, true);

    // no need to look to remove node if it wasn't found
    if (!!found) { // http://james.padolsey.com/javascript/truthy-falsey/
      var current = found[0];
      parent = found[1];

      //figure out how many children
      childCount = (!!current.left ? 1 : 0) + (!!current.right ? 1 : 0);

      //special case: the value is at the root
      if (current === this.root) {
        switch (childCount) {

          //no children, just erase the root
          case 0:
            this.root = null;
            break;

          //one child, use one as the root
          case 1:
            this.root = (!current.right ? current.left : current.right);
            break;

          //two children, little work to do
          case 2:

            //new root will be the old root's left child...maybe
            replacement = this.root.left;

            //find the right-most leaf node to be the real new root
            while (!!replacement.right) {
              replacementParent = replacement;
              replacement = replacement.right;
            }

            //it's not the first node on the left
            if (!!replacementParent) {

              //remove the new root from it's previous position
              replacementParent.right = replacement.left;

              //give the new root all of the old root's children
              replacement.right = this.root.right;
              replacement.left = this.root.left;
            } else {

              //just assign the children
              replacement.right = this.root.right;
            }

            //officially assign new root
            this.root = replacement;

            //no default

        }

      //non-root values
      } else {

        switch (childCount) {

          //no children, just remove it from the parent
          case 0:
            //if the current value is less than its parent's, null out the left pointer
            if (current.value < parent.value) {
              parent.left = null;

            //if the current value is greater than its parent's, null out the right pointer
            } else {
              parent.right = null;
            }
            break;

          //one child, just reassign to parent
          case 1:
            //if the current value is less than its parent's, reset the left pointer
            if (current.value < parent.value) {
              parent.left = (!current.left ? current.right : current.left);

            //if the current value is greater than its parent's, reset the right pointer
            } else {
              parent.right = (!current.left ? current.right : current.left);
            }
            break;

          //two children, a bit more complicated
          case 2:

            //reset pointers for new traversal
            replacement = current.left;
            replacementParent = current;

            //find the right-most node
            while (!!replacement.right) {
              replacementParent = replacement;
              replacement = replacement.right;
            }

            replacementParent.right = replacement.left;

            //assign children to the replacement
            replacement.right = current.right;
            replacement.left = current.left;

            //place the replacement in the right spot
            if (current.value < parent.value) {
              parent.left = replacement;
            } else {
              parent.right = replacement;
            }

            //no default

        }

      }

    }

    return this;

  },

  // http://en.wikipedia.org/wiki/Tree_traversal
  // http://btv.melezinek.cz/binary-search-tree.html
  traverse: function(fn, order) {

    //helper function
    function inOrder(node) {
      if (node) {

        //traverse the left subtree
        if (node.left !== null) {
          inOrder(node.left);
        }

        //call the fn method on this node
        fn.call(this, node);

        //traverse the right subtree
        if (node.right !== null) {
          inOrder(node.right);
        }
      }
    }

    // useful for storing
    // http://leetcode.com/2010/09/saving-binary-search-tree-to-file.html
    function preOrder(node) {
      if (node) {

        //call the fn method on this node
        fn.call(this, node);

        //traverse the left subtree
        if (node.left !== null) {
          preOrder(node.left);
        }

        //traverse the right subtree
        if (node.right !== null) {
          preOrder(node.right);
        }
      }
    }

    function postOrder(node) {
      if (node) {

        //traverse the left subtree
        if (node.left !== null) {
          postOrder(node.left);
        }

        //traverse the right subtree
        if (node.right !== null) {
          postOrder(node.right);
        }

        //call the fn method on this node
        fn.call(this, node);
      }
    }

    function levelOrder(node) {
      if (node) {
        var queue = new Queue();
        queue.enqueue(node);

        while (queue.length > 0) {
          var cur = queue.peek();

          // add left child to queue if it exists
          if (cur.left !== null) {
            queue.enqueue(cur.left);
          }

          // add left child to queue if it exists
          if (cur.right !== null) {
            queue.enqueue(cur.right);
          }

          //call the fn method on current node
          fn.call(this, cur);

          // remove the current node from the queue
          queue.dequeue();
        }

      }
    }

    //start with the root
    if (order == 'pre') {
      preOrder(this.root);
    } else if (order == 'post') {
      postOrder(this.root);
    } else if (order == 'level') {
      levelOrder(this.root);
    } else {
      //default to in Order
      inOrder(this.root);
    }

    return this;
  },
  toArray: function(order) {
    var result = [];

    this.traverse(function(node) {
      result.push(node.value);
    }, order);

    return result;
  },
  size: function() {
    return this.toArray().length;
  },
  height: function() {
    return this.heightFromNode(this.root);
  },
  heightFromNode: function(node) {
    if (!node) {
      return 0;
    } else {
      var lheight = this.height(node.left);
      var rheight = this.height(node.right);

      if (lheight > rheight) {
        return (lheight + 1);
      } else {
        return (rheight + 1);
      }
    }
  },

  toString: function() {
    return this.toArray().toString();
  },

  // https://www.interviewcake.com/question/ruby/bst-checker
  isBSTValid: function(current_node, lower_bound, upper_bound) {
	
    // always call with MIN AND MAX int or would need to add if(!upper_bound && !lower_bound) check

    if (current_node === null) return true;
    
    if(current_node.value > lower_bound && current_node.value < upper_bound) {
      return this.isBSTValid(current_node.left, lower_bound, current_node.value) && this.isBSTValid(current_node.right, current_node.value, upper_bound);			
    } 

    // didnt recurse so return false
	  return false;
  },
  
  isBSTValidIterative: function(root){
    var nodeStack = new Stack();
    nodeStack.push([root,Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]);
    
    var nodeInfoArr, current_node, lower_bound, upper_bound;
    
    while(!nodeStack.isEmpty()) {
      nodeInfoArr = nodeStack.pop();

      current_node = nodeInfoArr[0];
      lower_bound = nodeInfoArr[1];
      upper_bound = nodeInfoArr[2];

      if(current_node.value > lower_bound && current_node.value < upper_bound) {

        if (current_node.left) nodeStack.push([current_node.left, lower_bound, current_node.value]);
        if (current_node.right) nodeStack.push([current_node.right, current_node.value, upper_bound]);

      } else {
        return false;
      }
    }
    
    return true;
  },

  isValid: function() { 
    return this.isBSTValid(this.root, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY); 
  },

  isValidIterative: function() { 
    return this.isBSTValidIterative(this.root); 
  },

  findLargestAtNode: function (current_node){
    
    while(current_node.right) {
      current_node = current_node.right;
    }
	
    return current_node;
  },

  findLargest: function (){
    return this.findLargestAtNode(this.root);
  },

  // https://www.interviewcake.com/question/ruby/second-largest-item-in-bst
  findSecondLargest: function (){
    var current_node = this.root;

    while(current_node.right) {

      // node is parent of largest node and the largest node has no children
      if(current_node.right !== null && current_node.right.right === null && current_node.right.left === null ) {
        return current_node;
      }

      // current is largest and it has a left subtree. so whatever is the largest of that tree is second largest
      if(current_node.left !== null && current_node.right === null) {
        return findLargestAtNode(current_node.left);
      }

      current_node = current_node.right;

    }
	
    
  }, balance: function () {
    // balance the bst
    // https://en.wikipedia.org/wiki/Day%E2%80%93Stout%E2%80%93Warren_algorithm
    // http://www.geekviewpoint.com/java/bst/dsw_algorithm
    // http://penguin.ewu.edu/~trolfe/DSWpaper/
    // https://en.wikipedia.org/wiki/Tree_rotation

    // degenerate tree == one where the nodes only have one child
    // http://cobweb.cs.uga.edu/~eileen/2720/Notes/BST.ppt
    // http://www.radford.edu/~mhtay/ITEC360/webpage/Lecture/06_p2_new.pdf
    //
    // https://en.wikipedia.org/wiki/Binary_tree#Types_of_binary_trees
    //

    // page 252 of Data Structures and Algorithms in Java
    // https://github.com/DChaushev/Advanced-Data-Structures/blob/master/Day-Stout-Warren/src/BinarySearchTree.java
    // http://web.eecs.umich.edu/~qstout/pap/CACM86.pdf
    // http://courses.cs.vt.edu/cs2604/spring05/mcpherson/note/BalancingTrees.pdf
    
    if(root !== null) {
      var pseudoRoot = new Node(null);
      pseudoRoot.right = this.root;
      this.makeSortedLinkedList(pseudoRoot); // aka backbone, aka vine, or tree_to_vine
      this.makeCompleteBinaryTree(pseudoRoot, this.size()); // aka vine to tree
      this.root = pseudoRoot.right;
      pseudoRoot = null;
    }

  }, makeSortedLinkedList: function (startNode) {
   
    var tail = startNode;
    var rest = tail.right;

    while(rest !== null){

      if(rest.left === null){
        tail = rest;
        rest = rest.right;
      } else {
        var temp = rest.left;
        rest.left = temp.right;
        temp.right = rest;
        rest = temp;
        tail.right = temp;
      }
    }

  }, makeCompleteBinaryTree: function (startNode, size) {

    // aka greatestPowerOf2LessThanN 
    var numLeaves = size + 1 - Math.pow(2, Math.floor(Math.log(size + 1) / Math.log(2)));
    this.compress(startNode, numLeaves);

    size = size - numLeaves;

    while(size > 1){
      size = size >> 1;
      this.compress(startNode, size);
    }

  }, compress: function (startNode, count) {
     var scanner, child;
     scanner = startNode;

     for(var i = 0; i < count; i++){
        child = scanner.right;
        scanner.right = child.right;
        scanner = scanner.right;
        child.right = scanner.left;
        scanner.left = child; 
     }
  }

  //TODO: fun interview style question to code for later
  //print a binary search tree representation with / \ and such
};

module.exports = BST;
