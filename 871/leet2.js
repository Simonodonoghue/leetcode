/**
 * @param {number} target
 * @param {number} startFuel
 * @param {number[][]} stations
 * @return {number}
 */


var bestHops = -1

var minRefuelStops = function (target, startFuel, stations) {

    if (target <= startFuel) {
        return 0
    }

    bestHops = -1

    for (var i = 0; i < stations.length && stations[i][0] <= startFuel; i++) {
        // each station that can be reached from start fuel

        recurseNode(stations, i, target, startFuel - stations[i][0], 0)
    }

    return bestHops

};


function recurseNode(stations, i, target, remainingFuel, hops) {

    hops++

    if (hops < bestHops || bestHops == -1) {
        var fuel = remainingFuel + stations[i][1]

        // first check - can we we reach the target
        if (fuel + stations[i][0] >= target && (bestHops == -1 || hops < bestHops)) {
            bestHops = hops
            return 0
        }

        var minNeededToGoOn = -1

        var x;

        // visit each possible node given fuel
        for (x = i + 1; x < stations.length && (stations[x][0] - stations[i][0]) <= fuel; x++) {

            if (stations[x].length == 2 || (stations[x].length == 4 && (fuel > stations[x][2] || hops < stations[x][3]))) {

                var neededToGoOn = recurseNode(stations, x, target, fuel - (stations[x][0] - stations[i][0]), hops)

                if (neededToGoOn != -1 && (minNeededToGoOn == -1 || neededToGoOn < minNeededToGoOn)) {
                    minNeededToGoOn = neededToGoOn
                }

            } else {
                if (fuel - (stations[x][0] - stations[i][0]) < 0 && (fuel - (stations[x][0] - stations[i][0])) * -1 < minNeededToGoOn) {
                    minNeededToGoOn = (fuel - (stations[x][0] - stations[i][0])) * -1
                }
            }

        }

        if (minNeededToGoOn == -1) {
            // we couldn't even make it to the next station
            minNeededToGoOn = (fuel - (stations[i+1][0] - stations[i][0])) * -1
        }

        // update my block value
        if (stations[i].length == 2) {
            stations[i].push(0)
            stations[i].push(0)
        }

        stations[i][2] = minNeededToGoOn
        stations[i][3] = hops

        return minNeededToGoOn

    }

    return remainingFuel

}


minRefuelStops(1000,
    36,
    [[7,13],[10,11],[12,31],[22,14],[32,26],[38,16],[50,8],[54,13],[75,4],[85,2],[88,35],[90,9],[96,35],[103,16],[115,33],[121,6],[123,1],[138,2],[139,34],[145,30],[149,14],[160,21],[167,14],[188,7],[196,27],[248,4],[256,35],[262,16],[264,12],[283,23],[297,15],[307,25],[311,35],[316,6],[345,30],[348,2],[354,21],[360,10],[362,28],[363,29],[367,7],[370,13],[402,6],[410,32],[447,20],[453,13],[454,27],[468,1],[470,8],[471,11],[474,34],[486,13],[490,16],[495,10],[527,9],[533,14],[553,36],[554,23],[605,5],[630,17],[635,30],[640,31],[646,9],[647,12],[659,5],[664,34],[667,35],[676,6],[690,19],[709,10],[721,28],[734,2],[742,6],[772,22],[777,32],[778,36],[794,7],[812,24],[813,33],[815,14],[816,21],[824,17],[826,3],[838,14],[840,8],[853,29],[863,18],[867,1],[881,27],[886,27],[894,26],[917,3],[953,6],[956,3],[957,28],[962,33],[967,35],[972,34],[984,8],[987,12]])