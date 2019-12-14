/**
 * @param {number} target
 * @param {number} startFuel
 * @param {number[][]} stations
 * @return {number}
 */

var bestHops = -1
var startingFuel = 0

var minRefuelStops = function (target, startFuel, stations) {

    //console.log(stations)

    startingFuel = startFuel

    bestHops = -1

    // 0. Order the stations
    /*stations.sort(function (a, b) {
        if (a[0] > b[0]) {
            return 1
        } else if (a[0] < b[0]) {
            return -1
        }

        return 0
    })*/

    console.log(stations)

    // 1. Add target as a station at the end

    stations.push([target, 0])

    // 2. Create nodes and edges for a -> n (for inbound and outbound)

    stations.forEach(function (station, index) {

        var stationNode = {
            position: station[0],
            fuel: station[1],
            inboundEdges: [],
            outboundEdges: [],
            routeTable: {},
            calculated: false
        }

        station.push(stationNode)

        for (var i = index - 1; i >= 0; i--) {
            if (stations[i][0] < station[0]) {
                stationNode.inboundEdges.push(stations[i][2])
                stations[i][2].outboundEdges.push(stationNode)
            }
        }
    })

    // 3. Trigger target to calculate (which will trigger everything else to advertise)

    calculateRoutes(stations[stations.length - 1][2])

    return bestHops

};

function calculateRoutes(station) {

    // a route is a cost, a minimuim required fuel

    // 0. Get routes from each neighbor (if neighbor doesn't have routes, call calculateRoutes)
    if (station.outboundEdges.length == 0) {
        // This must be the target
        station.routeTable['0'] = 0
    } else {
        station.outboundEdges.forEach(function (neighbor) {
            if (!neighbor.calculated) {
                calculateRoutes(neighbor)
            }

            // 2. Update each route with own information and add to route table

            Object.keys(neighbor.routeTable).forEach(function (r) {
                var newRoute = {
                    hops: parseInt(r) + 1,
                    minRequiredFuel: (((neighbor.position - station.position) - station.fuel) + neighbor.routeTable[r.toString()]) > 0 ? (((neighbor.position - station.position) - station.fuel) + neighbor.routeTable[r.toString()]) : 0
                }

                if (newRoute.hops in station.routeTable) {
                    if (newRoute.minRequiredFuel < station.routeTable[newRoute.hops.toString()]) {
                        station.routeTable[newRoute.hops.toString()] = newRoute.minRequiredFuel
                    }
                } else if (bestHops == -1 || newRoute.hops < bestHops) {
                    station.routeTable[newRoute.hops.toString()] = newRoute.minRequiredFuel
                }

            })
        })
    }

    // 1. Filter out the bad, redundant routes

    station.calculated = true;

    // 3. Call advertiseRoutes
    advertiseRoutes(station)

}

function advertiseRoutes(station) {

    // 0. If you're accessible from the given startfuel, check if you have a route that's better than the current best route
    if (station.position <= startingFuel) {

        Object.keys(station.routeTable).forEach(function (h) {
            if ((startingFuel - station.position >= station.routeTable[h.toString()] && station.routeTable[h.toString()].hops < bestHops) || (startingFuel - station.position >= station.routeTable[h.toString()] && bestHops == -1)) {
                bestHops = parseInt(h)
            }
        })
    }

    // 1. For each inbound route, call calculateRoutes - could we cause an infinite loop here?...
    station.inboundEdges.forEach(function (neighbor) {
        if (!neighbor.calculated) {
            calculateRoutes(neighbor)
        }
    })
}


minRefuelStops(1000,
    36,
    [[7, 13], [10, 11], [12, 31], [22, 14], [32, 26], [38, 16], [50, 8], [54, 13], [75, 4], [85, 2], [88, 35], [90, 9], [96, 35], [103, 16], [115, 33], [121, 6], [123, 1], [138, 2], [139, 34], [145, 30], [149, 14], [160, 21], [167, 14], [188, 7], [196, 27], [248, 4], [256, 35], [262, 16], [264, 12], [283, 23], [297, 15], [307, 25], [311, 35], [316, 6], [345, 30], [348, 2], [354, 21], [360, 10], [362, 28], [363, 29], [367, 7], [370, 13], [402, 6], [410, 32], [447, 20], [453, 13], [454, 27], [468, 1], [470, 8], [471, 11], [474, 34], [486, 13], [490, 16], [495, 10], [527, 9], [533, 14], [553, 36], [554, 23], [605, 5], [630, 17], [635, 30], [640, 31], [646, 9], [647, 12], [659, 5], [664, 34], [667, 35], [676, 6], [690, 19], [709, 10], [721, 28], [734, 2], [742, 6], [772, 22], [777, 32], [778, 36], [794, 7], [812, 24], [813, 33], [815, 14], [816, 21], [824, 17], [826, 3], [838, 14], [840, 8], [853, 29], [863, 18], [867, 1], [881, 27], [886, 27], [894, 26], [917, 3], [953, 6], [956, 3], [957, 28], [962, 33], [967, 35], [972, 34], [984, 8], [987, 12]])