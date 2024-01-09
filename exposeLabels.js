
const labelExposerClass = 'aria-label-exposer';
const notAllowedChildren = [
    'input',
    'select'
];

const toggleStyleSheet = (id) => {
    let stylesheet = document.getElementById(id);
    if (stylesheet) {
        stylesheet.remove();
        stylesheet = null;
    }
    else {
        stylesheet = document.createElement('style');
        stylesheet.id = id;
        document.head.appendChild(stylesheet);
    }
    return stylesheet;
}

const exposeAriaLabel = (context = document) => {
    const windowProp = 'exposedAriaLabelElements';
    let elementsWithAriaLabel = context.querySelectorAll('[aria-label]');
    if (window.hasOwnProperty(windowProp)) {
        for (const span of document.querySelectorAll(`span.${labelExposerClass}`)) {
            span.remove();
        }
        delete window[windowProp];
    }
    else {
        let labelSpan = document.createElement('span');
        labelSpan.classList.add(labelExposerClass);
        labelSpan.append('label: ');
        for (const element of elementsWithAriaLabel) {
            let curLabelSpan = labelSpan.cloneNode(true);
            curLabelSpan.append(element.ariaLabel);
            element.prepend(curLabelSpan);
            //console.log('Element ', element, ' with aria label ', element.ariaLabel);
        }
        window[windowProp] = elementsWithAriaLabel;
    }
    return elementsWithAriaLabel;
}

const styleId = 'style-aria-label-spans';
let stylesheet = toggleStyleSheet(styleId);
if (stylesheet) {
    let rule = `.${labelExposerClass} `
        + '{ '
        + 'background-color: rgba(0,0,0,0.8);'
        + 'color: white;'
        + 'border-radius: 0.35rem;'
        + 'padding: 0.35rem;'
        + 'margin: 0.25rem;'
        + '}';
    stylesheet.sheet.insertRule(rule)
}

console.log(exposeAriaLabel());