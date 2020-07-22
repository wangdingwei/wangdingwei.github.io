"use strict";

$(function() {

    var toptip = new TopTip();

    class Unit {
        constructor(items) {
            this.idx = 0;
            this.items = items;
            this.length = items.length;
            this.uid = Math.random();
        }

        isLast() { return this.idx >= this.length - 1; }
        next() {
            if (this.isLast()) {
                throw `no more in uint`;
            }
            this.idx++;
        }
        get() { return this.items[this.idx]; }
    }

    class CardNo {
        constructor(card) {
            this.card = card;
            this.cardUnits = [];
            this.globUnits = [];
            this.stopped = false;

            this._parse();
        }

        _parse() {
            this.card.replace(/[ \t]+/g, "");
            this.card = this.card.trim();
            if (!this.card) return;

            let unitMap = new Map();

            for (let i = 0; i < this.card.length; ++i) {
                let c = this.card.charAt(i);
                if (c.match(/[0-9]/)) { // digit
                    let u = new Unit([c]);
                    this.cardUnits.push(u);
                }
                else if (c == "*") { // 
                    let u = new Unit(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
                    this.cardUnits.push(u);
                    this.globUnits.push(u);
                }
                else {
                    if (unitMap.has(c)) {
                        this.cardUnits.push(unitMap.get(c));
                    } 
                    else {
                        let u = new Unit(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
                        this.cardUnits.push(u);
                        this.globUnits.push(u);
                        unitMap.set(c, u);
                    }
                }
            }

            this.globUnits.reverse();
        }

        _getCur() {
            let c = "";
            for (let i = 0, len = this.cardUnits.length; i < len; ++i) {
                c += this.cardUnits[i].get();
            }
            return c;
        }

        stop() {
            this.stopped = true;
        }
        async forEach(cb) {
            this.stopped = false;
            let units = this.globUnits;
            //debugger;
            for (let i = 0, len = units.length; i < len && !this.stopped;) {
                let unit = units[i];
                let cbRtn = cb(this._getCur()); 
                if (cbRtn != null && cbRtn >= 0) {
                    await sleep(cbRtn);
                }
                if (unit.isLast()) { // 进入下一个unit
                    for (let j = 0; j <= i; ++j) { // 当前的也要重置
                        units[j].idx = 0;
                    }
                    // 类似与进位
                    while (true) {
                        ++i;
                        if (i >= len) return;
                        if (units[i].isLast()) {
                            units[i].idx = 0; // 进位，当前也要重置
                            continue;
                        } else {
                            units[i].next();
                            break;
                        }
                    }
                    i = 0;

                } else { // 当前unit, 下一位
                    unit.next();
                    i = 0;
                    for (let j = 0; j < i; ++j) {
                        units[j].idx = 0;
                    }
                }

            }
            cb(this._getCur());
        }
    }


    /*
    let cn = new CardNo("1234CCDD");
    console.log(cn);
    cn.forEach(c => {
        console.log(c);
    });
    */

    let $rslt = $("#rslt");
    let $tip = $(".alert");
    let cn = null;
    $(".submit").click(async () => {
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
            $rslt.append(cards);
            $tip.text(`calc ${totalCnt} card no ......`);
            cards = "";
            curCnt = 0;
        }

        await cn.forEach(c => {
            let isValidate = luhn_validate(c);
            //console.log(c, isValidate);
            if (isValidate) {
                curCnt++;
                totalCnt++;
                //console.log(c, isValidate);
                cards += c + "\n";
                if (curCnt >= displayCnt) {
                    doRsltCards();
                    return 0;
                }
            }
        });
        if (curCnt > 0) {
            doRsltCards();
        }
        $tip.text(`calc ${totalCnt} card no`);
    });


    mask.hide();
});
