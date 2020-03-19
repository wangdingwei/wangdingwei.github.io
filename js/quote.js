"use strict";

$(function() {

    var quoteIDs = ["sh510050", "sh510300"];
    var $quoteTbl = $(".quote-tbl");
    var priceStep = 1;


    for (var i = 10; i >= -10; i = i - priceStep) {
        var $tr = $("<tr>");
        $tr.addClass("percent-" + i*100);

        var $td = $("<td class='text-right'>").text(Number(i).toFixed(1) + "%");
        $tr.append($td);

        $quoteTbl.find("tbody").append($tr);
    }


    $.ajax({
        url: "//hq.sinajs.cn/list=" + quoteIDs.join(","),
        dataType: "script",
        cache: "true",
        success: function() {
            quoteIDs.forEach(id => {
                var arr = window["hq_str_" + id].split(",");
                console.log(arr);
                var quoteName = arr[0];
                var ydaQuote = parseFloat(arr[2]);
                var nowQuote = parseFloat(arr[3]);

                $quoteTbl.find(".quote-name").append($("<th>").text(quoteName));
                $quoteTbl.find(".yda-quote").append($("<th>").text(ydaQuote));

                for (var i = 10; i >= -10; i = i - priceStep) {
                    var $row = $quoteTbl.find(".percent-" + i*100);
                    var $td = $("<td>");
                    var price = ydaQuote + ydaQuote*i/100;
                    price = Number(price).toFixed(3);
                    $td.text(price);
                    $row.append($td);
                }

            });
        }
      });
});
