(function () {
    'use strict';
    function Analyzer() {
        var changepointsAnalyzer = {};
        var settings = {
            maxCount: 100,
            useSquared: false
        };

        changepointsAnalyzer.analyze = function (list) {
            // functions needed
            calcCost = function (arr) {
                let res = 0;
                for (const item of arr) {
                    res += item;
                }
                return res;
            };

            calcPlace = function (arr, index) {
                for (let i = 0; i < arr.length; i++) {
                    if (index < arr[i]) {
                        return i - 1;
                    }
                }
            };

            calcSegmentBounds = function (arr, place) {
                for (let i = 0; i < arr.length; i++) {
                    if (place < arr[i]) {
                        return [arr[i - 1], arr[i]];
                    }
                }
            };

            calcLinRegCost = function (arr) {
                if (arr.length === 1) {
                    return 0;
                }
                // initialize values
                let gradient = 0;
                let yIntercept = 0;
                let coefficient = 0;

                let sumYX = 0;
                let sumY = 0;
                let sumX = 0;
                let sumXX = 0;

                const line = [];
                // calculate needed values
                for (const i of arr) {
                    sumYX += i.y * i.x;
                    sumY += i.y;
                    sumX += i.x;
                    sumXX += i.x * i.x;
                }

                coefficient = arr.length * sumXX - sumX * sumX;
                gradient = (arr.length * sumYX - sumX * sumY) / coefficient;
                yIntercept = (sumXX * sumY - sumYX * sumX) / coefficient;

                // calculate the linear regression and save it in line
                for (const i of arr) {
                    line.push({ y: gradient * i.x + yIntercept });
                }
                // calculate the sum of distances of the linReg from the data
                let result = 0;
                for (let i = 0; i < arr.length; i++) {
                    if (settings.useSquared) {
                        result += (line[i].y - dt[i].y) * (line[i].y - dt[i].y);
                    } else {
                        result += Math.abs(line[i].y - dt[i].y);
                    }
                }
                return result;
            };

            calcSegments = function (arr) {
                // initialize working data
                let temp = -1;
                let tempCP = -1;
                let tempReduction = -1;
                let tempSegmentCosts = [];
                const changePoints = [];
                // calculates cost of whole data Array
                const allCost = calcLinRegCost(arr);
                // Initialize bounds of segments with bounds of whole array
                const bounds = [0, arr.length];
                // Initialize costs of segments with cost of entire segment
                let segmentCosts = [allCost];
                // tries to add ChangePoint up to maxCount times
                for (let times = 0; times < settings.maxCount; times++) {
                    // iterates through all possible changepoint locations and checks if it lowers
                    // the overall segment costs
                    for (let i = 0; i < arr.length - 1; i++) {
                        // checks if datapoint is already a CP and ignores calculation for it if it is.
                        if (tempCP === arr[i].$year) {
                            continue;
                        }
                        // calculate bounds of the segment, the current elements is in
                        const tempBounds = calcSegmentBounds(bounds, i);
                        // calculate the new segment costs of the splitted segment the element is in
                        const seg1 = calcLinRegCost(arr.slice(tempBounds[0], i + 1));
                        const seg2 = calcLinRegCost(arr.slice(i + 1, tempBounds[1]));
                        // copies old segment costs to a new array
                        const newSegmentCosts = segmentCosts.slice(0, segmentCosts.length);
                        // calculates the place the new segment cost need to be inserted
                        const place = calcPlace(bounds, i);
                        // inserts new segment costs and removes the segment cost of the splitted segment
                        newSegmentCosts.splice(place, 1, seg1, seg2);
                        // calculates the cost reduction of the current segmentation, compared to the cost
                        // of the entire array
                        const newRed = allCost - calcCost(newSegmentCosts);
                        // checks if the new segmentation improves the cost reduction more then previous segmentations
                        // and stores neccessary info if it does
                        if (newRed > tempReduction) {
                            tempReduction = newRed;
                            temp = i;
                            tempCP = arr[i].$year;
                            tempSegmentCosts = newSegmentCosts;
                        }
                    }
                    // checks if the found CP is already added
                    let alreadyAdded;
                    for (const cp of changePoints) {
                        if (cp === tempCP) {
                            alreadyAdded = true;
                        }
                    }
                    // stops calculations if no new CP has been added
                    if (alreadyAdded) {
                        break;
                    }
                    // adds the CP found in the iteration
                    changePoints.push(tempCP);
                    bounds.push(temp);
                    bounds.sort();
                    segmentCosts = tempSegmentCosts;
                }
                return changePoints;
            };
            return calcSegments(list);
        };

        changepointsAnalyzer.setSettings = function (maxCount, useSquared) {
            settings.maxCount = maxCount;
            settings.useSquared = useSquared;
        };

        return changepointsAnalyzer;
    }
}());