"use strict";

$(function() {

    var quoteIDs = [
        "sh510050",
        "sh510300", 
        "sh510900"
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
                var arr = window["hq_str_" + id].split(",");
                console.log(arr);
                var quoteName = arr[0];
                var lastQuote = parseFloat(arr[2]);
                var nowQuote = parseFloat(arr[3]);

                var nowPercent = (nowQuote - lastQuote)*100.0/lastQuote;
                nowPercent = Number(nowPercent).toFixed(2);
                var strPercent = nowPercent >= 0 ? "+" + nowPercent + "%" : "-" + nowPercent + "%";


                var $row = $quoteRowTmpl.clone();
                $row.find(".quote-name a").text(quoteName).attr("href", "quote_detail.html?id=" + id);
                $row.find(".quote-id a").text(id).attr("href", "quote_detail.html?id=" + id);
                $row.find(".last-quote").text(lastQuote);
                $row.find(".now-quote").text(nowQuote);
                $row.find(".percent").text(strPercent);

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
