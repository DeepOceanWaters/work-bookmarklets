
let id = "style-set-an-element-sheet";
let stylesheet = document.getElementById(id);
if (stylesheet) {
    stylesheet.remove();
}
else {
    const radius = "0.35rem";
    let element = prompt('element(s) to expose (separate via comma, space, or semi-colon)');
    const elements = element.split(/[,| |;]+/gi).map(elName => elName.trim());
    stylesheet = document.createElement('style');
    stylesheet.id = id;
    document.head.appendChild(stylesheet);
    for (const el of elements) {
        let genRule =
            `${el}::before { `
            + ` content: "${el.replaceAll('"', "'")}"!important;`
            + " position: absolute!important;"
            + " background: rgba(0,0,0,0.8)!important;"
            + " font-size: 18px!important;"
            + " color: white!important;"
            + " top: 0px!important;"
            + " left: 0px!important;"
            + " padding: 5px!important;"
            + ` border-radius: ${radius}`
            + "}";
        let headingRule = `${el} {  position: relative!important; }`;
        stylesheet.sheet.insertRule(genRule);
        stylesheet.sheet.insertRule(headingRule);
    }
}