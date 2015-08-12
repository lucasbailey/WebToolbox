//file depends on Effects.css

function InfoSlides(options) {
    if (typeof SlideList == 'undefined') {
        SlideList = [];        
    }

    SlideList[SlideList.length] = this;

    var ctx = this;
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
    


    this.Display = function () {
        var obj = options.destObj;
        obj.className = options.containerClassName;
        obj.style.position = "relative";

        var titleObj = document.createElement("div");
        titleObj.innerHTML = options.title;
        titleObj.className = options.TitleClass;
        titleObj.style.display = "block";

        var imgObj = document.createElement("div");
        imgObj.style.backgroundImage = "url('" + options.img + "')";
        imgObj.style.backgroundRepeat = "no-repeat";
        imgObj.style.backgroundPosition = "center center";
        imgObj.style.height = "100%";
        imgObj.style.width = "100%";
        imgObj.style.position = "absolute";
        imgObj.style.left = "0px";
        imgObj.style.top = "0px";
        imgObj.className = options.BackgroundInitialBaseEffectClass + " " + options.BackgroundEndEffectDurationClass;

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

        var summaryObj = (options.url != "" ? document.createElement("a") : document.createElement("div"));
        summaryObj.innerHTML = options.summary;
        summaryObj.className = options.SummaryClass;
        summaryObj.style.display = "block";

        if (options.url != "") {
            summaryObj.href = options.url;
            
        }

        var containerObj = document.createElement("div");
        
        containerObj.className = options.TextInitialBaseEffectClass + " " + options.TextEndEffectDurationClass;
        containerObj.style.position = "relative";
        containerObj.style.visibility = "hidden";
        

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

        var times = "";

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

            containerObj.className = containerObj.className.replace((containerObj.className.search(options.TextEndEffectClass) != -1
                                                ? options.TextEndEffectClass
                                                : options.TextBaseEffectClass)
                                        , (containerObj.className.search(options.TextEndEffectClass) != -1
                                                ? options.TextBaseEffectClass
                                                : options.TextEndEffectClass))
                                   .replace((containerObj.className.search(options.TextEndEffectDurationClass) != -1
                                                ? options.TextEndEffectDurationClass
                                                : options.TextBaseEffectDurationClass)
                                        , (containerObj.className.search(options.TextEndEffectDurationClass) != -1
                                                ? options.TextBaseEffectDurationClass
                                                : options.TextEndEffectDurationClass))
                                    //remove the base class, we don't need it after initial load
                                   .replace(options.TextInitialBaseEffectClass, options.TextBaseEffectClass);

            imgObj.className = imgObj.className.replace((imgObj.className.search(options.BackgroundEndEffectClass) != -1
                                                ? options.BackgroundEndEffectClass
                                                : options.BackgroundBaseEffectClass)
                                        , (imgObj.className.search(options.BackgroundEndEffectClass) != -1
                                                ? options.BackgroundBaseEffectClass
                                                : options.BackgroundEndEffectClass))
                                   .replace((imgObj.className.search(options.BackgroundEndEffectDurationClass) != -1
                                                ? options.BackgroundEndEffectDurationClass
                                                : options.BackgroundBaseEffectDurationClass)
                                        , (imgObj.className.search(options.BackgroundEndEffectDurationClass) != -1
                                                ? options.BackgroundBaseEffectDurationClass
                                                : options.BackgroundEndEffectDurationClass))
                                    //remove the base class, we don't need it after initial load
                                   .replace(options.BackgroundInitialBaseEffectClass, options.BackgroundBaseEffectClass);
            var test = 0;
        }, false);
    };


}