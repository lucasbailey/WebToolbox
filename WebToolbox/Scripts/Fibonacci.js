function Fibonacci() {
    var ctx = this;
    var numToDisplay, currentDisplay, objDest, options;


    this.Display = function (theOptions) {
        options = theOptions;

        options = (options == null || typeof options == 'undefined' ? {} : options);
        objDest = (options.objDest == null || typeof options.objDest == 'undefined' ? null : options.objDest);
        numToDisplay = (options.numToDisplay == null || typeof options.numToDisplay == 'undefined' ? 10 : options.numToDisplay);
        currentDisplay = 0;

        var result = _getFib();

        if (objDest != null && typeof objDest != 'undefined') {            
            objDest.innerHTML = result.join(",");
        }
    };

    function _getFib(firstNum, secondNum) {
        firstNum = (firstNum == null ? 0 : firstNum);
        secondNum = (secondNum == null ? 1 : secondNum);

        var returnArray = [];

        if (currentDisplay < numToDisplay) {
            currentDisplay++;

            returnArray[returnArray.length] = firstNum;

            returnArray = returnArray.concat(_getFib(secondNum, firstNum + secondNum));
        }

        return returnArray;
    }

    this.IsFibonacci = function (x) {
        //something is in the fibanocci sequence if the resulting number from the following 
        //formulae is a perfect square...4, 9, 16, 25, etc.
        var result1 = 5 * x * x + 4, result2 = 5 * x * x - 4;

        var sqrt1 = Math.sqrt(result1);
        var sqrt2 = Math.sqrt(result2);

        return (Math.round(sqrt1) == sqrt1 || Math.round(sqrt2) == sqrt2);
    }
}