"use strict";

$(async function() {

    const QuoteCalPriceKey = "quote_calc_price";

    var toptip = new TopTip();

    var pricePercent = [10, 8, 7, 6, 5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 
                        -1, -1.5, -2, -2.5, -3, -3.5, -4, -5, -6, -7, -8, -10];


    var $items = $("#items");
    var $itemTmpl = $(".w-item-tmpl").detach().removeClass("w-item-tmpl");

    function submit() {
        $items.empty();
        toptip.hide();
        var quotePrice = $("#quote").val();
        if (quotePrice == "") {
            toptip.show("quote is empty", 5);
            return;
        }
        cookie.set(QuoteCalPriceKey, quotePrice, 24*30);

        pricePercent.forEach(percent => {
            var $item = $itemTmpl.clone();
            $item.find(".percent").text(Number(percent).toFixed(1) + "%");

            var price = quotePrice + quotePrice*percent/100
            price = beautyPrice(price);
            $item.find(".val").text(price);

            $items.append($item);
        });
    }
    $(".submit").click(evt => {
        submit();
    });
    $("#quote").keypress(evt => {
        var keycode = (evt.keyCode ? evt.keyCode : evt.which);
        if(keycode == '13'){
            submit();
        }
    });

    var quotePrice = cookie.get(QuoteCalPriceKey);
    if (quotePrice != "") {
        $("#quote").val(quotePrice);
        submit();
    }

    mask.hide();



});
