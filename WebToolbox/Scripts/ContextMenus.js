//this file depends on:
//Generic.js

function ContextMenus(options) {
    ctx = this;

    paddingHorizontal = 50;
    paddingVertical = 0;

    itemsList = [];

    var disabledContextMenu = function () {
        if (document.body == null || typeof document.body == 'undefined') {
            setTimeout(function () {
                disabledContextMenu();
            },100)
        }
        else {
            document.addEventListener("contextmenu", function () { ctx.Show(event, this); });
            document.addEventListener("click", function () { ctx.Hide() });
        }
    };

    disabledContextMenu();

    this.returnFalse = function () {
        return false;
    };

    options = (options == null || typeof options == 'undefined' ? {} : options);
    options.stepsX = (options.stepsX == null || typeof options.stepsX == 'undefined' ? 1 : options.stepsX);
    options.stepsY = (options.stepsY == null || typeof options.stepsY == 'undefined' ? 5 : options.stepsY);

    if(options.destObj == null || typeof options.destObj == 'undefined' ){
        resetDestObj();
    }

    function resetDestObj() {
        options.destObj = document.createElement("div");
        options.destObj.id = "ContextMenuDest";
        options.destObj.className = " contextMenu  noContextOpacity ";
    }

    this.Hide = function (callback) {
        StartContextAnimation(0, 0, -.01, function () {

            ctx.clearAll();

            var parentObj = options.destObj.parentElement;

            if (parentObj != null) {
                parentObj.removeChild(options.destObj);
                resetDestObj();
            }

            if (callback != null) {
                callback();
            }
        });
    };

    this.Show = function (e, obj) {
        ctx.Hide(function () {

            //for (var i = 8; i < 14; i++) {
            //    var theItem = new ctx.itemObj;

            //    ctx.addItem(theItem);
            //}

            if (itemsList.length != 0) {
                for (var i = 0; i < itemsList.length; i++) {
                    ctx.addItem(itemsList[i], false);
                }
            }

            options.destObj.style.position = "fixed";

            options.destObj.style.minWidth = "50px";
            options.destObj.style.maxWidth = "150px";
            

            options.destObj.style.top = (e.clientY + FindVerticalPadding()).toString() + "px";
            options.destObj.style.left = (e.clientX + FindHorizontalPadding()).toString() + "px";

            document.body.appendChild(options.destObj);

            //now that the object has been inserted into the body element, we can obtain
            //the final height and width of the context menu.  Store these for use later on.

            var finalWidth = options.destObj.scrollWidth,
                finalHeight = options.destObj.scrollHeight;

            if (finalWidth + Number(options.destObj.style.left.replace(/[^0-9]/g, "")) > window.innerWidth) {
                options.destObj.style.left = (e.clientX - finalWidth - 100).toString() + "px";
            }

            if (finalHeight + Number(options.destObj.style.top.replace(/[^0-9]/g, "")) > window.innerHeight) {
                options.destObj.style.top = (e.clientY - finalHeight - 25).toString() + "px";
            }

            options.destObj.className += " contextMinimized ";
            options.destObj.className = options.destObj.className.replace(/ noContextOpacity /g, "");

            StartContextAnimation(finalWidth, finalHeight);

            //e.preventDefault();
            //e.stopPropagation();
        });
        e.preventDefault();
        e.stopPropagation();
    };

    function StartContextAnimation(finalWidth, finalHeight, increment, callback) {
        var bolChange = false;

        if (increment == null) {
            increment = .01;
        }

        if (options.destObj.className.search(/contextMinimized/) != -1 && (options.destObj.style.width == "" || options.destObj.style.height == "")) {

        }


        var heightNum = options.destObj.offsetHeight;
        var widthNum = options.destObj.offsetWidth;

        var incTemp = (options.stepsY * increment);
        var incY = (heightNum + incTemp);

        incTemp = (options.stepsX * increment);

        var incX = (widthNum + incTemp);

        //if we haven't reached our target height...
        if ((incY < finalHeight && increment > 0) || (incY > finalHeight && increment < 0)) {
            options.destObj.style.height = incY.toString() + "px";
            bolChange = true;
        }
        else if ((heightNum > finalHeight && increment > 0) || (heightNum < finalHeight && increment < 0)) {
            options.destObj.style.height = finalHeight.toString() + "px";            
        }

        //if we haven't reached our target width
        if ((incX < finalWidth && increment > 0) || (incX > finalWidth && increment < 0)) {
            options.destObj.style.width = incX.toString() + "px";
            bolChange = true;
        }
        else if ((widthNum > finalWidth && increment > 0) || (widthNum < finalWidth && increment < 0)) {
            options.destObj.style.width = finalWidth.toString() + "px";
        }

        //a change was made, keep animating
        if (bolChange) {
            setTimeout(function () {
                StartContextAnimation(finalWidth, finalHeight, increment * 2.0, callback);
            }, 10);
        }

        //no change was made, reset some things...
        if (!bolChange) {
            options.destObj.style.width = null;
            options.destObj.style.height = null;
            options.destObj.className = options.destObj.className.replace(/ contextMinimized /g, "");
            if (callback != null) {
                //if we have a function to call, now is the time...
                callback();
            }
        }
    }

    //the object passed into the additem function should be as follows
    this.itemObj = function(){
        return {
            text: "",
            img: "",
            url: "", // /Pages/WordGame.aspx
            click: ""
        }
    };

    this.addItem = function (item, bolAddToList) {
        bolAddToList = (bolAddToList == null || typeof bolAddToList == 'undefined' ? true : bolAddToList);

        if (bolAddToList) {
            itemsList[itemsList.length] = item;
        }

        var bolImage = (item.img != null && typeof item.img != 'undefined' && item.img != "");
        var bolText = (item.text != null && typeof item.text != 'undefined' && item.text != "");
        var bolLink = (item.url != null && typeof item.url != 'undefined' && item.url != "");

        var theContainer = document.createElement("div");
        theContainer.className = " contextItem ";

        var theTextObj;
        var theImgObj;
        var theLink;

        if (bolLink) {
            theLink = document.createElement("a");

            if (item.click == "") {
                theLink.href = item.url;
            }
            else {
                theLink.href = "#";
            }

            theLink.className = " contextItemLink ";
        }

        if (bolImage) {
            theImgObj = document.createElement("img");
            theImgObj.src = item.img;
            theImgObj.className = " contextItemImg ";
        }

        if (bolText) {
            theTextObj = document.createElement("span");
            theTextObj.className = " contextItemText ";
            theTextObj.innerHTML = item.text;
        }

        if (bolImage) {
            (bolLink ? theLink : theContainer).appendChild(theImgObj);

            if (item.click != "" && !bolLink) {
                CreateClickEvent(theImgObj, item);
            }

        }

        if (bolText) {
            (bolLink ? theLink : theContainer).appendChild(theTextObj);

            if (item.click != "" && !bolLink) {
                CreateClickEvent(theTextObj, item);
            }
        }

        if (bolLink) {
            theContainer.appendChild(theLink);

            if (item.click != "") {
                item.click += ";location.href='" + item.url + "';";

                CreateClickEvent(theLink, item);
                
            }

        }

        options.destObj.appendChild(theContainer);
    }

    function CreateClickEvent(obj, item) {
        try {
            obj.onclick = function () {
                eval(item.click);
            }
        }
        catch (e) {
            g.DisplayCustomError("Invalid Context Menu click event!");
        }
    }

    this.clearAll = function () {
        options.destObj.innerHTML = "";
    }

    function FindHorizontalPadding() {
        return paddingHorizontal;
    }

    function FindVerticalPadding() {
        return paddingVertical;
    }

}