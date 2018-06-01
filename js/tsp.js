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

        //console.log(this.distances);

        var indicesUsed = new Array(this.distances.length);
        //console.log(indicesUsed);
        this.calculateCosts(this.cloneArray2D(this.distances), 0, this.cloneArray1D(indicesUsed), -1, this.start, 0);

        //console.log("THE SOLUTIONS");
        //console.log(this.solutions);
    }

    calculateCosts(prevReducedArray, prevCosts, indicesUsed, prevIndex, newIndex, newPosition) {
        //console.log("VARIABLES");
        //console.log(prevReducedArray);
        //console.log("PrevCosts: " + prevCosts);
        //console.log(indicesUsed);
        //console.log("PrevIndex: " + prevIndex);
        //console.log(newIndex);
        //console.log("Position: " + newPosition);

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
            //console.log("Akt. in Arr: " + costs);

            //costs of last node
            costs += prevCosts;
            //console.log("Akt. Costs: " + costs);

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

            //console.log("prevReducedArray");
            //console.log(prevReducedArray);
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

        //console.log("get min value of rows");
        //console.log(minRow);

        //CLONE AND REDUCE ARRAY
        var reducedArray = new Array(genLength);
        for (i = 0; i < genLength; i++) {
            reducedArray[i] = new Array(genLength);
            var reduction = minRow[i];
            //console.log("Reduction: " + reduction);

            for (k = 0; k < genLength; k++) {
                var distance = prevReducedArray[i][k];
                //console.log("Distance: " + distance);

                if (distance != -1) {
                    var result = (distance - reduction);
                    //console.log("Result: " + result);
                    reducedArray[i][k] = result;
                } else {
                    reducedArray[i][k] = -1;
                }
            }
        }

        //console.log("Reduced Array");
        //console.log(reducedArray);


        for (i = 0; i < minRow.length; i++) {
            costs += minRow[i];
        }

        //console.log("Costs :" + costs);

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

        //console.log("get min value of cols");
        //console.log(minCol);

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
        //console.log("Reduced Array");
        //console.log(reducedArray);

        //COSTS
        for (i = 0; i < genLength; i++) {
            costs += minCol[i];
        }
        //console.log("Costs: " + costs);


        //SET UP FOR RECURSION
        indicesUsed[newIndex] = newPosition;

        for (i = 0; i < this.solutions.length; i++) {
            if (costs > this.solutions[i].totalCosts) {
                //console.log("RETURN");
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
            //console.log("SOLUTION FOUND");
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
