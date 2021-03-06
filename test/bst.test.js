'use strict';
var assert = require('chai').assert,
    bst = require('..'),
    util = require('util');

describe('bst', function()
{
    it('bst.createnode', function ()
    {
        var node = bst.createNode(10);
        assert.isObject(node);
        assert(node.value === 10, 'node.value === 10');
    });
    it('bst.createtree.nonodes', function ()
    {
        var root = bst.createTree([], []);
        assert.isUndefined(root);
    });
    it('bst.createtree.onenode', function ()
    {
        var root = bst.createTree([1], [1]);
        assert.isObject(root);
        assert(root.value === 1, 'root.value === 1');
        assert.isUndefined(root.left);
        assert.isUndefined(root.right);
    });
    it('bst.createtree.2nodes.leftonly', function ()
    {
        var root = bst.createTree([1, 2], [1, 2]);
        assert.isObject(root);
        assert(root.value === 2, 'root.value === 2');
        assert(root.left.value === 1, 'root.left.value === 1');
        assert.isUndefined(root.right);
    });
    it('bst.createtree.2nodes.rightonly', function ()
    {
        var root = bst.createTree([2, 3], [3, 2]);
        assert.isObject(root);
        assert(root.value === 2, 'root.value === 2');
        assert.isUndefined(root.left);
        assert(root.right.value === 3, 'root.right.value === 3');
    });
    it('bst.createtree.3nodes', function ()
    {
        var root = bst.createTree([1, 2, 3], [1, 3, 2]);
        assert.isObject(root);
        assert(root.value === 2, 'root.value === 2');
        assert(root.left.value === 1, 'root.left.value === 1');
        assert(root.right.value === 3, 'root.right.value === 3');
    });
    it('bst.createtree.morenodes', function ()
    {
        var inorder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        var postorder = [1, 3, 2, 5, 7, 6, 4, 9, 11, 10, 8];
        var root = bst.createTree(inorder, postorder);
        assert.isObject(root);
        var i2 = root.visitInOrder();
        var p2 = root.visitPostOrder();
        assert.deepEqual(i2, inorder);
        assert.deepEqual(p2, postorder);
    });
    it('node.isbst.true', function ()
    {
        var validBstTrees = [
            { inorder: [1], postorder: [1] },
            { inorder: [1, 2, 3], postorder: [1, 3, 2] }, 
            { inorder: [1, 2, 3, 4, 5, 6, 7], postorder: [1, 3, 2, 5, 7, 6, 4] }, // full bst
            { inorder: [1, 2, 3, 4, 5, 6, 7, 8], postorder: [1, 3, 2, 5, 7, 6, 4, 8] }, // node (8) with only left child
            { inorder: [0, 1, 2, 3, 4, 5, 6, 7], postorder: [1, 3, 2, 5, 7, 6, 4, 0] }, // node (0) with only right child
        ];
        validBstTrees.forEach(function (data)
        {
            assert.isTrue(bst.createTree(data.inorder, data.postorder).isBst());
        });
    });
    it('node.isbst.false', function ()
    {
        var invalidBstTrees = [
            { inorder: [2, 1, 3], postorder: [2, 3, 1] }, // left tree wrong
            { inorder: [1, 3, 2], postorder: [1, 2, 3] }, // right tree wrong
            { inorder: [1, 2, 5, 4, 6], postorder: [1, 5, 2, 6, 4] }, // node (5) placed wrong
            { inorder: [1, 4, 2, 5, 6], postorder: [1, 2, 6, 5, 4 ] }, // node(2) placed wrong
        ];
        invalidBstTrees.forEach(function (data)
        {
            assert.isFalse(bst.createTree(data.inorder, data.postorder).isBst());
        });
    });
    it('node.height', function ()
    {
        var testData = [
            { inorder: [1], postorder: [1], expectedHeight: 0 }, // root only
            { inorder: [1, 2, 3], postorder: [1, 3, 2], expectedHeight: 1 }, 
            { inorder: [1, 2], postorder: [1, 2], expectedHeight: 1 },
            { inorder: [1, 2, 3, 4, 5], postorder: [1, 2, 3, 5, 4], expectedHeight: 3 }, // left  skewed
            { inorder: [1, 2, 3, 4, 5], postorder: [1, 5, 4, 3, 2], expectedHeight: 3 }, // right skewed
            { inorder: [1, 2, 3, 4, 5, 6, 7], postorder: [1, 3, 2, 5, 7, 6, 4], expectedHeight: 2 }, // full
        ];
        testData.forEach(function (data)
        {
            assert.equal(bst.createTree(data.inorder, data.postorder).height(), data.expectedHeight, 
                util.format('test case failed: ', data)); 
        });
    });
    it('node.find', function ()
    {
        // find should findValue in tree
        var testData = [
            { inorder: [1], postorder: [1], findValue: 1 }, // root only
            { inorder: [1, 2, 3], postorder: [1, 3, 2], findValue: 1 }, 
            { inorder: [1, 2], postorder: [1, 2], findValue: 2 },
            { inorder: [1, 2, 3, 4, 5], postorder: [1, 2, 3, 5, 4], findValue: 3 }, // left  skewed
            { inorder: [1, 2, 3, 4, 5], postorder: [1, 5, 4, 3, 2], findValue: 5 }, // right skewed
            { inorder: [1, 2, 3, 4, 5, 6, 7], postorder: [1, 3, 2, 5, 7, 6, 4], findValue: 4 }, // full
        ];
        testData.forEach(function (data)
        {
            var tree = bst.createTree(data.inorder, data.postorder);
            var findNode = tree.find(data.findValue);
            assert.isDefined(findNode, util.format('test case failed: ', data));
            assert.equal(findNode.value, data.findValue, util.format('test case failed: ', data)); 
        });
        // find should not find the given invalid values
        testData.forEach(function (data)
        {
            var tree = bst.createTree(data.inorder, data.postorder);
            var findValues = [data.inorder[0] - 1, // less than min value
                data.inorder[data.inorder.length - 1] + 1, // max than max value 
                data.inorder[Math.floor(data.inorder.length / 2)] + 0.1 // greater than some element in middle
            ];
            findValues.forEach(function (findValue)
            {
                assert.isUndefined(tree.find(findValue), util.format('value (%d) must be absent from tree ', findValue, tree)); 
            });
        });
    });
    it('node.depth', function ()
    {
        // depth of the findValue node must equal expectedDepth
        var testData = [
            { inorder: [1], postorder: [1], findValue: 1, expectedDepth: 0 }, // root only
            { inorder: [1, 2, 3], postorder: [1, 3, 2], findValue: 1, expectedDepth: 1 }, 
            { inorder: [1, 2], postorder: [1, 2], findValue: 1, expectedDepth: 1 },
            { inorder: [1, 2, 3, 4, 5], postorder: [1, 2, 3, 5, 4], findValue: 1, expectedDepth: 3 }, // left  skewed
            { inorder: [1, 2, 3, 4, 5], postorder: [1, 5, 4, 3, 2], findValue: 5, expectedDepth: 3 }, // right skewed
            { inorder: [1, 2, 3, 4, 5, 6, 7], postorder: [1, 3, 2, 5, 7, 6, 4], findValue: 3, expectedDepth: 2 }, // full
        ];
        testData.forEach(function (data)
        {
            var tree = bst.createTree(data.inorder, data.postorder);
            var findNode = tree.find(data.findValue);
            assert.isDefined(findNode);
            assert.equal(findNode.depth(), data.expectedDepth, util.format('test case failed: ', data)); 
        });
    });
    it('node.lca', function ()
    {
        var testData = [
            { inorder: [1], postorder: [1], values: [1], lca: -1 },
            { inorder: [1, 2], postorder: [2, 1], values: [2], lca: 1 },
            { inorder: [1, 2, 3], postorder: [1, 3, 2], values: [1, 3], lca: 2 },    
            { inorder: [1, 2, 3, 4, 5], postorder: [1, 3, 2, 4, 5], values: [1, 2], lca: 4 },
            { inorder: [1, 2, 3, 4, 5, 6], postorder: [1, 3, 2, 4, 6, 5], values: [1, 2, 6], lca: 5 },
            { inorder: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], postorder: [1, 3, 2, 4, 7, 9, 8, 6, 5, 10], values: [1, 2, 7], lca: 5 },
            { inorder: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], postorder: [1, 3, 2, 5, 7, 6, 4, 9, 11, 10, 8, 12], values: [1, 3, 5], lca: 4 }, // lca at depth 2
        ];
        testData.forEach(function (data)
        {
            var tree = bst.createTree(data.inorder, data.postorder);
            var lca = tree.lca(data.values);
            var expectedLca = data.lca == -1 ? undefined : tree.find(data.lca);
            assert(lca === expectedLca, util.format('actual lca: %d expected lca: %d', lca ? lca.value : -1, data.lca));
        });
    });
});