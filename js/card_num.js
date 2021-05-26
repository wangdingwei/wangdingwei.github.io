"use strict";

$(function() {

    var toptip = new TopTip();





    let $rslt = $("#rslt");
    let $tip = $(".alert");
    let cn = null;

    async function calc() {
        if (cn) cn.stop();
        $rslt.empty();
        let card = $("#card").val();
        console.log(card);
        if (!card) {
            $tip.text("please input card");
            return;
        }
        $tip.text(`begin calc: ${card}`);
        cn = new CardNo(card);
        console.log(cn);
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


    mask.hide();
});
