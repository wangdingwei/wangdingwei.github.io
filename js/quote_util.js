
/*
 * https://qt.gtimg.cn/q=r_hk00700,sh000001
 * https://hq.sinajs.cn/list=rt_hk00700,sh000001
 * 
 * 
 * 跨域(Access-Control-Allow-Origin): 新浪不支持, QQ支持
 * 竞价阶段报价更新: 新浪不支持, QQ支持
 * 港股实时报价: 新浪rt_, QQ r_
 * chrome extension不能用jsonp, 不允许执行远程脚本
 */

/**
 * id
 * quoteName
 * lastQuote
 * nowQuote
 * date
 * time
 */
function parseSinaQuote(id, str) {
    var info = {id: id.replace(/^rt_/, "")};
    if (str == "") {
        return info;
    }
    var arr = str.split(",");

    var debugStr = [];
    arr.forEach((val, idx) => {
        debugStr.push(idx + " " + val);
    });
    window.IsDebug && console.log("------ " + id + " ------\n" + debugStr.join("; "));
    if (id.startsWith("hf_")) { // 期货
        //info.name = arr[];
        info.quoteName = arr[13];
        info.lastQuote = parseFloat(arr[7]); // 昨收
        info.nowQuote = parseFloat(arr[0]);
        info.date = arr[12];
        info.time = arr[6];
    }
    else if(id.startsWith("hk") || id.startsWith("rt_hk")) {
        info.quoteName = arr[0];
        info.lastQuote = parseFloat(arr[3]); // 昨收
        info.date = arr[17];
        info.time = arr[18];

        // 6不包含竞价, 9买1， 10卖1
        info.nowQuote = parseFloat(arr[6]);
    }
    else {
        info.quoteName = arr[0];
        info.lastQuote = parseFloat(arr[2]); // 昨收
        info.nowQuote = parseFloat(arr[3]);
        info.date = arr[30];
        info.time = arr[31];
    }

    var nowPercent = (info.nowQuote - info.lastQuote)*100.0/info.lastQuote;
    nowPercent = Number(nowPercent).toFixed(2);

    info.percent = nowPercent;
    info.percentStr = nowPercent >= 0 ? "+" + nowPercent + "%" : nowPercent + "%"; 

    window.IsDebug && console.log(info);
    return info;
}


function parseQQQuote(id, str) {
    var info = {id: id.replace(/^r_/, "")};
    if (str == "") {
        return info;
    }
    var arr = str.split("~");

    var debugStr = [];
    arr.forEach((val, idx) => {
        debugStr.push(idx + " " + val);
    });
    window.IsDebug && console.log("------ " + id + " ------\n" + debugStr.join("; "));
    if(id.startsWith("hk") || id.startsWith("r_hk")) {
        info.quoteName = arr[1];
        info.lastQuote = parseFloat(arr[4]); // 昨收
        info.nowQuote = parseFloat(arr[3]);
        info.date = arr[30].split(" ")[0];
        info.time = arr[30].split(" ")[1];
    }
    else {
        info.quoteName = arr[1];
        info.lastQuote = parseFloat(arr[4]); // 昨收
        info.nowQuote = parseFloat(arr[3]);
        info.date = arr[30].substring(0, 8);
        info.time = arr[30].substring(8).match(/\d{2}/g).join(":");
    }

    var nowPercent = (info.nowQuote - info.lastQuote)*100.0/info.lastQuote;
    nowPercent = Number(nowPercent).toFixed(2);

    info.percent = nowPercent;
    info.percentStr = nowPercent >= 0 ? "+" + nowPercent + "%" : nowPercent + "%"; 

    window.IsDebug && console.log(info);
    return info;
}

function stdQuoteIds(ids, src) {
    var isQQ = src != "sina";
    var arr = [];
    ids.forEach(v => {
        if (v.startsWith("hk")) {
            v = isQQ ? "r_" + v : "rt_" + v;
        } 
        else {
        }
        arr.push(v);
    });
    return arr;
}

function getQuoteInfos(ids, src) {
    ids = stdQuoteIds(ids, src);
    var isQQ = src != "sina";
    var urlPrefix = isQQ ? "https://qt.gtimg.cn/q=" : "https://hq.sinajs.cn/list=";
    
    return new Promise((resolve, reject) => {
        $.ajax({
            url: urlPrefix + ids.join(","),
            success: function(data) {
                let infos = [];
                if (data.startsWith("v_pv_none_match=")) {
                    resolve(infos);
                    return;
                }
                //console.log(data);
                data.split(/[\r\n;]+/).forEach((v) => {
                    v = v.trim();
                    if (v.length == 0) return;
                    var quoteId = v.replace(/(var hq_str_|v_)/g, "").replace(/=[^=]*/,'').replace(/["\r\n]/g, "");
                    var quoteStr = v.replace(/[^=]*=/,'').replace(/["\r\n]/g, "");
                    var info = isQQ ? parseQQQuote(quoteId, quoteStr) : parseSinaQuote(quoteId, quoteStr);
                    infos.push(info);
                });
                resolve(infos);
            }
        }).fail(function() {
            console.warn("get quote info failed", arguments);
            reject();
        });
    });
}



function getQuoteInfosJSONP(ids, src) {
    ids = stdQuoteIds(ids, src);
    var isQQ = src != "sina";
    var urlPrefix = isQQ ? "https://qt.gtimg.cn/q=" : "https://hq.sinajs.cn/list=";

    return new Promise((resolve, reject) => {
        $.ajax({
            url: urlPrefix + ids.join(","),
            dataType: "script",
            cache: "true",
            success: function(data) {
                let infos = [];

                ids.forEach(quoteId => {
                    var key = isQQ ? "v_" : "hq_str_";
                    key += quoteId;
                    var quoteStr = window[key];
                    var info = isQQ ? parseQQQuote(quoteId, quoteStr) : parseSinaQuote(quoteId, quoteStr);
                    infos.push(info);
                });
                resolve(infos);
            }
        }).fail(function() {
            console.warn("get quote info failed", arguments);
            reject();
        });
    });
}

