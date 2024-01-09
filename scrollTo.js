let curTarget = document.activeElement;
// while not tr, body, or html, get a parent element that is one of those.
while (["TR", "BODY", "HTML"].indexOf(curTarget.tagName.toUpperCase()) == -1) {
    curTarget = curTarget.parentElement;
}
let rows = [...document.querySelector('tbody').querySelectorAll('tr')];
let curIndex = rows.indexOf(curTarget);
// account for zero-index
curIndex = curIndex === -1 ? rows.length : curIndex + 1;
let userResponse = window.prompt('issue number to scroll to', curIndex);
if (userResponse === null) {
    return;
}
let num, target;
if (userResponse !== '') {
    num = parseInt(userResponse);
    if (num === 0) num = 1;
    // account for later pages where the number is above 100
    num %= 100;
}
else {
    num = rows.length;
}
target = rows[num - 1];
target ??= rows.at(num - 1);
target.focus();
target.scrollTo();