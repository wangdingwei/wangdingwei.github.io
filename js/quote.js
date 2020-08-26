"use strict";

var toptip = new TopTip();

$(async function() {

    var isPlugin = getUrlPara("from", "") == "plugin";

    var quoteIDs = [
        "hk00700",
        "sh000001",
        "sh000016",
        "sh510050",
        "sh510300", 
        "sz159920",
        "sh510900",
        "sh601111",
        "sh600050",
        "sh601288",
        "sh601398",
		"sh601186"
    ];
    var $quoteTbl = $(".quote-tbl");
    var $quoteRowTmpl = $(".quote-row-tmpl").detach().removeClass("quote-row-tmpl hide");


    var infos = await getQuoteInfos(quoteIDs, "qq");
    infos.forEach(info => {
        var $row = $quoteRowTmpl.clone();
        if (isPlugin) {
            $row.find(".quote-name").text(info.quoteName);
        } else {
            $row.find(".quote-name a").text(info.quoteName).attr("href", "quote_detail.html?id=" + info.id);
        }
        function fmt(quote) {
            if (quote >= 1000) {
                return parseInt(quote);
            }
            return quote;
        }
        $row.find(".last-quote").text(fmt(info.lastQuote));
        $row.find(".now-quote").text(fmt(info.nowQuote));
        $row.find(".percent").text(info.percentStr);

        $quoteTbl.find("tbody").append($row);
    });


    mask.hide();


});
