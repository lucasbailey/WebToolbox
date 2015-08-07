function Clocks(options) {
    options = (options == null || typeof options == "undefined" ? {} : options);
    options.face = (options.face == null || typeof options.face == "undefined" ? "digital" : options.face); //analog or digital
    //options.type = (options.type == null || typeof options.type == "undefined" ? "time" : options.type); //date or time
    options.seconds = (options.seconds == null || typeof options.seconds == "undefined" ? false : options.seconds); //true or false
    options.allowTimer = (options.allowTimer == null || typeof options.allowTimer == "undefined" ? false : options.allowTimer); //true or false
    options.timerButtons = (options.timerButtons == null || typeof options.timerButtons == "undefined" ? false : options.timerButtons); //true or false
    options.digitWidth = (options.digitWidth == null || typeof options.digitWidth == "undefined" ? 30 : options.digitWidth);

    var _time = new Date();
    //                         *              *
    var _BitPositions = [1, 2, 4, 8, 16, 32, 64, 128, 256];

    var _numberZero = 1 + 2 + 8 + 32 + 128 + 256;
    var _numberOne = 8 + 128;
    var _numberTwo = 1 + 8 + 16 + 32 + 256;
    var _numberThree = 1 + 8 + 16 + 128 + 256;
    var _numberFour = 2 + 8 + 16 + 128;
    var _numberFive = 1 + 2 + 16 + 128 + 256;
    var _numberSix = 1 + 2 + 16 + 32 + 128 + 256;
    var _numberSeven = 1 + 8 + 128;
    var _numberEight = 1 + 2 + 8 + 16 + 32 + 128 + 256;
    var _numberNine = 1 + 2 + 8 + 16 + 128 + 256;
    var _numberSep = 4 + 64;
    var _t;//timer handler
    var _tb; //timer button visibility handler

    var destObj;
    var heightMultiplier = 1.95;
    var timerButtonContainer;
    var clockContainer;
    var clockFace;

    var ctx = this;

    this.Stop = function () {
        _t = clearInterval(_t);
        options.allowTimer = false;
    };

    this.Go = function () {
        options.allowTimer = true;
        _t = setInterval(function () {
            var theDate = ctx.getTime();

            theDate.setTime(theDate.getTime() + 1000);
            ctx.setTime(theDate);

            var theNewClockFace = BuildClockFace(_time, options);
            var theParent = clockFace.parentElement;

            theParent.replaceChild(theNewClockFace, clockFace);

            clockFace = theNewClockFace;
        }, 1000);
    }

    this.Show = function (objContainer) {//objContainer is the object that will hold the clock
        destObj = objContainer;

        if (destObj.style.width == null || typeof destObj.style.width == 'undefined' || destObj.style.width == "") {
        //    destObj.style.width = '150pt';
        }

        //destObj.style.display = 'inline-block';

        destObj.onmouseover = function () {
            HighlightClock(this, true);
        }

        destObj.onmouseout = function () {
            HighlightClock(this, false);
        }

        clockContainer = document.createElement("div");
        clockContainer.style.position = "relative";
        clockContainer.style.display = "inline-block";
        clockContainer.style.width = ((options.seconds ? 10 : 6) * options.digitWidth).toString() + "px";
                
        clockFace = BuildClockFace(_time, options);

        clockContainer.appendChild(clockFace);

        if (options.timerButtons) {
            var timerButtons = BuildTimerButtons();
            clockContainer.appendChild(timerButtons);
        }

        objContainer.appendChild(clockContainer);
        
        if (options.allowTimer) {
            ctx.Stop();
            ctx.Go();
        }
    };

    this.setTime = function (theDateTime) {
        _time = new Date(theDateTime);
        //_time = new Date('1/1/1900 15:17:04');
    };

    this.getTime = function () {
        return _time;
    }

    function BuildClockFace(theTime, theOptions) {
        if (theOptions.face == "analog") {
            return AnalogClock(theTime);
        }
        else if (theOptions.face == "digital") {
            return DigitalClock(theTime);
        }
    }

    function AnalogClock(theTime) {
        return "";
    }

    function DigitalClock(theTime) {
        var thereturn = document.createElement("div");
        thereturn.style.position = "relative";
        
        var hours = ((theTime.getHours() < 10 ? "0" : "") + theTime.getHours()).toString();
        var minutes = ((theTime.getMinutes() < 10 ? "0" : "") + theTime.getMinutes()).toString();
        var seconds = ((options.seconds ? (theTime.getSeconds() < 10 ? "0" : "") + theTime.getSeconds() : ""));
        var secondsSep = (options.seconds ? "|" : "");

        var combined = hours + "|" + minutes + secondsSep + seconds;

        for (var i = 0; i < combined.length; i++) {
            var theNumber = (combined.substr(i, 1));
            var theDigit;

            theDigit = DigitalNumber(theNumber);

            //add hidden inputs to hold info needed for later on
            var theIndex = document.createElement("input");
            theIndex.type = "hidden";
            theIndex.name = 'indexPosition';
            theIndex.value = i.toString();

            theDigit.appendChild(theIndex);

            var theValue = document.createElement("input");
            theValue.type = "hidden";
            theValue.name = 'value';
            theValue.value = theNumber;

            theDigit.appendChild(theValue);

            thereturn.appendChild(theDigit);
        }

        return thereturn;
    }

    function DigitalNumber(theNumber) {
        var returnObj = document.createElement("div");
        returnObj.style.display = "inline-block";
        returnObj.style.position = "relative";

        switch (theNumber) {
            case "0":
                returnObj.appendChild(GenericDigitalNumber(_numberZero));
                break;
            case "1":
                returnObj.appendChild(GenericDigitalNumber(_numberOne));
                break;
            case "2":
                returnObj.appendChild(GenericDigitalNumber(_numberTwo));
                break;
            case "3":
                returnObj.appendChild(GenericDigitalNumber(_numberThree));
                break;
            case "4":
                returnObj.appendChild(GenericDigitalNumber(_numberFour));
                break;
            case "5":
                returnObj.appendChild(GenericDigitalNumber(_numberFive));
                break;
            case "6":
                returnObj.appendChild(GenericDigitalNumber(_numberSix));
                break;
            case "7":
                returnObj.appendChild(GenericDigitalNumber(_numberSeven));
                break;
            case "8":
                returnObj.appendChild(GenericDigitalNumber(_numberEight));
                break;
            case "9":
                returnObj.appendChild(GenericDigitalNumber(_numberNine));
                break;
            case "|":
                returnObj.appendChild(GenericDigitalNumber(_numberSep));
                break;
        }

        return returnObj
    }

    function GenericDigitalNumber(bitPositionsToShow) {
        var theContainer = document.createElement("div");

        theContainer.style.position = "relative";
        theContainer.style.display = "inline-block";
        theContainer.style.margin = "3px";

        //var theConstant = Number(destObj.style.width.replace(/[a-zA-Z]/g, ""));
        //theConstant = (options.seconds ? theConstant / 10 : theConstant / 5.5); //(options.seconds ? 35.000 * Math.pow((theConstant / 100), (1 / (theConstant / 100))) : 6);
        


        theContainer.style.width = parseFloat(options.digitWidth).toString() + "px";
        theContainer.style.height = (parseFloat(options.digitWidth) * heightMultiplier).toString() + "px";

        //destObj.style.height = theContainer.style.height;

        for (var i = 0; i < _BitPositions.length; i++) {
            if ((_BitPositions[i] & bitPositionsToShow) == _BitPositions[i]) {
                var theBar = document.createElement("div");
                var theBarHighlight = document.createElement("div");

                var d1 = " digitalHorizontalBar ";
                var d2 = " digitalSideBar ";
                var d3 = " digitalUpperRight ";
                var d4 = " digitalMiddleLeft ";
                var d5 = " digitalMiddleRight ";
                var d6 = " digitalBottomLeft ";
                var d7 = " digitalUpperMiddle ";
                var d8 = " digitalMiddleMiddle ";
                var d9 = " digitalBottomMiddle ";
                var d10 = " digitalUpperLeft ";
                var d11 = " digitalSepTop ";
                var d12 = " digitalSepBottom ";

                var d1H = " digitalHorizontalBarHighlight ";
                var d2H = " digitalSideBarHighlight ";
                var d3H = " digitalUpperRightHighlight ";
                var d4H = " digitalMiddleLeftHighlight ";
                var d5H = " digitalMiddleRightHighlight ";
                var d6H = " digitalBottomLeftHighlight ";
                var d7H = " digitalUpperMiddleHighlight ";
                var d8H = " digitalMiddleMiddleHighlight ";
                var d9H = " digitalBottomMiddleHighlight ";
                var d10H = " digitalUpperLeftHighlight ";
                var d11H = " digitalSepTopHighlight ";
                var d12H = " digitalSepBottomHighlight ";
                //var nd = " noDisplay ";
                var nd = "  ";

                switch (i) { //determine css settings to apply
                    case 0:
                        theBar.className = d1 + d7;
                        theBarHighlight.className = d1H + d7H + nd;
                        break;
                    case 1:
                        theBar.className = d2 + d10;
                        theBarHighlight.className = d2H + d10H + nd;
                        break;

                    case 2: //top separator bar
                        theBar.className = d11;
                        theBarHighlight.className = d11H + nd;
                        break;
                    case 3:
                        theBar.className = d1 + d2 + d3;
                        theBarHighlight.className = d1H + d2H + d3H + nd;
                        break;
                    case 4:
                        theBar.className = d1 + d8;
                        theBarHighlight.className = d1H + d8H + nd;
                        break;
                    case 5:
                        theBar.className = d1 + d2 + d4;
                        theBarHighlight.className = d1H + d2H + d4H + nd;
                        break;
                    case 6: //bottom serparator bar
                        theBar.className = d12;
                        theBarHighlight.className = d12H + nd;
                        break;
                    case 7:
                        theBar.className = d1 + d2 + d5;
                        theBarHighlight.className = d1H + d2H + d5H + nd;
                        break;
                    case 8:
                        theBar.className = d1 + d6 + d9;
                        theBarHighlight.className = d1H + d6H + d9H + nd;
                        break;

                }

                theBar.innerHTML = " ";
                theBarHighlight.innerHTML = " ";

                theContainer.appendChild(theBar);
                theContainer.appendChild(theBarHighlight);
            }
        }

        return theContainer;
    }
    var highlightcounter = 0;
    function HighlightClock(theObj, bolHighlight) {
        if (options.timerButtons && bolHighlight) {
            startShowTimerButtons(1);
        }
        else if (!bolHighlight) {
            startShowTimerButtons(-1);
        }
    }

    function BuildTimerButtons() {
        var theReturn = document.createElement("div");
        timerButtonContainer = theReturn; //maintain a reference to the container for future use

        theReturn.style.position = "absolute";
        theReturn.style.width = "100%";
        theReturn.className = " noDisplay ";
        theReturn.style.opacity = 0;
        theReturn.style.textAlign = "center";

        var startButton = document.createElement("input");
        var stopButton = document.createElement("input");
        var EditButton = document.createElement("input");

        stopButton.type = "button";
        stopButton.value = "Stop";
        //stopButton.style.width = "45%";
        //stopButton.style.float = "Right";
        stopButton.style.marginLeft = "3%";
        stopButton.style.marginRight = "3%";
        stopButton.style.paddingLeft = "5%";
        stopButton.style.paddingRight = "5%";

        stopButton.onclick = function () {
            ctx.Stop();
        }

        EditButton.type = "button";
        EditButton.value = "Edit";
        //EditButton.style.width = "45%";
        //EditButton.style.float = "Right";
        EditButton.style.marginLeft = "5%";
        EditButton.style.marginRight = "5%";
        EditButton.style.paddingLeft = "15%";
        EditButton.style.paddingRight = "15%";

        EditButton.onclick = function () {
            //ctx.ShowEdit();
        }

        startButton.type = "button";
        startButton.value = "Start";
        //startButton.style.width = "45%";
        //startButton.style.float = "Left";
        startButton.style.marginLeft = "3%";
        startButton.style.marginRight = "3%";
        startButton.style.paddingLeft = "5%";
        startButton.style.paddingRight = "5%";

        startButton.onclick = function () {
            ctx.Go();
        }

        theReturn.appendChild(startButton);
        theReturn.appendChild(EditButton);
        theReturn.appendChild(stopButton);

        return theReturn;
    }

    function startShowTimerButtons(direction) {
        var step = .1;

        step *= direction
        _tb = clearInterval(_tb);

        if (typeof _tb == 'undefined' || _tb != null) {
            _tb = setInterval(function () {
                timerButtonContainer.className = timerButtonContainer.className.replace(/ noDisplay /g, "");

                if (timerButtonContainer.style.opacity > 1 && direction > 0) {
                    timerButtonContainer.style.opacity = 1;
                    _tb = clearInterval(_tb);
                    _tb = null;
                }

                else if (timerButtonContainer.style.opacity < 0 && direction < 0) {
                    timerButtonContainer.className += " noDisplay ";
                    timerButtonContainer.style.opacity = 0;
                    _tb = clearInterval(_tb);
                    _tb = null;
                }
                else {
                    ShowTimerButtons(step);
                    step = (Math.abs(step) * 1.04) * direction;
                }
                
            }, 1);
        }
    }

    function ShowTimerButtons(step) {
        if (timerButtonContainer.style.opacity == null || typeof timerButtonContainer.style.opacity == 'undefined' ||
            timerButtonContainer.style.opacity == "") {
            timerButtonContainer.style.opacity = "0";
        }

        timerButtonContainer.style.opacity = parseFloat(timerButtonContainer.style.opacity) + step;
    }
    
    if (typeof options.destObj != 'undefined') {
        ctx.Show(options.destObj);
    }
}