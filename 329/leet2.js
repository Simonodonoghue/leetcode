/**
 * @param {number[][]} matrix
 * @return {number}
 */

var count = 0

var longestIncreasingPath = function (matrix) {

    var memory = {}

    count = 0

    var longestPath = 0

    for (var r = 0; r < matrix.length; r++) {
        for (var c = 0; c < matrix[0].length; c++) {

            if (!((r.toString() + "." + c.toString()) in memory)) {
                // we haven't visited this node
                var res = recursiveFind(matrix, r, c, memory)
                if (res > longestPath) {
                    longestPath = res
                }
            } else {
                console.log("skipping")
            }
        }
    }

    console.log(count)
    return longestPath

};

function recursiveFind(matrix, r, c, memory) {

    var longestPath = 0

    var stack = new Array(200)

    var sp = 0

    stack[sp++] = {
        r: r,
        c: c,
        hops: 1,
        paths: 0
    }

    var popCount = 0


    do {
        count++

        var item = stack[sp - 1]

        var itemString = item.r.toString() + "." + item.c.toString()

        if (popCount > 0 && (sp == 1 || stack[sp-2].paths == item.paths)) {

            // unravel whilst on same sub-path
            if (popCount > memory[itemString]) {
                memory[itemString] = popCount
            }

            popCount = memory[itemString]

            if (popCount > longestPath) {
                longestPath = popCount
            }

            popCount++
            sp--

        } else if (popCount > 0 && stack[sp-2].paths != item.paths) {
            // we've reached the end of a branch

            var dictString = stack[sp - 1 - item.paths].r.toString() + "." + stack[sp - 1 - item.paths].c.toString()
            
            if (popCount > memory[itemString]) {
                memory[itemString] = popCount
            }

            popCount = memory[itemString]

            var addHops = popCount + (item.hops - stack[sp - 1 - item.paths].hops)

            if (addHops > memory[dictString]) {
                memory[dictString] = addHops
            }

            if (addHops > longestPath) {
                longestPath = addHops
            }

            sp--
            popCount = 0

        } else if (!((itemString) in memory)) {
            memory[itemString] = 1

            var unravel = true
            var paths = 0

            if (item.r - 1 >= 0 && matrix[item.r - 1][item.c] > matrix[item.r][item.c]) {

                unravel = false
                stack[sp++] = {
                    r: item.r - 1,
                    c: item.c,
                    hops: item.hops + 1,
                    paths: ++paths
                }

            }

            if (item.r + 1 < matrix.length && matrix[item.r + 1][item.c] > matrix[item.r][item.c]) {

                unravel = false
                stack[sp] = {
                    r: item.r + 1,
                    c: item.c,
                    hops: item.hops + 1,
                    paths: ++paths
                }
                sp++

            }

            if (item.c - 1 >= 0 && matrix[item.r][item.c - 1] > matrix[item.r][item.c]) {

                unravel = false
                stack[sp++] = {
                    r: item.r,
                    c: item.c - 1,
                    hops: item.hops + 1,
                    paths: ++paths
                }

            }

            if (item.c + 1 < matrix[0].length && matrix[item.r][item.c + 1] > matrix[item.r][item.c]) {

                unravel = false
                stack[sp++] = {
                    r: item.r,
                    c: item.c + 1,
                    hops: item.hops + 1,
                    paths: ++paths
                }

            }

            if (unravel) {
                popCount++
            }
        } else {
       
            popCount = memory[itemString]
            
        }

    } while (sp > 0)

    return longestPath
}

longestIncreasingPath(
    [
        [9,9,4],
        [6,6,8],
        [2,1,1]
      ]  )