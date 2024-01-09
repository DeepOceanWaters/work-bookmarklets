const stylesheetId = "all-custom-style-sheet";
let stylesheet = document.getElementById(stylesheetId);
if (stylesheet) {
    stylesheet.remove();
    return;
}
stylesheet = document.createElement('style');
stylesheet.id = stylesheetId;
document.head.appendChild(stylesheet);

// style opt
let rule = "option:hover { background-color: #E8E8E8; }";
stylesheet.sheet.insertRule(rule);

// enlarge
rule = "select[multiple]:not(#essential_functionalities) { min-height: 200px; }";
stylesheet.sheet.insertRule(rule);

// expand multiple select
rule = "*:has(>select[multiple]:not(#success_criteria, #essential_functionalities):hover) { position:relative }";
stylesheet.sheet.insertRule(rule);

rule = 'select[multiple]:not(#success_criteria, #essential_functionalities, [aria-label="Select recommendations"]):hover {'
    + "min-height: 500px;"
    + "position: absolute;"
    + "background: white!important;"
    + "z-index: 1;"
    + "}"
stylesheet.sheet.insertRule(rule);

// add borders to better distinguish unique options in #pages select
rule = "#pages option { border-top: 8px solid #999; }"
stylesheet.sheet.insertRule(rule);

// set status height
const statusId = 'audit_status';
const statusEl = document.getElementById(statusId);
statusEl.parentElement.style.height = `${statusEl.parentElement.clientHeight}px`;