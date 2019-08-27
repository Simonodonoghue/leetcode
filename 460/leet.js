/**
 * @param {number} capacity
 */
var LFUCache = function (capacity) {
    this.cacheDictionary = {}
    this.cacheStack = undefined
    this.capacity = capacity
    this.size = 0
};

/** 
 * @param {number} key
 * @return {number}
 */
LFUCache.prototype.get = function (key) {

    var item = this.cacheDictionary[key]

    if (item) {
        // the item exists
        this.updateFrequency(item)

        return item.value
    }

    return -1
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LFUCache.prototype.put = function (key, value) {

    if (this.capacity > 0) {

        var theItem = this.cacheDictionary[key]

        if (theItem == undefined) {

            // if we're full, we need to lose something.
            if (this.size == this.capacity) {

                this.size = this.size - 1

                var removeItem = this.cacheStack.bottomItem

                if (removeItem.nextItem == undefined) {
                    // if there's nothing next, the bucket will now be empty so set that state
                    removeItem.bucket.topItem = undefined
                    removeItem.bucket.bottomItem = undefined
                } else {
                    // reset the bottom but importantly remove the old bottom as the new bottoms previous
                    removeItem.bucket.bottomItem = removeItem.nextItem
                    removeItem.nextItem.prevItem = undefined
                }

                // if the bucket is now empty
                if (removeItem.bucket.topItem == undefined) {
                    // Remove the bucket by linking the previous and next bucket together (where they exist)
                    if (removeItem.bucket.prevBucket) {
                        removeItem.bucket.prevBucket.nextBucket = removeItem.bucket.nextBucket
                    } else {
                        // this is the root bucket so update the root
                        this.cacheStack = removeItem.bucket.nextBucket
                        if (this.cacheStack) {
                            this.cacheStack.prevBucket = undefined
                        }
                    }

                    if (removeItem.bucket.nextBucket) {
                        removeItem.bucket.nextBucket.prevBucket = removeItem.bucket.prevBucket
                    }

                }

                delete this.cacheDictionary[removeItem.key]
            }

            this.size++;

            var item = {
                key: key,
                value: value,
                bucket: undefined,
                nextItem: undefined,
                prevItem: undefined
            }

            this.cacheDictionary[key] = item

            if (this.cacheStack == undefined) {
                // we're just starting out, so we need to create the initial bucket with a frequency of 1
                this.cacheStack = {
                    frequency: 1,
                    topItem: item,
                    bottomItem: item,
                    nextBucket: undefined,
                    prevBucket: undefined
                }

                item.bucket = this.cacheStack
            } else {
                
                if (this.cacheStack.frequency != 1) {
                    // there is start, so check if the first bucket is a frequency of 1, it it isn't we need to add it and wire it in
                    var newBucket = {
                        frequency: 1,
                        topItem: item,
                        bottomItem: item,
                        nextBucket: this.cacheStack,
                        prevBucket: undefined
                    }

                    this.cacheStack.prevBucket = newBucket
                    this.cacheStack = newBucket

                    item.bucket = this.cacheStack
                } else {
                    // it already exists so append
                    item.prevItem = this.cacheStack.topItem
                    item.bucket = this.cacheStack
                    this.cacheStack.topItem.nextItem = item
                }
            }

            // as we're adding a new item, it's go a frequency of 1 so we'll need to set the base top item equal 
            // to the item we just created (as it's the most frequently accessed)
            this.cacheStack.topItem = item

        } else if (theItem) {
            // the item exists, so we need to update the value and add it to the next frequency bucket
            theItem.value = value
            this.updateFrequency(theItem)
        }

    }
};

LFUCache.prototype.updateFrequency = function (theItem) {
    
    // take the item out of the current frequency array
    if (theItem.prevItem == undefined) {
        // this is the bottom of the bucket
        if (theItem.nextItem) {
            // but it's not the only item in the bucket, so reset the bottom
            theItem.bucket.bottomItem = theItem.nextItem
            theItem.nextItem.prevItem = theItem.prevItem
        } else {
            // this is the only item in the bucket so we'll be removing the bucket
            theItem.bucket.topItem = undefined
            theItem.bucket.bottomItem = undefined
        }
    } else {
        // it's not the bottom
        if (theItem.nextItem) {
            // and there's something further on, so it's in the middle of two elements, so wire it in
            theItem.nextItem.prevItem = theItem.prevItem
            theItem.prevItem.nextItem = theItem.nextItem
        } else {
            // so it's the top of the bucket - reset the top
            theItem.prevItem.nextItem = undefined
            theItem.bucket.topItem = theItem.prevItem
        }
    }
    
    
    // if the bucket is now empty, we'll need to remove it and rewire - this replicates above and can be moved into a function
    if (theItem.bucket.topItem == undefined) {
        if (theItem.bucket.prevBucket) {
            theItem.bucket.prevBucket.nextBucket = theItem.bucket.nextBucket
        } else {
            // this is the root bucket so update the root
            this.cacheStack = theItem.bucket.nextBucket
            if (this.cacheStack) {
                this.cacheStack.prevBucket = undefined
            }
        }

        if (theItem.bucket.nextBucket) {
            theItem.bucket.nextBucket.prevBucket = theItem.bucket.prevBucket
        }

    }

    // We now need to add the item to the next frequency bucket given frequency + 1
    if (theItem.bucket.nextBucket) {
        // there is another bucket, check if it's the correct frequency
        if (theItem.bucket.frequency + 1 == theItem.bucket.nextBucket.frequency) {
            // we have a bucket of the correct frequency so add it
            theItem.bucket = theItem.bucket.nextBucket
            theItem.nextItem = undefined
            theItem.prevItem = theItem.bucket.topItem
            theItem.bucket.topItem.nextItem = theItem
            theItem.bucket.topItem = theItem
        } else {
            // it's not the right frequency so we need to add one this is in the middle
            var newBucket = {
                frequency: theItem.bucket.frequency + 1,
                topItem: undefined,
                bottomItem: undefined,
                nextBucket: theItem.bucket.nextBucket,
                prevBucket: undefined
            }

            theItem.bucket.nextBucket.prevBucket = newBucket

            if (theItem.bucket.topItem) {
                // if the current bucket still exists, splice in
                theItem.bucket.nextBucket = newBucket
                newBucket.prevBucket = theItem.bucket
            } else if (theItem.bucket.topItem == undefined && theItem.bucket.prevBucket == undefined) {
                // the current root bucket doesn't exist, so make the new bucket the root
                this.cacheStack = newBucket
            } else {
                // we're removing the bucket, but there's something at the start still (i.e. we're not removing the root)
                theItem.bucket.nextBucket = newBucket
                newBucket.prevBucket = theItem.bucket
            }
            
            theItem.bucket = newBucket
            
            // as we're adding a new bucket, set it as such
            theItem.nextItem = undefined
            theItem.prevItem = undefined
            theItem.bucket.topItem = theItem
            theItem.bucket.bottomItem = theItem

        }
    } else {
        // we don't have a bucket next so splice one in
        var bucket = {
            frequency: theItem.bucket.frequency + 1,
            topItem: undefined,
            bottomItem: undefined,
            nextBucket: undefined,
            prevBucket: undefined
        }

        if (this.cacheStack) {
            bucket.prevBucket = theItem.bucket
        }

        theItem.bucket.nextBucket = bucket
        theItem.bucket = bucket
        theItem.prevItem = undefined
        theItem.nextItem = undefined
        theItem.bucket.topItem = theItem
        theItem.bucket.bottomItem = theItem

        if (this.cacheStack == undefined) {
            this.cacheStack = bucket
        } 
    }
}


/**
 * Your LFUCache object will be instantiated and called as such:
 * var obj = new LFUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
