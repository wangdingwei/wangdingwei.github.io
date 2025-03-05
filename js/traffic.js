function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
/**
 * @items [{txt, lbl}]
 */
function dealItems($items, items) {
    //let $items = $("#items");
    shuffleArray(items);
    for (const item of items) {
        let $i = $('<li class="list-group-item"><span class="txt"></span><span class="badge text-bg-primary rounded-pill d-none lbl"></span></li>');
        $i.find(".txt").text(item.txt);
        $i.find(".lbl").text(item.lbl);
        $items.append($i);

        $i.on("dblclick", function() {
            let $li = $(this);
            $li.find(".lbl").removeClass("d-none");
        });
    }
}
