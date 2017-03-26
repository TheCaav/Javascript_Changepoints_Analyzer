# Javascript_Changepoints_Analyzer
## What does it do?
This library presents a function to analyze timeseries.
It searches for changes in slope based on linear regression.
All points where the slope changes are returned as an array up to a maximum.
## How good is it?
This library was created by a student of the KIT.
It does not work with statistic functions and thus is not capable of stopping at a threshhold of impropability for a changepoint to be found.
This means that the upper bound of Changepoints that should be found has to be set "manually". 
(It is passed as a value in the settings parameter)
What the library does tho, is returning the "strongest" changepoints first, which lets one filter out less important Changepoints by using a maxCount lower than the maximum amount of Changepoints needed to fully represent the timeseries with linear regressions.
The library should be able to even handle rather large amount of data.
With n = the amount of points the library should work within O(n * maxCount).
## What should be considered?
Same distances between the points of the timeseries should work perfectly.
(CP's cant be between those points!)
Changing distances between points might not work even if it should work in theory.
Negative values should also work perfectly.
## How to get it?
Will be available cia npm install in the future. 
Untill then just download it and import the module into your project.
## How to use it?
The library offers an analyze(dt: Datapoint[], settings: Settings): number[] method.
The Datapoint Interface needs an x Value for the time and y for the value.
The Settings Interface needs a maxCount Variable which should be > 1. 
It's the maximum amount of CP's to be returned.
The Settings Interface also needs an useSquared variable.
It's a boolean and enables the squared distance from the regression to be used for detection.
The method returns an array of numbers which are the changepoints.
The array is a subset of all the x values from dt.
## Problems, Suggestions and Contributions
If you find any bugs, have ideas for improvements or have own contributions (i dont seem to get the typedefs for typescript right), you can contact me at uuead@student.kit.edu.
I enjoy if my work is used in other projects so you might as well tell me if you use it as it might make me happy :D