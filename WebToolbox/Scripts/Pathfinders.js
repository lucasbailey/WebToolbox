function PathFinders(thePatternAry, bolMinPath) {
    var ctx = this;
    var START_VALUE = 2, END_VALUE = 3;

    var options = {
        pattern: thePatternAry,
        MinPath: (bolMinPath == null || typeof bolMinPath == 'undefined' ? false : bolMinPath)
    }

    //var patternArry = thePatternAry;

    ctx.FindValidPaths = function (callbackSuccess, callbackFail) {
        var ajaxParams = {
            urlAddress: "/Paths.asmx/GetPathInfo",
            requestType: "POST",
            requestParams: "strOptions=" + JSON.stringify(options),
            success: function (xmlhttp) {
                var theResponse = ResponseSanitize(xmlhttp.responseText);

                callbackSuccess(theResponse);
            },

            fail: function (xmlhttp) {
                if (callbackFail != null) {
                    var theResponse = ResponseSanitize(xmlhttp);

                    callbackFail(theResponse);
                }
        }
    }
        var startTime = new Date();
    ajax(ajaxParams);
};
//var urlAddress = objExists(paramsObj.urlAddress, paramsObj.urlAddress, "");
//var requestType = objExists(paramsObj.requestType, paramsObj.requestType, "GET");
//var requestParams = objExists(paramsObj.requestParams, paramsObj.requestParams, "");
//var bolAsync = objExists(paramsObj.bolAsync, paramsObj.bolAsync, true);
//var success = objExists(paramsObj.success, paramsObj.success, null);
//var successArgs = objExists(paramsObj.successArgs, paramsObj.successArgs, null);
    
//var fail = objExists(paramsObj.fail, paramsObj.fail, DisplayCustomError);
//var failArgs = objExists(paramsObj.failArgs, paramsObj.failArgs, null);

//var ajaxParams = {
//    urlAddress: "/Paths.asmx/GetPathInfo",
//    success: function (xmlhttp) {
//        menuItems = JSON.parse(xmlhttp.responseText);
//        var test = 0;

//        AddMenuItems();
//    }
//}

//ajax(ajaxParams);
}

//function PathFinders(thePatternAry) {
//    var ctx = this;
//    var START_VALUE = 2, END_VALUE = 3;

//    var patternArry = thePatternAry;
//        //[
//        //    [1, 0, 0, 0, 0, 0, 0],
//        //    [1, 0, 1, 1, 1, 0, 0],
//        //    [1, 0, 0, 0, 1, 0, 0],
//        //    [1, 0, 0, 0, 1, 1, 0],
//        //    [1, 0, 0, 0, 1, 0, 0],
//        //    [1, 1, 1, 0, 1, 0, 0],
//        //    [1, 0, 0, 0, 1, 0, 0],
//        //    [1, 3, 0, 1, 1, 2, 0]
//        //];
//        //[
//        //    [3, 0, 0],
//        //    [0, 0, 2]
//        //];

//    function _Point(x, y) {
//        return {
//            x: x,
//            y: y,
//            isEqual: function (newPoint) {
//                if (newPoint.x == this.x && newPoint.y == this.y) {
//                    return true;
//                }
//                else
//                    return false;
//            }
//        };
//    }

//    ctx.FindValidPaths = function () {
//        var startPoint = ctx.FindStartPoint();
//        var endPoint = ctx.FindEndPoint();
//        var PathAry = [];

//        //move left
//        if (ctx.IsDestinationValid(startPoint, -1, 0))
//            PathAry = PathAry.concat(_doMove(startPoint, endPoint, -1, 0));

//        //move right
//        if (ctx.IsDestinationValid(startPoint, 1, 0))
//            PathAry = PathAry.concat(_doMove(startPoint, endPoint, 1, 0));

//        //move up
//        if (ctx.IsDestinationValid(startPoint, 0, -1))
//            PathAry = PathAry.concat(_doMove(startPoint, endPoint, 0, -1));

//        //move down
//        if (ctx.IsDestinationValid(startPoint, 0, 1))
//            PathAry = PathAry.concat(_doMove(startPoint, endPoint, 0, 1));

//        return PathAry;
//    }

//    //input is an array of arrays of points along the path
//    ctx.FindFirstShortestPath = function (PathAry) {
//        var shortIndex= null, shortLength = null;
        
//        for (var i = 0; i < PathAry.length; i++){
//            if (shortLength == null || PathAry[i].length < shortLength) {
//                shortLength = PathAry[i].length;
//                shortIndex = i;
//            }
//            //else {
//            //    if (pathAry[i].length < shortLength) {

//            //    }
//            //}
//        }

//        return PathAry[shortIndex];
//    }

//    //input is an array of arrays of points along the path
//    ctx.FindFirstLongestPath = function (PathAry) {
//        var longIndex = null, longLength = null;

//        for (var i = 0; i < PathAry.length; i++) {
//            if (longLength == null || PathAry[i].length > longLength) {
//                longLength = PathAry[i].length;
//                longIndex = i;
//            }
           
//        }

//        return PathAry[longIndex];
//    }


//    ctx.Point = function (x, y) {
//        x = (x == null || typeof x == 'undefined' ? 0 : x);
//        y = (y == null || typeof y == 'undefined' ? 0 : y);

//        return _Point(x, y);
//    };

//    ctx.FindStartPoint = function () {
//        return _FindByValue(START_VALUE);
//    };

//    ctx.FindEndPoint = function () {
//        return _FindByValue(END_VALUE);
//    };
//    var doMoveIteration = 0;
//    function _doMove(originalPoint, endPoint, xMove, yMove, currentPath) {
//        var PathAry = [];
//        doMoveIteration++;
//        //store the current Point in the path
//        var startPoint = new _Point(originalPoint.x + xMove, originalPoint.y + yMove);

//        if (currentPath == null || typeof currentPath == 'undefined') {
//            currentPath = new Path(originalPoint, endPoint, ctx);

//            //check if startpoint and endpoint are the same...no need to go further if it is
//            if (startPoint.isEqual(endPoint)) {
//                PathAry[PathAry.length] = currentPath.getPath();
//                //return PathAry;
//            }
//        }

//        var wasPointAdded = currentPath.addPoint(startPoint);
//        if (!wasPointAdded) {
//            return PathAry;//if we didn't add the point because it already existed, exit this iteration
//        }        

//        var downValid, upValid, leftValid, rightValid,
//            downPath = currentPath.CopyPath(),
//            upPath = currentPath.CopyPath(),
//            leftPath = currentPath.CopyPath(),
//            rightPath = currentPath.CopyPath();

//        downValid = upValid = leftValid = rightValid = false;

//        var steps = [
//            {//move left
//                xMove: -1,
//                yMove: 0,
//                path: leftPath,
//                isValid: false
//            },
//            {
//                //move right
//                xMove: 1,
//                yMove: 0,
//                path: rightPath,
//                isValid: false
//            },
//            {
//                //move up
//                xMove: 0,
//                yMove: -1,
//                path: upPath,
//                isValid: false
//            },
//            {
//                //move down
//                xMove: 0,
//                yMove: 1,
//                path: downPath,
//                isValid: false
//            }]
//        if (doMoveIteration > 1000000) {
//            //return PathAry;
//        }

        

//        for (var i = 0; i < steps.length; i++) {
//            if (ctx.IsDestinationValid(startPoint, steps[i].xMove, steps[i].yMove) && !currentPath.getValid()) {
//                var thePoint = new _Point(startPoint.x + steps[i].xMove, startPoint.y + steps[i].yMove);

//                if (!currentPath.FindPointInPath(thePoint)) {
//                    steps[i].isValid = true;

//                    var newPath = _doMove(startPoint, endPoint, steps[i].xMove, steps[i].yMove, steps[i].path);

//                    PathAry = PathAry.concat(newPath);

//                    if (steps[i].path.isValid) {//only add the paths where the path finds the endpoint
//                        PathAry = PathAry.concat([steps[i].path.getPath()]);
//                    }
//                }
//            }
//        }

//        //////move left
//        ////xMove = -1;
//        ////yMove = 0;
//        //if (ctx.IsDestinationValid(startPoint, xMove, yMove) && !currentPath.getValid()) {
//        //    leftValid = true;
//        //    //leftPath = 
//        //    PathAry = PathAry.concat(_doMove(startPoint, endPoint, xMove, yMove, leftPath));
//        //}

//        //////move right
//        ////xMove = 1;
//        ////yMove = 0;
//        //if (ctx.IsDestinationValid(startPoint, xMove, yMove) && !currentPath.getValid()) {
//        //    rightValid = true;
//        //    //rightPath = 
//        //    PathAry = PathAry.concat(_doMove(startPoint, endPoint, xMove, yMove, rightPath));
//        //}

//        //////move up
//        ////xMove = 0;
//        ////yMove = -1;
//        //if (ctx.IsDestinationValid(startPoint, xMove, yMove) && !currentPath.getValid()) {
//        //    upValid = true;
//        //    //upPath = 
//        //    PathAry = PathAry.concat(_doMove(startPoint, endPoint, xMove, yMove, upPath));
//        //}

//        ////move down
//        //xMove = 0;
//        //yMove = 1;
//        //if (ctx.IsDestinationValid(startPoint, xMove, yMove) && !currentPath.getValid()) {
//        //    downValid = true;
//        //    //downPath = 
//        //    PathAry = PathAry.concat(_doMove(startPoint, endPoint, xMove, yMove, downPath));
//        //}

//        //if (leftValid) {
//        //    PathAry = PathAry.concat(leftPath);
//        //}

//        //if (rightValid) {
//        //    PathAry = PathAry.concat(rightPath);
//        //}

//        //if (upValid) {
//        //    PathAry = PathAry.concat(upPath);
//        //}

//        //if (downValid) {
//        //    PathAry = PathAry.concat(downPath);
//        //}

//        return PathAry;
//    }


//    ctx.IsDestinationValid = function (pointStart, xMove, yMove) {
//        var newX = pointStart.x + xMove,
//            newY = pointStart.y + yMove;

//        if (newY < 0 ||
//            newX < 0) {
//            return false;
//        }
//        else if (newY >= patternArry.length) {
//            return false;
//        }
//        else if (newX >= patternArry[newY].length) {
//            return false;
//        }
//        else {
//            return (patternArry[newY][newX] == 0 || patternArry[newY][newX] == END_VALUE);
//        }
//    };

//    function _FindByValue(val) {
//        for (var y = 0; y < patternArry.length; y++) {
//            for (var x = 0; x < patternArry[y].length; x++) {
//                if (patternArry[y][x] == val) {
//                    return new _Point(x, y);
//                }
//            }
//        }
//    }
//}

//function Path(startPoint, endPoint, pathFind) {
//    var ctx = this;
//    //var pathFind = thePathFind;

//    var ValidPointAry = [startPoint]; //only a list of valid points
//    var PointAry = [startPoint]; //a list of valid and invalid points, used to keep track of what we have checked

//    ctx.isValid = false;

//    ctx.addPoint = function (newPoint) {
//        if (!ctx.FindPointInPath(newPoint)) {

//            if (pathFind.IsDestinationValid(newPoint, 0, 0)) {
//                ValidPointAry[ValidPointAry.length] = newPoint;
//            }

//            PointAry[PointAry.length] = newPoint;

//            if (newPoint.x == endPoint.x && newPoint.y == endPoint.y) {
//                ctx.isValid = true;
//            }

//            return true;
//        }
//        return false;
//    }

//    ctx.getPath = function () {
//        return ValidPointAry;
//    };

//    ctx.getPoints = function () {
//        return PointAry;
//    };

//    ctx.setPath = function (pathAry) {
//        ValidPointAry = pathAry.slice();
//    };

//    ctx.setPoints = function (pointAry) {
//        PointAry = pointAry.slice();
//    };

//    ctx.setValid = function (isValid) {
//        ctx.isValid = isValid;
//    };

//    ctx.getValid = function () {
//        return ctx.isValid;
//    };

//    ctx.getPathFind = function () {
//        return pathFind;
//    };

//    ctx.setPathFind = function (thePath) {
//        pathFind = thePath;
//    };

//    ctx.setEndPoint = function (theEndpoint) {
//        endPoint = theEndpoint;
//    };

//    ctx.getEndPoint = function () {
//        return endPoint;
//    };

//    ctx.CopyPath = function () {
//        var newPath = new Path();

//        newPath.setPath(ctx.getPath());
//        newPath.setPoints(ctx.getPoints());
//        newPath.setValid(ctx.getValid());
//        newPath.setEndPoint(ctx.getEndPoint());
//        newPath.setPathFind(ctx.getPathFind());

//        return newPath;
//    }

//    //return true if we find the point in the list of valid and invalid checked points
//    ctx.FindPointInPath = function (thePoint) {
//        for (var i = 0; i < PointAry.length; i++) {
//            if (thePoint.x == PointAry[i].x && thePoint.y == PointAry[i].y) {
//                return true;
//            }
//        }

//        return false;
//    }
//}

