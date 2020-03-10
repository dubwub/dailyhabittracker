export function syncScroll(e) {
    const ctr_contents = document.getElementsByClassName("ctr-contents")
    console.log(ctr_contents);

    let element = e.target;
    let scroll = element.scrollLeft;
    let scrollIncrement = parseInt(element.scrollLeft / 50);
    
    Array.prototype.forEach.call(ctr_contents, function(element) {
        element.scrollLeft = scroll;
    });
}
