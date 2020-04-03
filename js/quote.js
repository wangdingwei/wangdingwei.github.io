"use strict";

$(function() {

    var quoteIDs = [
        "sh510050",
        "sh510300", 
        "sh510900",
        "sh601111",
        "sh600050",
        "sh601288",
        "sh601398",
        "hf_CHA50CFD"
    ];
    var $quoteTbl = $(".quote-tbl");
    var $quoteRowTmpl = $(".quote-row-tmpl").detach().removeClass("hide");



    var notFoundQuotes = [];
    $.ajax({
        url: "//hq.sinajs.cn/list=" + quoteIDs.join(","),
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
                $row.find(".quote-name a").text(info.quoteName).attr("href", "quote_detail.html?id=" + id);
                $row.find(".quote-id a").text(id).attr("href", "quote_detail.html?id=" + id);
                $row.find(".last-quote").text(info.lastQuote);
                $row.find(".now-quote").text(info.nowQuote);
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
