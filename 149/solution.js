/**
 * @param {number[][]} points
 * @return {number}
 */
var maxPoints = function (points) {

    var lines = {
        collisionMap: {},
        lines: []
    }

    var change = true

    while (change) {
        change = false
        for (var x = 0; x < points.length; x++) {

            var pointString = points[x][0] + ',' + points[x][1] + ',' + x

            for (var line = 0; line < lines.lines.length; line++) {

                if (determineIfOnSlope(lines.lines[line].points, points[x])) {
                    // if on the same slope, add to point to the line
                    if (!(pointString in lines.lines[line].collisionMap)) {
                        lines.lines[line].points.push(points[x])
                        lines.lines[line].collisionMap[pointString] = points[x]
                        change = true
                    }
                }

            }

            // Add this point as the potential start of a line going forward
            // Check we've not started a line for this point
            if (!(pointString in lines.collisionMap)) {
                var addPoint = {
                    collisionMap: {},
                    points: [points[x]]
                }

                addPoint.collisionMap[pointString] = points[x]
                lines.lines.push(addPoint)
                lines.collisionMap[pointString] = points[x]

                change = true
            }

        }
    }

    // find the max length
    var maxLength = 0

    for (var x = 0; x < lines.lines.length; x++) {
        if (lines.lines[x].points.length > maxLength) {
            maxLength = lines.lines[x].points.length
        }
    }

    console.log(maxLength)
    return maxLength

};


function determineIfOnSlope(line, point) {

    if (line.length == 1) {
        // it's not a line yet, so let's start one
        return true
    } else if (isInArray(line, point) > -1) {
        return true
    } else {
        if (allXSame(line) && line[0][0] == point[0]) {
            return true
        } else if (allYSame(line) && line[0][1] == point[1]) {
            return true
        } else {

            var existingSlope = ((line[0][1] - line[1][1]) / (line[0][0] - line[1][0]))

            // find test point that isn't 0,0
            var i = 0
            var found = false
            for (i = 0; i < line.length; i++) {
                if (line[i][0] != 0 && line[i][1] != 0) {
                    found = true
                    break
                }
            }

            if (!found) {
                i = 0
            }

            var testSlope = ((line[i][1] - point[1]) / (line[i][0] - point[0]))

            if (existingSlope == testSlope) {
                return true
            }
        }
    }

    return false
}

function precision(a) {
    if (!isFinite(a)) return 0;
    var e = 1, p = 0;
    while (Math.round(a * e) / e !== a) { e *= 10; p++; }
    return p;
  }

function allXSame(line) {

    var x = line[0][0]

    for (var i = 0; i < line.length; i++) {
        if (line[i][0] != x) {
            return false
        }
    }

    return true
}

function allYSame(line) {

    var y = line[0][1]

    for (var i = 0; i < line.length; i++) {
        if (line[i][1] != y) {
            return false
        }
    }

    return true
}

function isInArray(array, point) {
    for (var x = 0; x < array.length; x++) {
        if (array[x][0] == point[0] && array[x][1] == point[1]) {
            return x
        }
    }

    return -1
}