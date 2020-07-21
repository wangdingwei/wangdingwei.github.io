"use strict";

$(function() {

    var toptip = new TopTip();

    var quoteIDs = [
    ];
    var $quoteTbl = $(".quote-tbl");
    var pricePercent = [10, 8, 7, 6, 5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 
                        -1, -1.5, -2, -2.5, -3, -3.5, -4, -5, -6, -7, -8, -10];


    var id = getUrlPara("id", "");

    function submit() {
        var id = $("#quote-id").val();
        if (id == "") {
            toptip.show("please input id", 3);
            return false;
        }
        window.location.replace("?id=" + id);
    }
    $(".submit").click(evt => {
        submit();
    });
    $("#quote-id").keypress(evt => {
        var keycode = (evt.keyCode ? evt.keyCode : evt.which);
        if(keycode == '13'){
            submit();
        }
    });


    $("#quote-id").val(id);

    if(id == "") {
        $quoteTbl.hide();
        mask.hide();
        return;
    } else {
        quoteIDs = [id];
    }


    pricePercent.forEach(percent => {
        var $tr = $("<tr>");
        $tr.addClass("percent_" + percent*100);

        var $td = $("<td class='text-right'>").text(Number(percent).toFixed(1) + "%");
        $tr.append($td);

        $quoteTbl.find("tbody").append($tr);
    });


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


                document.title = info.quoteName;

                $quoteTbl.find("tr th:first-child").text(info.lastQuote);

                $quoteTbl.find(".last-quote").append($("<td>").text(info.lastQuote));
                $quoteTbl.find(".now-quote").append($("<td>").text(info.nowQuote + "(" + info.percent + "%)"));


                $quoteTbl.find("thead tr").append($("<th>").text(info.quoteName + "(" + info.time + ")"));

                pricePercent.forEach(percent => {
                    var $row = $quoteTbl.find(".percent_" + percent*100);
                    var $td = $("<td>");
                    var price = info.lastQuote + info.lastQuote*percent/100;
                    price = Number(price).toFixed(3);

                    $td.text(price);
                    /*
                    var qty = parseInt(10000/price);
                    $td.text(price + "(" + qty + ")");
                    */



                    $row.append($td);
                });

            });

            if (notFoundQuotes.length > 0) {
                $quoteTbl.hide();
                toptip.show("not found: " + notFoundQuotes);
            }
        }
      }).always(() => {
          mask.hide();
      });


});
