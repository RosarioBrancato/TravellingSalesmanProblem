class TSPAlgorithm {

    constructor(markers, start) {
        this.markers = markers;
        this.start = start;
    }

    calculateDistances() {
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

        console.log(this.distances);

        this.calculateFirstCost();
    }

    calculateFirstCost() {
        var i;
        var k;
        var genLength = this.distances.length;

        var minRow = new Array(genLength);
        var minCol = new Array(genLength);

        //FIND MIN DISTANCES PER ROW
        for (i = 0; i < genLength; i++) {

            var min = null;
            for (k = 0; k < this.distances[i].length; k++) {
                var distance = this.distances[i][k];
                if (distance != -1) {
                    if (min == null) {
                        min = distance;

                    } else if (min > distance) {
                        min = distance;
                    }
                }
            }

            minRow[i] = min;
        }

        console.log("get min value of rows");
        console.log(minRow);

        //CLONE AND REDUCE ARRAY
        var reducedArray = new Array(genLength);
        for (i = 0; i < genLength; i++) {
            reducedArray[i] = new Array(genLength);

            for (k = 0; k < genLength; k++) {
                var distance = this.distances[i][k];

                if (distance != -1) {
                    reducedArray[i][k] = this.distances[i][k] - minRow[i];
                } else {
                    reducedArray[i][k] = -1;
                }
            }
        }

        console.log("Corrected Array");
        console.log(reducedArray);

        //COSTS
        var costs = 0;

        for (i = 0; i < minRow.length; i++) {
            costs += minRow[i];
        }

        console.log("Costs :" + costs);

        //FIND MIN DISTANCES PER ROW
        for (i = 0; i < this.distances.length; i++) {

            var min = null;
            for (k = 0; k < this.distances[i].length; k++) {
                var distance = this.distances[k][i];
                if (distance != -1) {
                    if (min == null) {
                        min = distance;

                    } else if (min > distance) {
                        min = distance;
                    }
                }
            }

            minCol[i] = min;
        }
        
        console.log("get min value of cols");
        console.log(minCol);

        //COSTS
        for (i = 0; i < genLength; i++) {
            costs += minCol[i];
        }
        console.log("Costs :" + costs);

        this.startCosts = costs;

        this.calculateSubCosts(reducedArray);
    }

    calculateSubCosts(reducedArray) {
        //TO-DO
    }

}
