var pathFinder;
var validPaths;

var shortestPath;
var longestPath;

var lastPath = [];
var thePatternAry =
[
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 3],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    //[0, 0, 0, 0, 3],
    //[2, 0, 0, 0, 0]

];
//[
//    [3, 0, 0, 0, 0],
//    [0, 0, 0, 0, 0],
//    [0, 0, 0, 0, 0],
//    [0, 0, 0, 0, 2]
//]
//[[3, 1, 0, 0, 0, 1, 0], [0, 1, 0, 0, 0, 1, 0], [0, 1, 0, 0, 0, 1, 0], [0, 1, 0, 0, 0, 1, 0], [0, 1, 0, 0, 0, 1, 0], [0, 1, 0, 0, 0, 1, 0], [0, 1, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0, 2]]
//[
//    [0, 1, 0, 0, 0, 1, 0],
//    [0, 1, 0, 0, 0, 1, 0],
//    [0, 1, 0, 0, 0, 1, 0],
//    [0, 1, 0, 0, 0, 1, 0],
//    [0, 1, 0, 0, 0, 1, 0],
//    [0, 1, 0, 0, 0, 1, 0],
//    [0, 1, 0, 0, 0, 1, 0],
//    [0, 3, 0, 0, 0, 2, 1]
//];
//[
//    [3, 1, 0],
//    [0, 0, 2]
//];

function init() {
    pathFinder = new PathFinders(thePatternAry, document.getElementById("PathFinderMinPath").checked);
    validPaths = {};

    shortestPath;
    longestPath;

    PathFinderOtherList.innerHTML = "Calculating the paths..."

    pathFinder.FindValidPaths(
        function (sanitizedResult) {
            validPaths = JSON.parse(sanitizedResult);

            BuildOtherPathButtons();

            shortestPath = (validPaths.ShortList != null ? validPaths.ShortList.ValidPointAry : null);
            longestPath = (validPaths.LongList != null ? validPaths.LongList.ValidPointAry : null);

        },//end success callback
        //begin fail callback
        function (sanitizedResult) {
            PathFinderOtherList.innerHTML = sanitizedResult;
        }//end fail callback

    );

    DisplayPatternHTML(PathFinderDisplay, thePatternAry);
}

function BuildOtherPathButtons() {
    var returnString = "Enter a # 1 - " + validPaths.Paths.length
                     + "<br/><input type='text' value='' id='PathNumToUse' />"
                     + "<br/><input type='button' value='View Selected Path' onclick='DisplayOtherPath();' />";

    //for (var i = 0; i < validPaths.length; i++) {
    //    returnString += "<input type='button' value='Shortest Path #" + (i + 1).toString() + "' id='ShortPath" + i.toString() + "' onclick='ShowPath(" + i.toString() + ");'/><br/>";
    //}

    PathFinderOtherList.innerHTML = returnString;

}

function DisplayOtherPath() {
    var num = (Number(document.getElementById("PathNumToUse").value) - 1).toString();

    DisplayPath(validPaths.Paths[num].ValidPointAry);
}

function DisplayPatternHTML(destObj, thePattern) {

    var returnString = "<table id='FindPathPatternTable' style='border-collapse: collapse;'>";

    for (var i = 0; i < thePattern.length; i++) {
        returnString += "<tr>";

        for (var j = 0; j < thePattern[i].length; j++) {
            returnString += "<td id='Column" + j.toString() + "Row" + i.toString() + "' onclick='ModifyCell(this)' style='position:relative;margin: 0x; padding: 0px;display:inline-block;width: 50px; height: 50px;'>";

            switch (thePattern[i][j]) {
                case 0:
                    returnString += "<div class='block validBlock'></div>";
                    break;
                case 1:
                    returnString += "<div class='block invalidBlock'></div>";
                    break;
                case 2:
                    returnString += "<div class='block endPoint'>Start</div>";
                    break;
                case 3:
                    returnString += "<div class='block endPoint'>End</div>";
                    break;
            }
            returnString += "</td>"
        }

        returnString += "</tr>";
    }

    destObj.innerHTML = returnString;
}

function ModifyCell(obj) {
    var bolSkipInit = false;

    //row pattern
    rp = /.*Row([0-9]+).*/gi;
    //column pattern
    cp = /.*Column([0-9]+).*/gi;

    var row = obj.id.replace(rp, "$1");
    var column = obj.id.replace(cp, "$1");

    switch (thePatternAry[row][column]) {
        case 1:
            thePatternAry[row][column] = 0;
            break;
        case 2:
        case 3:
            alert("can't modify start and end points");
            bolSkipInit = true;
            break;
        case 0:
            thePatternAry[row][column] = 1;
            break;
    }
    //reload the paths with the changes
    if (!bolSkipInit) {
        init();
    }


}

function DisplayPath(PathAry) {
    var theTable = document.getElementById("FindPathPatternTable");
    //reset the table for subsquent searches
    for (var i = 0; i < lastPath.length; i++) {
        var theRow = lastPath[i].y,
            theColumn = lastPath[i].x;

        theTable.rows[theRow].cells[theColumn].className = theTable.rows[theRow].cells[theColumn].className.replace(/ validPath /g, "");
        theTable.rows[theRow].cells[theColumn].children[0].style.backgroundColor = '';
    }

    //now add the new highlights
    for (var i = 0; i < PathAry.length; i++) {
        var theRow = PathAry[i].y,
            theColumn = PathAry[i].x;

        theTable.rows[theRow].cells[theColumn].className += " validPath ";
        theTable.rows[theRow].cells[theColumn].children[0].style.backgroundColor = 'rgba(255,0,0,' + (1.0 - (.01 * (100 / PathAry.length * i))).toString() + ')';
    }

    lastPath = PathAry.slice();
}


init();