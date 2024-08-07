
var annotater = {
    parent2child: new Map(),
    taterId: 'default',
    annotationParentClassName: 'annotator-container-tator',
    targetSizeClass: 'annotator-target-size',
    elementBoxClass: 'annotator-element-box',
    taterLabelClassName: 'annotator-label',
    stylesheetId: 'annotator-stylesheet-tator',

    POSITIONS: {
        TOP: 'TOP',
        BOTTOM: 'BOTTOM',
        LEFT: 'LEFT',
        RIGHT: 'RIGHT'
    },

    init: function () {
        this.getSelectorHelper = this.getSelectorHelper.bind(this);
        this.getSelector = this.getSelector.bind(this);
        this.removeTaters = this.removeTaters.bind(this);
        this.hasTaters = this.hasTaters.bind(this);
        this.setup = this.setup.bind(this);
        this.getClosestNonStaticPositionedElement = this.getClosestNonStaticPositionedElement.bind(this);
        this.annotateElements = this.annotateElements.bind(this);
        this.makeOverlay = this.makeOverlay.bind(this);
        this.positionAnnotation = this.positionAnnotation.bind(this);
        this.isFocusable = this.isFocusable.bind(this);
        this.findShadowRoots = this.findShadowRoots.bind(this);
        this._findShadowRoots = this._findShadowRoots.bind(this);
        this.getStylesheetName = this.getStylesheetName.bind(this);
        this.getTargetSizeClassName = this.getTargetSizeClassName.bind(this);
        this.getElementBoxClassName = this.getElementBoxClassName.bind(this);
        this.getTaterLabelClassName = this.getTaterLabelClassName.bind(this);
        this.makeLabel = this.makeLabel.bind(this);
        this.repositionAnnotation = this.repositionAnnotation.bind(this);
        this.setTaterId = this.setTaterId.bind(this);

        delete this.init;

        return this;
    },

    setTaterId: function (id) {
        this.taterId = id;
    },

    getStylesheetName: function () {
        return `${this.taterId}-${this.stylesheetId}`;
    },

    getTargetSizeClassName: function () {
        return `${this.taterId}-${this.targetSizeClass}`;
    },

    getElementBoxClassName: function () {
        return `${this.taterId}-${this.elementBoxClass}`;
    },

    getAnnotationParentClassName: function () {
        return `${this.taterId}-${this.annotationParentClassName}`;
    },

    getTaterLabelClassName: function () {
        return `${this.taterId}-${this.taterLabelClassName}`;
    },

    hasTaters: function () {
        let stylesheet = document.getElementById(this.getStylesheetName());
        let overlays = document.querySelectorAll(`.${this.getAnnotationParentClassName()}`);
        return stylesheet || overlays.length;
    },


    /** from microlib */
    getSelectorHelper: function (element) {
        let selector = element.tagName;
        let selectorUniqueAttrs = ''; // id, class e.g. tagname#spots.dog
        let selectorAttrs = ''; // where css uses brackets e.g. tagname[data-dog-name="spots"]
        let usedAttrs = [];
        if (element.id) selectorUniqueAttrs += `#${element.id.trim()}`;
        for (const attr of [...element.attributes]) {
            selectorAttrs += `[${attr.name}="${attr.value.trim()}"]`;
            usedAttrs.push(attr.name);
            if (document.querySelectorAll(selector + selectorUniqueAttrs + selectorAttrs).length === 1) break;
        }
        return element.tagName + selectorUniqueAttrs + selectorAttrs;
    },

    /**
     * Gets a CSS selector that uniquely selects this component
     * @param {HTMLElement} element 
     */
    getSelector: function (element) {
        let selector = this.getSelectorHelper(element);
        let currentElement = element;
        while (document.querySelectorAll(selector).length > 1 && currentElement !== document.body) {
            currentElement = currentElement.parentElement;
            let parentSelector = this.getSelectorHelper(currentElement);
            selector = parentSelector + ' > ' + selector;
        }
        return selector;
    },

    /** end from microlib */
    // annotate collection of elements
    /*
        1. get collection of elements
        2. take a callback/function that returns an html element that annotates the content
        3. 
    */
    removeTaters: function () {
        console.log('removing taters');
        let stylesheet = document.getElementById(this.getStylesheetName());
        let overlays = document.querySelectorAll(`.${this.getAnnotationParentClassName()}`);
        stylesheet.remove();
        for (let overlay of overlays) {
            overlay.remove();
        }
        this.parent2child.clear();
    },

    setup: function () {
        // create stylesheet
        stylesheet = document.createElement('style');
        stylesheet.id = this.getStylesheetName();
        document.head.appendChild(stylesheet);
        // create rules

        let elementBoxRule =
            `.${this.getElementBoxClassName()} {`
            + ` position: absolute;`
            + " background: rgba(0,0,0,0.1)!important;"
            + " border: 3px solid black;"
            + `}`;
        let overlayRule =
            `.${this.getAnnotationParentClassName()} {`
            + ' position: absolute;'
            + ' z-index: 100;'
            + ' top: 0;'
            + ' bottom: 0;'
            + ' left: 0;'
            + ' right: 0;'
            + ' pointer-events: none;'
            + '}';
        let overlayDescendantsRule =
            `.${this.getAnnotationParentClassName()} * {`
            + ' pointer-events: all;'
            + '}';
        let overlayLabelRule =
            `.${this.getTaterLabelClassName()} {`
            + ` position: absolute;`
            + ` top: 0;`
            + ` transform: translate(-3px, -100%);`
            + ` margin: 0!important;`
            + ` color: white;`
            + ` background: rgba(0,0,0,0.8)!important;`
            + ` padding: 0.1rem 0.5rem;`
            + `}`;
        document.documentElement.style.position = 'relative!important';
        // add rules
        // stylesheet.sheet.insertRule(targetSizeRule);
        stylesheet.sheet.insertRule(elementBoxRule);
        stylesheet.sheet.insertRule(overlayRule);
        stylesheet.sheet.insertRule(overlayDescendantsRule);
        stylesheet.sheet.insertRule(overlayLabelRule);
        return this.exists = true;
    },

    getClosestNonStaticPositionedElement: function (element) {
        let position = 'static';
        // NOTE: per shadow root: if an element is in a shadowroot, must replace when element === null with element that is the shadowroot
        while (position === 'static' && element !== document.documentElement) {
            element = element.parentElement;
            let style;
            try {
                style = window.getComputedStyle(element);
            } catch (e) {
                console.log('tried on this ele: ', element);
                throw e;
            }
            position = style.getPropertyValue('position');
        }
        // should we return null, or just return the html element?
        return [element, position];
    },

    /**
     * Given a list of elements and a callback to create the annotation, annotates the webpage
     * @param {Array<HTMLElement>} listOfElements list of elements to annotate
     * @param {Function} annotationCallback parameter 1 = the element to annotate, parameter 2 = the closest parent element with a non-static position, must return an HTMLElement
     * @param {Function} onClickCallback (event object, annotationElement, anotatedElement, parent of anotatedElement) called on click
     * @param {String} annotationLabel text that labels the annotation
     * @param {annotater.POSITIONS} annotationPosition the position of the label Defaults to top
     */
    annotateElements: function (listOfElements, annotationCallback, onClickCallback, annotationLabel, labelPosition = this.POSITIONS.TOP) {
        //console.log("list of eles: ", listOfElements);
        // Organize list of elements by closest parent element that has a non-static CSS position
        for (const element of listOfElements) {
            let [parent, positionType] = this.getClosestNonStaticPositionedElement(element);
            if (!this.parent2child.has(parent)) {
                this.parent2child.set(parent, { position: positionType, children: [] });
            }
            this.parent2child.get(parent).children.push(element);
        }

        // create the overlay and annotations
        for (const [parent, parentProperties] of this.parent2child.entries()) {
            // create an overlay layer for the parent element
            let overlay = this.makeOverlay(parent);

            for (const child of parentProperties.children) {
                // make annotation

                //let tater = makeTater(child, parent);
                let [annotation, labelText] = annotationCallback(child, parent);
                this.positionAnnotation(annotation, child, parent, parentProperties.position);
                annotation.addEventListener('click', (e) => {
                    console.log(this.getSelector(child));
                    console.log(child);
                    if (e.getModifierState('Control')) child.click();
                    setTimeout(() => onClickCallback(e, annotation, child, parent), 5);
                });
                let label = this.makeLabel(labelText);
                overlay.append(annotation, label);
                this.repositionAnnotation(child, annotation, overlay);
            }
        }
    },

    repositionAnnotation: function (element, annotation, overlay) {
        // reset the styling
        annotation.style.removeProperty('white-space');
        // get annotation dimensions
        let annotationRect = annotation.getBoundingClientRect();
        let elementRect = element.getBoundingClientRect();
        
        // set the width of subannotations equal to parent
        if (annotationRect.width < elementRect.width) {
            let width = elementRect.width;
            if (width < 50) width = 50;
            annotation.style.width = width + 'px';
            annotation.style.whiteSpace = 'normal';
        }
        // we may have changed to size, so we want to updated the rect
        // so that we can ensure that it is fully within the viewport
        // and does not cause horizontal scrolling (this is important for
        // 1.4.10 Reflow)
        annotationRect = annotation.getBoundingClientRect();
        // this assumes that the documentElement is the HTML element
        // clientWidth will include everything but the vertical scrollbar
        // when used on the html element
        let vw = document.documentElement.clientWidth;
        if (annotationRect.width > vw || annotationRect.x + annotationRect.width > vw) {
            let widthOffset, leftOffset;
            let twoPercentVW = (2 * (vw / 100));
            widthOffset = vw - 2 * twoPercentVW;
            leftOffset = twoPercentVW - elementRect.x;
            annotation.style.width = widthOffset + 'px';
            annotation.style.left = leftOffset + 'px';
            // in the style sheet we've set the "white-space" CSS property
            // to nowrap, but when the text is longer than the width of the
            // viewport, we need to wrap the text
            annotation.style.whiteSpace = 'normal';
        }
    },

    makeLabel: function (text) {
        let label = document.createElement('div');
        label.textContent = text;
        label.classList.add(this.getTaterLabelClassName());
        return label;
    },

    makeOverlay: function (element) {
        let overlay = document.createElement('div');
        overlay.classList.add(this.getAnnotationParentClassName());
        element.appendChild(overlay);
        return overlay;
    },

    makeTater: function (child, parent) {

    },

    positionAnnotation: function (annotation, annotatedElement, annotatedElementParent, annotatedElementParentPosition) {
        let elementRect = annotatedElement.getBoundingClientRect();
        let parentRect = annotatedElementParent.getBoundingClientRect();
        let [scrollXOffset, scrollYOffest] = [0, 0];

        if (annotatedElementParentPosition !== 'static') {
            [scrollXOffset, scrollYOffest] = this.getScrollOffest(annotatedElement, annotatedElementParent);
        }
        // set element box location

        let top = elementRect.top - parentRect.top + scrollYOffest;
        let left = elementRect.left - parentRect.left + scrollXOffset;
        annotation.style.top = top - (3 * 2) + 'px';
        annotation.style.left = left - (3 * 2) + 'px';
        annotation.style.width = elementRect.width + 3 * 4 + 'px';
        annotation.style.height = elementRect.height + 3 * 4 + 'px';
    },

    getScrollOffest: function (element, boundingParent = document.documentElement) {
        let scrollYOffest, scrollXOffset;

        const getScroll = (el, scrollProperty) => {
            while (el[scrollProperty] <= 0 && el !== boundingParent) {
                el = el.parentElement;
            }
            return el[scrollProperty]
        }

        scrollYOffest = getScroll(element, "scrollTop");
        scrollXOffset = getScroll(element, "scrollLeft");
        return [scrollXOffset, scrollYOffest];
    },

    isFocusable: function (element, log = false) {
        // is not inert or contained within an inert element
        // tabindex = 0
        // is not contained within a closed details
        // if contained within closed details, must be a summary
        // also need to ensure that closed details with a summary 
        // is excluded if that details is in another closed details.
        let isTabbable = element.tabIndex === 0;
        // closest also checks the element, not just its ancestors
        let isInInert = element.closest('[inert]');
        let detailsStart = element;
        if (element.tagName === 'SUMMARY') {
            let parentDetails = element.closest('details')?.parentElement;
            if (!parentDetails) {
                console.warn('malformed html, no <details> parent for <summary> element:', element);
                return false;
            }
            detailsStart = parentDetails;
            // closest closed details
        }
        let closestClosedAncestorDetails = detailsStart.closest('details:not([open])');
        if (log) console.log(`isTabbable ${isTabbable} !isInert ${!isInInert} !isInInert ${!isInInert} isInOpenDetails ${!closestClosedAncestorDetails}`);
        return isTabbable && !isInInert && !closestClosedAncestorDetails;
    },

    findShadowRoots: function (element = document.documentElement) {
        let shadowRootElements = [element];
        this._findShadowRoots(element, shadowRootElements);
        return shadowRootElements;
    },

    _findShadowRoots: function (element, outputArray) {
        for (const child of element.children) {
            if (child.shadowRoot) {
                outputArray.push(child.shadowRoot);
            }
            this._findShadowRoots(child, outputArray);
        }
    }
}.init();
/* END ANNOTATER */

const main = () => {
    annotater.setTaterId('img-alt');
    if (annotater.hasTaters()) {
        annotater.removeTaters();
        return;
    }
    console.log(getListOfElements());
    loadAnnoations();
}

const getListOfElements = () => {
    let elements = [...document.querySelectorAll('img')];
    elements.push(...document.querySelectorAll('[role="img"]'));
    elements.push(...document.querySelectorAll('svg'));

    // taken from stack overflow, finds all DIVs using background: url()
    let divs = document.querySelectorAll("div");

    let urlRegex = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/;

    var divsWithBackgroundImage = [...divs].filter((div) => {
        let backgroundImage = getComputedStyle(div).getPropertyValue("background-image");

        return (backgroundImage.match(urlRegex));
    });
    // end taken from stack overflow
    elements.push(...divsWithBackgroundImage);
    return elements;
}

const reloadAnnotations = (e) => {
    annotater.removeTaters();
    loadAnnoations();
}

const onClickCallback = (e, annotation, img, parent) => {
    console.log(`ALT TEXT: ${getAltText(img)}`, img);
    reloadAnnotations();
}

const loadAnnoations = () => {
    annotater.setup();
    let imgs = getListOfElements();
    annotater.annotateElements(imgs, makeTargetSize, onClickCallback);
}

const makeTargetSize = (img, parentElement) => {
    let elementBox = document.createElement('div');
    let altText = document.createElement('p');
    altText.textContent = getAltText(img);
    elementBox.classList.add(annotater.getElementBoxClassName());
    altText.classList.add(annotater.getTaterLabelClassName());
    //elementBox.appendChild(altText);

    return [elementBox, getAltText(img)];
}

/**
 * must update
 * @param {HTMLElement} element 
 * @returns labelledby acc name
 */
const getNameFromAriaLabelledby = (element, visitedElements = []) => {
    let names = [];
    let ids = element.getAttribute('aria-labelledby').split(' ');
    const findName = (id) => {
        let name;
        let el = document.getElementById(id);
        console.log(id, el)
        if (el === element && !!el.getAttribute('aria-label')) {
            console.log('setting name to aria-label');
            name = el.getAttribute('aria-label');
        }
        else if (el.hasAttribute('aria-labelledby') && !visitedElements.includes(el)) {
            console.log('ve', visitedElements);
            visitedElements.push(element);
            name = getNameFromAriaLabelledby(el, visitedElements);
        }
        else {
            console.log('setting name to text content');
            name = el.textContent;
        }
        if (name) names.push(name);
    }
    console.log('ids', ids);
    if (visitedElements.includes(element)) {
        findName(element.id);
    }
    else {
        for (const id of ids) {
            findName(id);
        }
    }
    console.log('names', names);
    return names.join(' ');
}

/**
 * Gets the alt text for an img, non-exhaustive, does not handle
 * complex names (e.g. simplified version of the acc name computation,
 * does not handle aria-labelledby an element that has it's own complex
 * aria-labelledby naming computation)
 * @param {IMGElement} img 
 * @returns 
 */
const getAltText = (img) => {
    let altText;
    if (img.getAttribute('aria-hidden') === 'true') {
        altText = '[HIDDEN - aria-hidden=true]';
    }
    else if (img.tagName === 'IMG' || img.tagName.toUpperCase() === 'SVG') {
        if (img.hasAttribute('aria-labelledby')) {
            altText = getNameFromAriaLabelledby(img)
        }
        else if (img.getAttribute('aria-label')) {
            altText = img.getAttribute('aria-label');
        }
        else if (img.tagName.toUpperCase() === 'SVG') {
            if (svgHasNonEmptyTitle(img)) {
                altText = img.querySelector('title').textContent;
            }
            else {
                altText = '[HIDDEN - SVG with no TITLE]';
            }
        }
        else if (!img.hasAttribute('alt')) {
            altText = '[No ALT attribute, no known text alternative]';
        }
        else if (img.hasAttribute('alt') && img.alt === '') {
            altText = '[HIDDEN - empty alt]';
        }
        else {
            altText = img.alt;
        }
    }
    else if (img.getAttribute('role') === 'img') {
        if (img.hasAttribute('aria-labelledby')) {
            altText = getNameFromAriaLabelledby(img)
        }
        else if (img.getAttribute('aria-label')) {
            altText = img.getAttribute('aria-label');
        }
    }
    else if (img.tagName === 'DIV') {
        altText = img.textContent || 'DIV bg image - NO ALT INSIDE';
    }
    else {
        altText = `unknown img type (tag = ${img.tagName})`;
    }
    return altText;
}

const svgHasNonEmptyTitle = (svg) => {
    let title = svg.querySelector('title');
    return !!(title?.textContent);
}

main();


const findAllNonStaticElements = (element) => {
    let nonStaticElements = [];
    for(let child of element.children) {
        let style = window.getComputedStyle(child);
        if (style.getPropertyValue('position') !== 'static') {
            nonStaticElements.push(child);
        }
        nonStaticElements.push(...findAllNonStaticElements(child));
    }
    return nonStaticElements;
}
// fdsafds
const createLayers = (nonStaticlyPositionedElements, root) => {
    let layers = [];
    let processedElements = new Set();
    for (let element of nonStaticlyPositionedElements) {
        // create layer for current element
        // trace current element's ancestors and see if any are contained within nonStaticly...
        // if they are create a layer for them, and repeat step 1 for new layer
        let layer = createOverlayItem(element);
        layers.push(layer);
        let ancestor = getClosestAncestorIfInArray(nonStaticlyPositionedElements, element);
        if (ancestor) {

        }
        else {
            root.appendChild(layer);
        }
    }
    return layers;
}

const getClosestAncestorIfInArray = (arr, element) => {
    while((element = element.parentElement) !== document.documentElement) {
        if (arr.includes(element)) break;
    }
    return element;
}

const createBodyLayer = () => {
    createLayers([document.body]);
}

const createOverlayItem = (element, position) => {
    let overlay = document.createElement('div');
    let elementRect = element.getBoundingClientRect();
    overlay.style.top = elementRect.y + 'px';
    overlay.style.left = elementRect.x + 'px';
    overlay.style.width = elementRect.width + 'px';
    overlay.style.height = elementRect.height + 'px';
    overlay.style.position = position || window.getComputedStyle(element).getPropertyValue('position');
    return overlay;
}

const getScrollOffest = (element, boundingParent = document.documentElement) => {
    let scrollYOffest, scrollXOffset;

    const getScroll = (el, scrollProperty) => {
        while (el[scrollProperty] <= 0 && el !== boundingParent) {
            el = el.parentElement;
        }
        return el[scrollProperty]
    }

    scrollYOffest = getScroll(element, "scrollTop");
    scrollXOffset = getScroll(element, "scrollLeft");
    return [scrollXOffset, scrollYOffest];
}