"use strict";

var toptip = new TopTip();

$(function() {

    var isPlugin = getUrlPara("from", "") == "plugin";

    var quoteIDs = [
        "rt_hk00700",
        "sh000001",
        "sh000016",
        "sh510050",
        "sh510300", 
        "sz159920",
        "sh510900",
        "sh601111",
        "sh600050",
        "sh601288",
        "sh601398",
		"sh601186",
        "hf_CHA50CFD"
    ];
    var $quoteTbl = $(".quote-tbl");
    var $quoteRowTmpl = $(".quote-row-tmpl").detach().removeClass("quote-row-tmpl hide");



    var notFoundQuotes = [];
    $.ajax({
        url: "https://hq.sinajs.cn/list=" + quoteIDs.join(","),
        dataType: "script",
        cache: "true",
        success: function() {
            quoteIDs.forEach(id => {
                var rslt = window["hq_str_" + id]; 
                if (!rslt || rslt == "") {
                    notFoundQuotes.push(id);
                    return;
                }

                var info = parseSinaQuote(id, rslt);



                var $row = $quoteRowTmpl.clone();
                if (isPlugin) {
                    $row.find(".quote-name").text(info.quoteName);
                } else {
                    $row.find(".quote-name a").text(info.quoteName).attr("href", "quote_detail.html?id=" + id);
                }
                function fmt(quote) {
                    if (quote >= 1000) {
                        return parseInt(quote);
                    }
                    return quote;
                }
                $row.find(".last-quote").text(fmt(info.lastQuote));
                $row.find(".now-quote").text(fmt(info.nowQuote));
                $row.find(".percent").text(info.percentStr);

                $quoteTbl.find("tbody").append($row);

            });

            if (notFoundQuotes.length > 0) {
                toptip.show("not found: " + notFoundQuotes);
            }
        }
      }).always(() => {
          mask.hide();
      });


});
