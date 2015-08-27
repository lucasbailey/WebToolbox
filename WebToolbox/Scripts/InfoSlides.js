//file depends on generic.js
//file depends on Effects.css

function InfoSlides(options) {
    this.ctxOptions = options;

    if (typeof SlideList == 'undefined') {
        SlideList = [];
    }

    SlideList[SlideList.length] = this;

    var ctx = this;

    this.id = SlideList.length;

    options = (options == null || typeof options == 'undefined' ? {} : options);
    options.destObj = (options.destObj == null || typeof options.destObj == 'undefined' ? {} : options.destObj);
    options.title = (options.title == null || typeof options.title == 'undefined' ? "" : options.title);
    options.summary = (options.summary == null || typeof options.summary == 'undefined' ? "" : options.summary);
    options.img = (options.img == null || typeof options.img == 'undefined' ? {} : options.img);
    options.containerClassName = (options.containerClassName == null || typeof options.containerClassName == 'undefined' ? "" : options.containerClassName);
    options.url = (options.url == null || typeof options.url == 'undefined' ? "" : options.url);

    options.BackgroundBaseEffectClass = (options.BackgroundBaseEffectClass == null || typeof options.BackgroundBaseEffectClass == 'undefined' ? "" : options.BackgroundBaseEffectClass);
    options.BackgroundEndEffectClass = (options.BackgroundEndEffectClass == null || typeof options.BackgroundEndEffectClass == 'undefined' ? "" : options.BackgroundEndEffectClass);
    options.BackgroundBaseEffectDurationClass = (options.BackgroundBaseEffectDurationClass == null || typeof options.BackgroundBaseEffectDurationClass == 'undefined' ? "" : options.BackgroundBaseEffectDurationClass);
    options.BackgroundEndEffectDurationClass = (options.BackgroundEndEffectDurationClass == null || typeof options.BackgroundEndEffectDurationClass == 'undefined' ? "" : options.BackgroundEndEffectDurationClass);
    options.BackgroundInitialBaseEffectClass = (options.BackgroundInitialBaseEffectClass == null || typeof options.BackgroundInitialBaseEffectClass == 'undefined' ? "" : options.BackgroundInitialBaseEffectClass);

    options.TextBaseEffectClass = (options.TextBaseEffectClass == null || typeof options.TextBaseEffectClass == 'undefined' ? "" : options.TextBaseEffectClass);
    options.TextEndEffectClass = (options.TextEndEffectClass == null || typeof options.TextEndEffectClass == 'undefined' ? "" : options.TextEndEffectClass);
    options.TextBaseEffectDurationClass = (options.TextBaseEffectDurationClass == null || typeof options.TextBaseEffectDurationClass == 'undefined' ? "" : options.TextBaseEffectDurationClass);
    options.TextEndEffectDurationClass = (options.TextEndEffectDurationClass == null || typeof options.TextEndEffectDurationClass == 'undefined' ? "" : options.TextEndEffectDurationClass);
    options.TextInitialBaseEffectClass = (options.TextInitialBaseEffectClass == null || typeof options.TextInitialBaseEffectClass == 'undefined' ? "" : options.TextInitialBaseEffectClass);
    options.TitleClass = (options.TitleClass == null || typeof options.TitleClass == 'undefined' ? "" : options.TitleClass);
    options.SummaryClass = (options.SummaryClass == null || typeof options.SummaryClass == 'undefined' ? "" : options.SummaryClass);

    options.ResetExternal = (options.ResetExternal == null || typeof options.ResetExternal == 'undefined' ? true : options.ResetExternal);
    options.MoreInfo = (options.MoreInfo == null || typeof options.MoreInfo == 'undefined' ? "" : options.MoreInfo);

    var summaryObj, titleObj, imgObj, containerObj, moreInfoObj, arrowObj;

    this.Display = function () {
        var obj = options.destObj;
        obj.className = options.containerClassName;
        obj.style.position = "relative";

        titleObj = document.createElement("div");

        imgObj = document.createElement("div");

        moreInfoObj = document.createElement("div");
        
        arrowObj = document.createElement("a");
        

        switch (options.fill.toLowerCase()) {
            case "fillwp":
                imgObj.style.backgroundSize = "100% auto";
                break;
            case "fillhp":
                imgObj.style.backgroundSize = "auto 100%";
                break;
            case "none":
            default:
                break;
        }

        summaryObj = (options.url != "" ? document.createElement("a") : document.createElement("div"));

        containerObj = document.createElement("div");

        ctx.InitializeObjects();

        moreInfoObj.appendChild(arrowObj);

        imgObj.appendChild(moreInfoObj);

        containerObj.appendChild(titleObj);
        containerObj.appendChild(summaryObj);

        obj.appendChild(imgObj);
        obj.appendChild(containerObj);

        var animEndFunc = function () {
            var reg = new RegExp("[ ]{0,}" + options.TextEndEffectClass + "[ ]{1,}", "g");

            if (this.className.search(reg) != -1) {
                this.style.visibility = "hidden";
            }
        }

        var animStartFunc = function () {
            if (this.className.search(options.TextEndEffectClass) == -1) {
                this.style.visibility = "visible";
            }

        }

        containerObj.addEventListener("animationend", animEndFunc, false);
        containerObj.addEventListener("animationstart", animStartFunc, false);
        imgObj.addEventListener("animationend", animEndFunc, false);
        imgObj.addEventListener("animationstart", animStartFunc, false);

        obj.addEventListener("click", function () {
            //set parent obj style height, to help fix issues with slide effects
            obj.style.height = Number(g.GetStyleDimensions(obj).height).toString() + "px";

            for (var i = 0; i < SlideList.length; i++) {
                if (ctx !== SlideList[i] && ctx.ctxOptions.ResetExternal) {
                    SlideList[i].ResetExternal(null, SlideList[i]);
                }
            }

            ToggleObjects();

            var test = 0;
        }, false);
    };

    this.ResetExternal = function (bolReset, context) {
        bolReset = (bolReset == null ? options.ResetExternal : bolReset);
        context = (context == null ? ctx : context);

        if (bolReset) {//should we reset this slide if the user clicks on another card?
            ToggleObjects(true, context);
        }
    }

    this.InitializeObjects = function (context, bolBaseClass) {
        context = (context == null ? ctx : context);
        bolBaseClass = (bolBaseClass == null ? true : bolBaseClass);

        containerObj.className = context.ctxOptions.TextInitialBaseEffectClass /*(bolBaseClass ? context.ctxOptions.TextInitialBaseEffectClass : context.ctxOptions.TextBaseEffectClass) */ + " " + context.ctxOptions.TextEndEffectDurationClass;
        containerObj.style.position = "relative";
        containerObj.style.visibility = "hidden";

        summaryObj.innerHTML = context.ctxOptions.summary;
        summaryObj.className = context.ctxOptions.SummaryClass;
        summaryObj.style.display = "block";

        if (context.ctxOptions.url != "") {
            summaryObj.href = context.ctxOptions.url;
        }

        titleObj.innerHTML = context.ctxOptions.title;
        titleObj.className = context.ctxOptions.TitleClass;
        titleObj.style.display = "block";

        imgObj.style.backgroundImage = "url('" + context.ctxOptions.img + "')";
        imgObj.style.backgroundRepeat = "no-repeat";
        imgObj.style.backgroundPosition = "top center";
        imgObj.style.height = "100%";
        imgObj.style.width = "100%";
        imgObj.style.position = "absolute";
        imgObj.style.left = "0px";
        imgObj.style.top = "0px";
        imgObj.style.textAlign = "center";
        imgObj.style.verticalAlign = "center";
        imgObj.className = context.ctxOptions.BackgroundInitialBaseEffectClass /*(bolBaseClass ? context.ctxOptions.BackgroundInitialBaseEffectClass : context.ctxOptions.BackgroundBaseEffectClass)*/ + " " + context.ctxOptions.BackgroundEndEffectDurationClass;

        arrowObj.className = "arrow-down";
        arrowObj.href = "#";
        arrowObj.innerHTML = "";
        arrowObj.style.display = "block"; //force it to act like a div...so that it renders properly

        
        moreInfoObj.style.position = "";
        moreInfoObj.style.border = "solid white 3px";
        moreInfoObj.style.display = "inline-block";
        moreInfoObj.style.fontSize = "1em";
        moreInfoObj.style.padding = "5px";
        moreInfoObj.style.color = "white";
        moreInfoObj.style.backgroundColor = "black";
        moreInfoObj.style.float = "right";
        

    }

    function ToggleObjects(bolReset, context) {
        bolReset = (bolReset == null ? false : bolReset);
        context = (context == null ? ctx : context);

        if (bolReset) {
            context.InitializeObjects(context, false);
        }
        else {

            SwapAnimationClasses(containerObj, options.TextInitialBaseEffectClass,
                                 options.TextBaseEffectClass, options.TextEndEffectClass,
                                 options.TextBaseEffectDurationClass, options.TextEndEffectDurationClass);

            SwapAnimationClasses(imgObj, options.BackgroundInitialBaseEffectClass,
                     options.BackgroundBaseEffectClass, options.BackgroundEndEffectClass,
                     options.BackgroundBaseEffectDurationClass, options.BackgroundEndEffectDurationClass);
        }
    }

    function SwapAnimationClasses(obj, InitialClass, BaseClass, EndClass, BaseDuration, EndDuration) {
        obj.className = obj.className.replace((obj.className.search(EndClass) != -1
                                        ? EndClass
                                        : BaseClass)
                                , (obj.className.search(EndClass) != -1
                                        ? BaseClass
                                        : EndClass))
                           .replace((obj.className.search(EndDuration) != -1
                                        ? options.EndDuration
                                        : BaseDuration)
                                , (obj.className.search(EndDuration) != -1
                                        ? BaseDuration
                                        : EndDuration))
                            //remove the base class, we don't need it after initial load
                           .replace(InitialClass, BaseClass);
    }
}

function InfoSlideOptions() {
    return {
        destObj: {},
        img: {},
        title: "",
        summary: "",
        ResetExternal: true,
        url: "",

        containerClassName: "",

        BackgroundBaseEffectClass: "",
        BackgroundEndEffectClass: "",
        BackgroundBaseEffectDurationClass: "",
        BackgroundEndEffectDurationClass: "",
        BackgroundInitialBaseEffectClass: "",

        TextBaseEffectClass: "",
        TextEndEffectClass: "",
        TextBaseEffectDurationClass: "",
        TextEndEffectDurationClass: "",
        TextInitialBaseEffectClass: "",
        TitleClass: "",
        SummaryClass: "",

        MoreInfo: "More Information"
    };
}