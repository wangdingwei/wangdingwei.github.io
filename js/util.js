
/**
 * id
 * quoteName
 * lastQuote
 * nowQuote
 * date
 * time
 */
function parseSinaQuote(id, str) {
    var info = {id: id};
    if (str == "") {
        return info;
    }
    var arr = str.split(",");

    var debugStr = [];
    arr.forEach((val, idx) => {
        debugStr.push(idx + " " + val);
        //console.log(idx, val);
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
        info.nowQuote = parseFloat(arr[6]);
        info.date = arr[17];
        info.time = arr[18];
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

