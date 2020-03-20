"use strict";

$(function() {

    var quoteIDs = ["sh510050", "sh510300"];
    var $quoteTbl = $(".quote-tbl");
    var pricePercent = [10, 8, 6, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 
                        -1, -1.5, -2, -2.5, -3, -3.5, -4, -4.5, -5, -6, -8, -10];


    pricePercent.forEach(percent => {
        var $tr = $("<tr>");
        $tr.addClass("percent_" + percent*100);

        var $td = $("<td class='text-right'>").text(Number(percent).toFixed(1) + "%");
        $tr.append($td);

        $quoteTbl.find("tbody").append($tr);
    });


    $.ajax({
        url: "//hq.sinajs.cn/list=" + quoteIDs.join(","),
        dataType: "script",
        cache: "true",
        success: function() {
            quoteIDs.forEach(id => {
                var arr = window["hq_str_" + id].split(",");
                console.log(arr);
                var quoteName = arr[0];
                var lastQuote = parseFloat(arr[2]);
                var nowQuote = parseFloat(arr[3]);

                var nowPercent = (nowQuote - lastQuote)*100.0/lastQuote;
                nowPercent = Number(nowPercent).toFixed(2);

                $quoteTbl.find(".last-quote").append($("<td>").text(lastQuote));
                $quoteTbl.find(".now-quote").append($("<td>").text(nowQuote + "(" + nowPercent + "%)"));


                $quoteTbl.find("thead tr").append($("<th>").text(quoteName));

                pricePercent.forEach(percent => {
                    var $row = $quoteTbl.find(".percent_" + percent*100);
                    var $td = $("<td>");
                    var price = lastQuote + lastQuote*percent/100;
                    price = Number(price).toFixed(3);

                    var qty = parseInt(10000/price);

                    $td.text(price + "(" + qty + ")");



                    $row.append($td);
                });

            });
        }
      }).always(() => {
          mask.hide();
      });
});
