//file depends on Effects.css

function WaitIcons(options) {
    var numChild = [];
    var ctx = this;

    this.IconTypes = {
        FadeBlocks : "fadeblocks",
        FallingBlocks : "fallingblocks",
        FadingCircles : "fadecircles"
    };

    this.GetChildren = function () {
        return numChild;
    };

    this.display = function () {
        InitializeObjects();
    };

    function InitializeObjects() {
        switch (options.strType) {
            case ctx.IconTypes.FadeBlocks:
                initFadeblocks(numChild);
                break;
            case ctx.IconTypes.FallingBlocks:
                initFallingblocks(numChild);
                break;
            case ctx.IconTypes.FadingCircles:
                initFadingCircles(numChild);
                break;

        }
        AddPercentCompleteContainer();
    }

    /************************
      fading circles code
    ************************/
    function initFadingCircles(ary) {
        //if the requested number of child objects is not a multiple of XXX,
        //set the number to the next lowest multiple
        //options.numChild = MultipleOf(options.numChild, 4, -1);

        CreateChildBlocks();

        //destination object should be positioned explicitely,
        //to ensure consistent absolute child item placement
        options.destObj.style.position = "relative";
        
        options.destObj.style.width = Number(2 * options.radiusX + options.childWidth) + "px";
        options.destObj.style.height = Number(2 * options.radiusY + options.childHeight) + "px";

        //this should absolutely position
        //all the newly created child blocks
        //into a evenly spaced circular pattern
        for (var i = 0; i < ary.length; i++) {
            var posObj = PositionCircleItem(ary[i], i);

            ary[i].style.position = "absolute";

            ary[i].style.borderRadius = "1000px";

            ary[i].style.top = Number(posObj.posY + options.radiusY).toString() + "px";
            ary[i].style.right = Number(posObj.posX + options.radiusX).toString() + "px";

        }

        var eventsStartHandlerAry = [];
        var eventsEndHandlerAry = [];

        var fadeCircleStartEvent = function (k) {
            return function () {
                setTimeout(function () {

                    var j;

                    if (options.direction > 0) {
                        j = (k < ary.length - 1 ? k + 1: 0);
                    }
                    else if (options.direction < 0) {
                        j = (k > 0 ? k - 1 : ary.length - 1);
                    }

                    //need to maintain a reference to the event handlers, so that we can properly add/remove them later
                    if (typeof eventsStartHandlerAry[j] == 'undefined') {
                        eventsStartHandlerAry[j] = fadeCircleStartEvent(j);
                        eventsEndHandlerAry[j] = fadeCircleEndEvent(j);
                        ary[j].addEventListener("animationstart", eventsStartHandlerAry[j], false);
                    }

                    initFadeblocksItem(ary[j]);
                }, (getAnimationDuration(ary[k].className)*50));
            }
        };

        for (var i = 0; i < ary.length; i++) {
            eventsStartHandlerAry[i] = fadeCircleStartEvent(i);

            ary[i].addEventListener("animationstart", eventsStartHandlerAry[i], false);

        }
        initFadeblocksItem(ary[0]);
    }

    //returns top and left coordinates where object was placed
    function PositionCircleItem(obj, position) {
        var posX, posY;
        posX = options.radiusX * Math.cos(2 * Math.PI * position / options.numChild);
        posY = options.radiusY * Math.sin(2 * Math.PI * position / options.numChild);

        return {
            posX: posX,
            posY: posY
        };
        
    }

    //returns the next lowest multiple of a given numbers
    //if the given number is already a multiple of the base number
    //that number should be returned.

    function MultipleOf(theNumber, BaseNumber, direction) {//direction -1 down, 1 up
        return theNumber + ((theNumber % BaseNumber) * direction);
    }


    /************************
         falling blocks code
    ************************/

    function initFallingblocks(ary) {
        NearestSquareNumber();

        CreateChildBlocks();

        var sqroot = Math.sqrt(ary.length);

        var eventsStartHandlerAry = [];
        var eventsEndHandlerAry = [];

        var fallblocksStartEvent = function (k) {
            return function () {
                setTimeout(function () {
                    var j = (k + sqroot < ary.length ? k + sqroot : Math.abs(ary.length - (k + sqroot)));

                    //need to maintain a reference to the event handlers, so that we can properly add/remove them later
                    if (typeof eventsStartHandlerAry[j] == 'undefined') {
                        eventsStartHandlerAry[j] = fallblocksStartEvent(j);
                        eventsEndHandlerAry[j] = fallblocksEndEvent(j);
                    }

                    ary[j].addEventListener("animationstart", eventsStartHandlerAry[j], false);
                    ary[j].addEventListener("animationend", eventsEndHandlerAry[j], false);

                    initFadeblocksItem(ary[j]);
                }, (getAnimationDuration(ary[k].className) + (1 * (k % sqroot))) /* k */ * (10 + (ary.length < 25 ? ary.length : 0)));
            }
        };

        var fallblocksEndEvent = function (k) {
            return function () {
                ary[k].removeEventListener("animationstart", eventsStartHandlerAry[k], false);
                ary[k].removeEventListener("animationend", eventsEndHandlerAry[k], false);

            }
        };

        for (var i = 0; i < Math.sqrt(ary.length) ; i++) {
            initFadeblocksItem(ary[i]);

            eventsStartHandlerAry[i] = fallblocksStartEvent(i);
            eventsEndHandlerAry[i] = fallblocksEndEvent(i);


            ary[i].addEventListener("animationstart", eventsStartHandlerAry[i], false);
            ary[i].addEventListener("animationend", eventsEndHandlerAry[i], false);
        }
    }




    /************************
         fade block code
    ************************/
    function initFadeblocks(ary) {
        NearestSquareNumber();

        CreateChildBlocks();

        for (var i = 0; i < ary.length; i++) {
            if (i == 0) {
                initFadeblocksItem(ary[i]);
            }

            ary[i].addEventListener("animationstart",
                function (k) {
                    return function () {
                        setTimeout(function () {
                            var j = (k + 1 < ary.length ? k + 1 : 0);

                            initFadeblocksItem(ary[j]);
                        }, getAnimationDuration(ary[k].className) * (10 + (ary.length < 25 ? ary.length : 0)));
                    }
                }(i)
            , false);
        }


    }

    function CreateChildBlocks() {
        //create the child objects for future use
        for (var i = 0; i < options.numChild; i++) {
            numChild[i] = document.createElement("div");

            numChild[i].innerHTML = "&nbsp;";//i.toString();
            //numChild[i].style.display = "none";

            numChild[i].style.width = options.childWidth + "px";
            numChild[i].style.height = options.childHeight + "px";
            //numChild[i].style.display = "none";
            numChild[i].style.display = "inline-block";
            

            if (i == Math.sqrt(options.numChild)) {
                options.destObj.style.display = "inline-block";
                //options.destObj.style.display = "none";
                options.destObj.style.width = (i * options.childWidth) + "px";
                options.destObj.style.lineHeight = "0px";

            }

            options.destObj.appendChild(numChild[i]);
        }

    }

    //this function will only work if the duration css classes follow the format:
    //  "effectDuration" + number of seconds + "p" + number of partial seconds
    // example "effectDuration3p5"...
    //  meaning 3.5 second duration
    //  omit the p + number of partial seconds if there are no partial seconds
    function getAnimationDuration(strClasses) {
        var reg = /[ ]?effectDuration([0-9]{0,})[p]{0,}([0-9]{0,})/;

        var matches = reg.exec(strClasses);

        var num = matches[1] + "." + matches[2];
        return parseFloat(num);
    }

    function initFadeblocksItem(obj) {
        SwapFadeblockClasses(obj);
        //obj.style.animationDirection = "alternate";
        //obj.style.animationIterationCount = "infinite";
        obj.style.backgroundColor = "#a0a0a0";
        obj.style.animationDelay = "0s";
    }

    function SwapFadeblockClasses(obj) {
        if (obj.className.search("effectFadeIn") == -1 && obj.className.search("effectFadeOut") == -1) {
            obj.className = "effectFadeIn " + options.durationClass;
        }
        else {
            obj.className = obj.className.replace(
                    (obj.className.search("effectFadeIn") != -1 ? "effectFadeIn" : "effectFadeOut"),
                    (obj.className.search("effectFadeIn") != -1 ? "effectFadeOut" : "effectFadeIn")
                );
        }
    }

    function NearestSquareNumber() {
        //for now, only work with perfect squares...
        var tempSquareBase = 1;

        for (; Math.pow(tempSquareBase, 2) < options.numChild; tempSquareBase++) {
            if (Math.pow(tempSquareBase + 1, 2) >= options.numChild) {
                break;
            }
        }

        options.numChild = Math.pow(tempSquareBase, 2);
    }

    function AddPercentCompleteContainer() {
        options.destObj.style.position = (options.destObj.style.position == "" ? "relative" : options.destObj.style.position);

        var percentCompleteContainer = document.createElement("div");

        //percentCompleteContainer.style.borderRadius = "1000px";
        //percentCompleteContainer.style.border = "solid white 1px";

        percentCompleteContainer.style.position = "absolute";
        percentCompleteContainer.style.width = (options.destObj.offsetWidth - Number(percentCompleteContainer.style.border.replace(/[^0-9]/g, ""))*2) + "px";
        percentCompleteContainer.style.height = (options.destObj.offsetHeight - Number(percentCompleteContainer.style.border.replace(/[^0-9]/g, "")) * 2) + "px";
        percentCompleteContainer.style.display = "inline-block";
        //percentCompleteContainer.style.verticalAlign = "bottom"
        percentCompleteContainer.style.zIndex = "1000";
        percentCompleteContainer.style.fontSize = (options.destObj.offsetHeight * .7 )+ "px";
        percentCompleteContainer.style.textAlign = "center";
        //percentCompleteContainer.innerHTML = "50";
                
        //percentCompleteContainer.style.backgroundColor = "green";
        percentCompleteContainer.style.top = "0px";
        percentCompleteContainer.style.left = "0px";

        options.destObj.appendChild(percentCompleteContainer);
    }
}

function WaitIconOptions(strType) {
    return {
        numChild: 25,
        strType: "fadeblocks",
        childDurationClass: "",
        childHeight: 5,
        childWidth: 5,
        radiusX: 10, //circles only
        radiusY: 10,//circles only
        destObj: document.getElementById("fadingSquares"),
        direction: -1,
        /*
            fading blocks: duration affects how quickly 
            a single block transitions from light to dark

            falling squares: affects speed of single block
            transitions AND to a lesser degree, a longer
            duration means a column of blocks will be darker
            for a longer period of time.
        */
        durationClass: "effectDurationp5"
    }
}