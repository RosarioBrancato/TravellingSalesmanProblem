class TSPAlgorithm {

    constructor(markers, start) {
        this.markers = markers;
        this.start = start;

        this.solutions = [];
    }

    calculate() {
        var markersLength = this.markers.length;

        this.distances = new Array(markersLength);

        var i, k;
        for (i = 0; i < markersLength; i++) {
            this.distances[i] = new Array(markersLength);

            for (k = 0; k < markersLength; k++) {
                var distance = google.maps.geometry.spherical.computeDistanceBetween(this.markers[i].getPosition(), this.markers[k].getPosition());
                if (distance == 0) {
                    //-1 equals infinity
                    distance = -1;
                }
                this.distances[i][k] = distance;
            }
        }

        var indicesUsed = new Array(this.distances.length);
        this.calculateCosts(this.cloneArray2D(this.distances), 0, this.cloneArray1D(indicesUsed), -1, this.start, 0);
    }

    calculateCosts(prevReducedArray, prevCosts, indicesUsed, prevIndex, newIndex, newPosition) {
        var i;
        var k;
        var genLength = this.distances.length;

        var minRow = new Array(genLength);
        var minCol = new Array(genLength);

        //COSTS
        var costs = 0;

        //SET PREVIOUS PATHS TO INFINITY (-1)
        if (newPosition > 0) {
            //cost from prevIndex(row) and newIndex(col)
            costs = prevReducedArray[prevIndex][newIndex];

            //costs of last node
            costs += prevCosts;

            //make row of prevIndex to infinity
            for (k = 0; k < genLength; k++) {
                prevReducedArray[prevIndex][k] = -1;
            }

            //make col of newIndex to infinity
            for (i = 0; i < genLength; i++) {
                prevReducedArray[i][newIndex] = -1;
            }

            //you cannot jump back so make the distance to infinity
            prevReducedArray[newIndex][prevIndex] = -1;
        }

        //FIND MIN DISTANCES PER ROW
        for (i = 0; i < genLength; i++) {

            var min = null;
            for (k = 0; k < prevReducedArray[i].length; k++) {
                var distance = prevReducedArray[i][k];
                if (distance != -1) {
                    if (min == null) {
                        min = distance;

                    } else if (min > distance) {
                        min = distance;
                    }
                }
            }

            if (min == null) {
                min = 0;
            }
            minRow[i] = min;
        }

        //CLONE AND REDUCE ARRAY
        var reducedArray = new Array(genLength);
        for (i = 0; i < genLength; i++) {
            reducedArray[i] = new Array(genLength);
            var reduction = minRow[i];

            for (k = 0; k < genLength; k++) {
                var distance = prevReducedArray[i][k];

                if (distance != -1) {
                    var result = (distance - reduction);
                    reducedArray[i][k] = result;
                } else {
                    reducedArray[i][k] = -1;
                }
            }
        }

        for (i = 0; i < minRow.length; i++) {
            costs += minRow[i];
        }

        //FIND MIN DISTANCES PER COL
        for (k = 0; k < genLength; k++) {
            var min = null;

            for (i = 0; i < genLength; i++) {
                var distance = reducedArray[i][k];
                if (distance != -1) {
                    if (min == null) {
                        min = distance;

                    } else if (min > distance) {
                        min = distance;
                    }
                }
            }

            if (min == null) {
                min = 0;
            }
            minCol[k] = min;
        }

        //REDUCE CLONED ARRAY BY COL
        for (k = 0; k < genLength; k++) {
            for (i = 0; i < genLength; i++) {
                var distance = reducedArray[i][k];

                if (distance != -1) {
                    reducedArray[i][k] = distance - minCol[k];
                } else {
                    reducedArray[i][k] = -1;
                }
            }
        }

        //COSTS
        for (i = 0; i < genLength; i++) {
            costs += minCol[i];
        }


        //SET UP FOR RECURSION
        indicesUsed[newIndex] = newPosition;

        for (i = 0; i < this.solutions.length; i++) {
            if (costs > this.solutions[i].totalCosts) {
                return;
            }
        }

        if (newPosition < (genLength - 1)) {
            for (i = 0; i < genLength; i++) {
                var pos = indicesUsed[i];

                if (pos == null) {
                    this.calculateCosts(this.cloneArray2D(reducedArray), costs, this.cloneArray1D(indicesUsed), newIndex, i, (newPosition + 1));
                }
            }

        } else {
            //END OF RECURSION - ADD SOLUTION
            this.solutions.push(new Solution(costs, indicesUsed));
        }
    }

    cloneArray1D(arrayToClone) {
        var cloned = new Array(arrayToClone.length);
        var p;

        for (p = 0; p < arrayToClone.length; p++) {
            cloned[p] = arrayToClone[p];
        }

        return cloned;
    }

    cloneArray2D(arrayToClone) {
        var cloned = new Array(arrayToClone.length);
        var p, q;

        for (p = 0; p < arrayToClone.length; p++) {
            cloned[p] = new Array(arrayToClone[p].length);

            for (q = 0; q < arrayToClone[p].length; q++) {
                cloned[p][q] = arrayToClone[p][q];
            }
        }

        return cloned;
    }

}
