"use strict";

var toptip = new TopTip();

$(async function() {

    var isPlugin = getUrlPara("from", "") == "plugin";

    var quoteIDs = [
        "hk00700", // tencent
        "hk09988", // ali
        "sh000001", // 上证指数
        "sh000016", // 上证50
        "sh510050", // 50ETF
        "sh510300", // 300ETF
        "hkHSI", // 恒生指数
        "sz159920", // 恒生ETF
        "hkHSCEI", // 国企指数
        "sh510900", // H股ETF
        //"sh601111", // 国航
        //"sh600050", // 联通
        //"sh601288", // 农行
        //"sh601398", // 工行
        //"sh601186", // 中国铁建
        "#cmt"
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
        $row.find(".last-quote").text(beautyQuotePrice(info.lastQuote));
        $row.find(".now-quote").text(beautyQuotePrice(info.nowQuote));
        $row.find(".min-quote").text(beautyQuotePrice(info.minQuote));
        $row.find(".max-quote").text(beautyQuotePrice(info.maxQuote));
        $row.find(".percent").text(info.percentStr);

        $quoteTbl.find("tbody").append($row);
    });


    mask.hide();


});
