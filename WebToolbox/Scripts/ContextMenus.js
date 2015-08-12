//this file depends on:
//Generic.js

function ContextMenus(options) {
    ctx = this;

    paddingHorizontal = 25;
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
        options.destObj.className = " contextMenu ";
    }

    this.Hide = function (callback) {
        var finishInAnimate = function () {
            options.destObj.className = options.destObj.className.replace(/ slideIn /g, " noDisplay ");

            if (callback != null) {
                options.destObj.removeEventListener("animationend", finishInAnimate, false);
                callback();
            }
        };

        if (options.destObj.className.search(" slideOut ") != -1) {
            
            options.destObj.addEventListener("animationend", finishInAnimate, false);

            options.destObj.className = options.destObj.className.replace(/ slideOut /g, "");
            options.destObj.className += " slideIn ";
        }
        else {
            finishInAnimate();
        }
    };

    this.Show = function (e, obj) {
        ctx.Hide(function () {
            options.destObj.className = options.destObj.className.replace(/ noDisplay /g, "");
            options.destObj.style.position = "fixed";

            options.destObj.style.top = (e.clientY + paddingVertical).toString() + "px";
            options.destObj.style.left = (e.clientX + paddingHorizontal).toString()+ "px";

            document.body.appendChild(options.destObj);

            var finishOutAnimate = function () {
                options.destObj.removeEventListener("animationend", finishOutAnimate, false);
            }

            options.destObj.addEventListener("animationend", finishOutAnimate, false);

            options.destObj.className = options.destObj.className.replace(/ slideIn /g, "");
            options.destObj.className += " slideOut ";
        });
        e.preventDefault();
        e.stopPropagation();
    };

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