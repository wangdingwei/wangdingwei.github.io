"use strict";

$(async function() {

    const last_calc_security_price = "last_calc_security_price";

    var toptip = new TopTip();

    var pricePercent = [10, 8, 7, 6, 5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 
                        -1, -1.5, -2, -2.5, -3, -3.5, -4, -5, -6, -7, -8, -10];


    var $items = $("#items");
    var $itemTmpl = $(".w-item-tmpl").detach().removeClass("w-item-tmpl");

    function submit() {
        $items.empty();
        toptip.hide();
        var price = $("#price").val();
        if (price == "") {
            toptip.show("price is empty", 5);
            return;
        }
        cookie.set(last_calc_security_price, price, 24*30);

        pricePercent.forEach(percent => {
            var $item = $itemTmpl.clone();
            $item.find(".percent").text(Number(percent).toFixed(1) + "%");

            var p = price + price*percent/100
            p = beautyPrice(p);
            $item.find(".val").text(p);

            $items.append($item);
        });
    }
    $(".submit").click(evt => {
        submit();
    });
    $("#price").keypress(evt => {
        var keycode = (evt.keyCode ? evt.keyCode : evt.which);
        if(keycode == '13'){
            submit();
        }
    });

    var price = cookie.get(last_calc_security_price);
    if (price != "") {
        $("#price").val(price);
        submit();
    }

    mask.hide();



});
