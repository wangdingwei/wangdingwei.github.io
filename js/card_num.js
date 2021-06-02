"use strict";

$(function() {

    var toptip = new TopTip();



    let cardNumPattern = cookie.get("card_num_pattern");
    if (cardNumPattern) {
        $("#card").val(cardNumPattern);
    }


    let $rslt = $("#rslt");
    let $tip = $(".alert");
    let cn = null;

    async function calc() {
        if (cn) cn.stop();
        $rslt.empty();
        let card = $("#card").val();
        console.log(card);
        cookie.set("card_num_pattern", card, 24*30);
        if (!card) {
            $tip.text("please input card");
            return;
        }

        cn = new CardNo(card);
        console.log(cn);
        if (cn.err) {
            toptip.show(cn.err);
            return;
        }

        $tip.text(`begin calc: ${card}`);

        let curCnt = 0;
        let totalCnt = 0;
        let cards = "";
        let displayCnt = random(90, 110);

        function doRsltCards() {
            displayCnt = random(90, 110);
            // $rslt.append(cards);
            $rslt.append($("<pre></pre>").text(cards));
            $tip.text(`calc ${totalCnt} card num ......`);
            cards = "";
            curCnt = 0;
        }

        await cn.forEachOnlyLuhnValid(c => {
            curCnt++;
            totalCnt++;
            //console.log(c, isValidate);
            cards += c + "\n";
            if (curCnt >= displayCnt) {
                doRsltCards();
                return 0;
            }
        });
        if (curCnt > 0) {
            doRsltCards();
        }
        if (totalCnt == 0) {
            $tip.text(`no card available: ${card}`);
        } else {
            $tip.text(`calc ${totalCnt} card num`);
        }
    }

    $(".submit").click(calc);
    $("body").on("keydown", e => {
        if (e.which == 13) {
            calc();
        }
    });


    function calCardLen() {
        var val = $("#card").val();
        val = val.replace(/[ \t]+/g, "");
        $("#card-length").text(val.length);
    }
    $("#card").on('change keydown paste input', function() {
        calCardLen();
    });

    mask.hide();
});
