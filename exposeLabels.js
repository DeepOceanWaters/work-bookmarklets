
var annotater = {
    parent2child: new Map(),
    taterId: 'default',
    annotationParentClassName: 'annotator-container-tator',
    targetSizeClass: 'annotator-target-size',
    elementBoxClass: 'annotator-element-box',
    stylesheetId: 'annotator-stylesheet-tator',

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
        //console.log('removing taters');
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
        let targetSizeRule =
            `.${this.getTargetSizeClassName()} {`
            + ` position: absolute;`
            + ` background: transparent;`
            + ` top: 0;`
            + ` bottom: 0;`
            + ` left: 0;`
            + ` right: 0;`
            + ` text-align: center;`
            + `}`;
        let elementBoxRule =
            `.${this.getElementBoxClassName()} {`
            + ` position: absolute;`
            + ` background: rgba(0,0,0,0.8)!important;`
            + ` color: white;`
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
        document.documentElement.style.position = 'relative!important';
        // add rules
        stylesheet.sheet.insertRule(targetSizeRule);
        stylesheet.sheet.insertRule(elementBoxRule);
        stylesheet.sheet.insertRule(overlayRule);
        stylesheet.sheet.insertRule(overlayDescendantsRule);
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
     */
    annotateElements: function (listOfElements, annotationCallback, onClickCallback) {
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

                let annotation = annotationCallback(child, parent);
                this.positionAnnotation(annotation, child, parent, parentProperties.position);
                annotation.addEventListener('click', (e) => {
                    if (e.getModifierState('Control')) child.click();
                    setTimeout(() => onClickCallback(e, annotation, child, parent), 5);
                });
                overlay.appendChild(annotation);
            }
        }
    },

    makeOverlay: function (element) {
        let overlay = document.createElement('div');
        overlay.classList.add(this.getAnnotationParentClassName());
        element.appendChild(overlay);
        return overlay;
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
        annotation.style.top = top + 'px';
        annotation.style.left = left + 'px';
        annotation.style.width = elementRect.width + 'px';
        annotation.style.height = elementRect.height + 'px';
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

const labelExposerClass = 'aria-label-exposer';

const findWithinShadowroots = (domain, cssSelectors, logicFunc) => {
    let queriedElements = domain.querySelectorAll(
        cssSelectors.reduce((prev, cur) => `${prev}, ${cur}`, '[dummy-text-ignore-please]')
    );
    queriedElements = [...queriedElements].reduce((prev, cur) => {
        if (logicFunc(cur)) prev.push(cur);
        return prev;
    }, []);
    return queriedElements;
}

/* main should only call the library, should usually be specific to the bookmarklet */
const main = () => {
    //console.log('has taters', annotater.hasTaters());
    annotater.setTaterId('target-size');
    if (annotater.hasTaters()) {
        annotater.removeTaters();
        return;
    }
    
    loadAnnoations();
}

const loadAnnoations = () => {
    annotater.setup();
    /* specific to checkTargetSize */
    let labelledbElementsSelector = [
        `[aria-label]`,
        `[aria-labelledby]`
    ];
    let shadowRoots = annotater.findShadowRoots();
    let elementsToAnnotate = [];
    for(const selector of labelledbElementsSelector) {
        elementsToAnnotate.push(...document.querySelectorAll(selector));
    }
    for(const domain of shadowRoots) {
        elementsToAnnotate.push(...findWithinShadowroots(domain, labelledbElementsSelector, () => true));
    }
    
    /* the elements in focusableElements passed each, individually, to makeTargetSize() */
    annotater.annotateElements(elementsToAnnotate, makeLabel, onClickCallback);
}

const onClickCallback = (e, annotation, element, parent) => {
    console.log(`LABEL: ${getLabel(element)}`, element);
    reloadAnnotations();
}

const reloadAnnotations = (e) => {
    annotater.removeTaters();
    loadAnnoations();
}

const makeLabel = (element, parentElement) => {
    let elementBox = document.createElement('div');
    let altText = document.createElement('p');
    altText.textContent = getLabel(element);
    elementBox.classList.add(annotater.getElementBoxClassName());
    altText.classList.add(annotater.getTargetSizeClassName());
    elementBox.appendChild(altText);

    return elementBox;
}

const getLabel = (element) => {
    let label = "";
    let ariaLabelledby = element.getAttribute('aria-labelledby');
    let ariaLabel = element.getAttribute('aria-label');
    if (ariaLabelledby) {
        let ids = ariaLabelledby.split(' ');
        for(const id of ids) {
            if (!id) continue;
            let labellingElement = document.getElementById(id);
            if (!labellingElement) label += `[${id} not found] `;
            else label += getLabel(labellingElement);
        }
    }
    else if (ariaLabel) {
        label += ariaLabel;
    }
    else {
        label += element.textContent;
    }
    return label;
}

main();


/*** */
/*
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

console.log(exposeAriaLabel());*/