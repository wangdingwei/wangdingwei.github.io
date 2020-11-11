"use strict";

$(async function() {

    var toptip = new TopTip();

    var $quoteTbl = $(".quote-tbl");
    var pricePercent = [10, 8, 7, 6, 5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 
                        -1, -1.5, -2, -2.5, -3, -3.5, -4, -5, -6, -7, -8, -10];


    var sym = getUrlPara("sym", "");

    function submit() {
        var s = $("#sym").val();
        if (s == "") {
            toptip.show("please input security symbol", 3);
            return false;
        }
        window.location.replace("?sym=" + s);
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


    $("#sym").val(sym);

    if(sym == "") {
        $quoteTbl.hide();
        mask.hide();
        return;
    } else {
    }
    mask.hide();


    pricePercent.forEach(percent => {
        var $tr = $("<tr>");
        $tr.addClass("percent_" + percent*100);

        var $td = $("<td class='text-right'>").text(Number(percent).toFixed(1) + "%");
        $tr.append($td);

        $quoteTbl.find("tbody").append($tr);
    });





    var infos = await getQuoteInfos([sym], "qq");
    if (infos.length == 0) {
        toptip.show("not found: " + sym);
        $quoteTbl.hide();
        return;
    }
    var info = infos[0];
    document.title = info.name;

    $quoteTbl.find("tr th:first-child").text(info.lastQuote);

    $quoteTbl.find(".prev-close").append($("<td>").text(info.prevClose));
    $quoteTbl.find(".now").append($("<td>").text(info.now + "(" + info.percent + "%)"));


    $quoteTbl.find("thead tr").append($("<th>").text(info.name + "(" + info.time + ")"));

    pricePercent.forEach(percent => {
        var $row = $quoteTbl.find(".percent_" + percent*100);
        var $td = $("<td>");
        var price = info.prevClose + info.prevClose*percent/100;
        price = beautyPrice(price);

        $td.text(price);
        /*
        var qty = parseInt(10000/price);
        $td.text(price + "(" + qty + ")");
        */



        $row.append($td);
    });

    mask.hide();


    return;


});
