/** show/hide heading numberss */
const showHeadings = () => {
    let id = "style-set-headings-sheet";
    let stylesheet = document.getElementById(id);
    if (stylesheet) {
        stylesheet.remove();
    }
    else {
        stylesheet = document.createElement('style');
        stylesheet.id = "style-set-headings-sheet";
        document.head.appendChild(stylesheet);
        let genRule =
            ':is(h1,h2,h3,h4,h5,h6,[role="heading"])::before { '
            + " position: absolute!important;"
            + " background: rgba(0,0,0,0.8)!important;"
            + " font-size: 19px!important;"
            + " color: white!important;"
            + " top: -24px!important;"
            + " height: 3rem!important;"
            + " width: 3rem!important;"
            + " padding: 5px!important;"
            + " border-radius: 3px!important;";
        + "}";
        let headingRule = ':is(h1,h2,h3,h4,h5,h6,[role="heading"]) { position: relative!important; }';
        stylesheet.sheet.insertRule(genRule);
        stylesheet.sheet.insertRule(headingRule);
        for (let i = 1; i < 7; i++) {
            let contentRule = `:is(h${i},[aria-level="${i}"])::before { content: 'h${i}'!important; }`;
            stylesheet.sheet.insertRule(contentRule);
        }
        let rule = "option:hover { background-color: #E8E8E8!important; }";
        stylesheet.sheet.insertRule(rule);

        rule = '*:has(:is(h1, h2, h3, h4, h5, h6, [role="heading"])) { overflow: visible!important; }';
        stylesheet.sheet.insertRule(rule);
    }
}
showHeadings();