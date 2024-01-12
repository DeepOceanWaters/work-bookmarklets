const checkForEl = (context, elementsList, isNotIn = false, lvl = 0) => {
    let elements = elementsList.toLowerCase().split(' ');
    let foundElements = [];
    for (const child of context.children) {
        if (elements.some(elType => elType === child.tagName.toLowerCase()) === isNotIn) {
            foundElements.push(child);
        }
        foundElements.push(...checkForEl(child, elementsList, isNotIn, lvl + 1));
    }
    return foundElements;
}

const getElementsIn = (context, elementsList) => {
    return checkForEl(context, elementsList, true);
}

const getElementsNotIn = (context, elementsList) => {
    return checkForEl(context, elementsList, false);
}

const toStringList = (array) => {
    return array.map(txt => (typeof txt === "object" ? txt.textContent : txt)).join('\n');
}

const make = (text) => document.createElement(text);

const findFirst = (text) => document.querySelector(text);

const findAll = (text) => document.querySelectorAll(text);

const allIds = (element) => {
    let foundElements = document.querySelectorAll(`#${element.id}`);
    console.log(`Found ${foundElements.length} elements with id ${element.id}`);
    return foundElements;
}

const getDupeIds = (element = document.body) => {
    let ids = {};
    // SIDE EFFECT: updates the ids object
    _getDupeIds(element, ids);
    // filter out any id values that are not duplicated, requires converting into an array of keys,
    // then we reduce that array of keys and turn it into the filtered object.
    let dupeIds = Object.keys(ids)
        .filter(key => ids[key] > 1)
        .reduce((dupeIds, key) => {
            dupeIds[key] = ids[key]
            return dupeIds;
        }, {});
    console.log('list of ids', stringifyObjKeys(dupeIds));
    return dupeIds;
}

const stringifyObjKeys = (obj, logIt = true) => {
    let str = Object.keys(obj).join('\n');
    if (logIt) console.log(str);
    return str;
}

const _getDupeIds = (element, ids) => {
    [...element.children].forEach(child => {
        if (child.hasAttribute('id') && child.id !== '') {
            ids[child.id] = ids.hasOwnProperty(child.id) ? ids[child.id] + 1 : 1;
        }
        _getDupeIds(child, ids);
    });
}

/** Not currently in */
const dupedId = function (id) {
    const helper = (element) => {
        [...element.children].forEach(child => {
            if (child.hasAttribute('id') && child.id === id) {
                console.log(child);
            }
            helper(child);
        });
    }
    helper(document.body);
}
/* end not currrently in */

const replaceType = (element, newType) => {
    let parent = element.parentElement;
    let newElement = make(newType);
    newElement.innerHTML = element.innerHTML;
    parent.replaceChild(newElement, element);
}


const getSelectorHelper = (element) => {
    let selector = element.tagName;
    let selectorUniqueAttrs = ''; // id, class e.g. tagname#spots.dog
    let selectorAttrs = ''; // where css uses brackets e.g. tagname[data-dog-name="spots"]
    let usedAttrs = [];
    if (element.id) selectorUniqueAttrs += `#${element.id}`;
    for (const attr of [...element.attributes]) {
        selectorAttrs += `[${attr.name}="${attr.value}"]`;
        usedAttrs.push(attr.name);
        if (document.querySelectorAll(selector + selectorUniqueAttrs + selectorAttrs).length === 1) break;
    }

    return element.tagName + selectorUniqueAttrs + selectorAttrs;
}

/**
 * Gets a CSS selector that uniquely selects this component
 * @param {HTMLElement} element 
 */
const getSelector = (element) => {
    let selector = getSelectorHelper(element);
    let currentElement = element;
    while (document.querySelectorAll(selector).length > 1 && currentElement !== document.body) {
        currentElement = currentElement.parentElement;
        let parentSelector = getSelectorHelper(currentElement);
        selector = parentSelector + ' > ' + selector;
    }
    return selector;
}

const getElStyle = (element) => {
    if (!element) throw new Error('no element found. Please focus an element to get its bizniz');
    let elementStyle = window.getComputedStyle(element);
    // convert from px to pt, getPropertyValue should get the used value which should always be in px
    const fontSize = Number(elementStyle.getPropertyValue('font-size').replace('px', '')) * 0.75;
    // 700 or higher is bold
    const fontWeight = Number(elementStyle.getPropertyValue('font-weight'));
    // given the font-size and font-weight, determine if this content is "large-scale"
    // given the WCAG definition of "large-scale"
    const isLargeScale = !!(fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700));
    let color = elementStyle.getPropertyValue('color');
    if (element.tagName.toLowerCase() === 'a') {
        color = 'Link (anchor elements) color is not determinable using JavaScript. Please inspect the content using your browsers DevTools. Search "CSS History Leak" for more information.';
    }
    let text = `color: ${color}\nfont-size: ${fontSize}pt\nfont-weight: ${fontWeight}\nis large-scale: ${isLargeScale}`;
    console.log(text);
}

const log = (item) => console.log(item);

/* end microlibrary */
/* add functions to window */
const functionsToAdd = [
    checkForEl,
    getElementsIn,
    getElementsNotIn,
    toStringList,
    findFirst,
    findAll,
    allIds,
    log,
    make,
    replaceType,
    getDupeIds,
    getSelector,
    getElStyle
];

const addFuncToWindow = (callback) => {
    const fallbackName = "microlib";
    window[fallbackName] = {};
    if (window.hasOwnProperty(callback.name)) {
        console.warn('Window already has a function called ' + callback.name + ', renaming to micro.' + callback.name);
        window[fallbackName][callback.name] = callback;
    }
    else {
        window[callback.name] = callback;
    }
}


for (const callback of functionsToAdd) {
    addFuncToWindow(callback);
}

console.log(functionsToAdd.reduce((prev, cur) => `${prev}\n${cur.name}`, 'functions added to window object:'));

