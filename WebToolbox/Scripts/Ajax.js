//depends on Generic.js

function ajax(paramsObj) {
    var _g = new Generic();

    var urlAddress = objExists(paramsObj.urlAddress, paramsObj.urlAddress, "");
    var requestType = objExists(paramsObj.requestType, paramsObj.requestType, "GET");
    var requestParams = objExists(paramsObj.requestParams, paramsObj.requestParams, "");
    var bolAsync = objExists(paramsObj.bolAsync, paramsObj.bolAsync, true);
    var success = objExists(paramsObj.success, paramsObj.success, null);
    var successArgs = objExists(paramsObj.successArgs, paramsObj.successArgs, null);

    var DisplayCustomError = function (responseText, theFailArgs) {
        _g.DisplayCustomError(ResponseSanitize(responseText));
    };

    var fail = objExists(paramsObj.fail, paramsObj.fail, DisplayCustomError);
    var failArgs = objExists(paramsObj.failArgs, paramsObj.failArgs, null);

    if (requestType == "GET" && requestParams != "") {
        urlAddress += "?" + requestParams;
    }

    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.withCredentials = true;

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200 && success != null) {
            //try {
            tsv = xmlhttp.responseText;
            success(xmlhttp, successArgs);
        }
        else if (xmlhttp.readyState == 4 && xmlhttp.status != 200) {
            fail(xmlhttp.responseText, failArgs);
        }
    }
    xmlhttp.open(requestType, urlAddress, bolAsync);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send((requestType == "POST" ? requestParams : null));
}

function ResponseSanitize(strInput) {
    return strInput.replace(/(<([^>]+)>)/g, "");
}


function objExists(obj, existsObj, missingObj) {
    existsObj = (existsObj == null || typeof obj == 'undefined' ? true : existsObj);
    missingObj = (missingObj == null || typeof missingObj == 'undefined' ? false : missingObj);
    return (obj == null || typeof obj == 'undefined' ? missingObj : existsObj);
}