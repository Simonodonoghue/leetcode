var expectedSolution = require('./968')
var actualSoltution = require('./968-broken')


var runs = 0

while (true) {
    var root = createTree(5);

    //console.log(JSON.stringify(root))     

    var exepctedRes = expectedSolution.minCameraCover(root)
    var actualRes = actualSoltution.minCameraCover(root)

    if (exepctedRes != actualRes) {
        break;
    }

    runs++
}

console.log("Took " + runs + " to find an error")


//console.log("expected result: " + exepctedRes)
//console.log("actual result: " + actualRes)

function createTree(numberOfNodes) {
    var root = {}
    var nodes = []

    nodes.push(root)

    numberOfNodes = Math.floor(Math.random()*(numberOfNodes-1))

    while (numberOfNodes > 0) {
        var leftOrRight = Math.floor(Math.random()*2);
        
        var selectedNode = getRandomNode(nodes)

        var newNode = { val: 0 }

        if (leftOrRight == 0 && !selectedNode.left) {
            selectedNode.left = newNode
            nodes.push(newNode)
            numberOfNodes--;                
        } else if (!selectedNode.right) {
            selectedNode.right = newNode
            nodes.push(newNode)
            numberOfNodes--;
        }
    }

    return root
}

function getRandomNode(nodes) {
    return nodes[Math.floor(Math.random()*nodes.length)];
}

