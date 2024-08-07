(() => {

    /**
     * TODO:
     *  - remove target size from annotater
     *  - deal with offset issue on some elements (happens with some links in the body of mdn)
     */
    var annotater = {
        parent2child: new Map(),
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

            delete this.init;

            return this;
        },

        hasTaters: function () {
            let stylesheet = document.getElementById(this.stylesheetId);
            let overlays = document.querySelectorAll(`.${this.annotationParentClassName}`);
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
            let stylesheet = document.getElementById(this.stylesheetId);
            let overlays = document.querySelectorAll(`.${this.annotationParentClassName}`);
            stylesheet.remove();
            for (let overlay of overlays) {
                overlay.remove();
            }
            this.parent2child.clear();
        },

        setup: function () {
            // create stylesheet
            stylesheet = document.createElement('style');
            stylesheet.id = this.stylesheetId;
            document.head.appendChild(stylesheet);
            // create rules
            let targetSizeRule =
                `.${this.targetSizeClass} {`
                + ` position: absolute;`
                + ` background: transparent;`
                + ` border: 2px solid white;`
                + ` outline: 2px dotted black;`
                + ` outline-offset: -2px;`
                + ` width: 24px;`
                + ` height: 24px;`
                + ` top: 50%;`
                + ` left: 50%;`
                + ` transform: translate(-50%, -50%);`
                + `}`;
            let elementBoxRule =
                `.${this.elementBoxClass} {`
                + ` position: absolute;`
                + " background: rgba(0,0,0,0.8)!important;"
                + `}`;
            let overlayRule =
                `.${this.annotationParentClassName} {`
                + ' position: absolute;'
                + ' z-index: 100;'
                + ' top: 0;'
                + ' bottom: 0;'
                + ' left: 0;'
                + ' right: 0;'
                + ' pointer-events: none;'
                + '}';
            let overlayDescendantsRule =
                `.${this.annotationParentClassName} * {`
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
                } catch(e) {
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
                        console.log(this.getSelector(child));
                        console.log(child);
                        if (e.getModifierState('Control')) child.click();
                        setTimeout(() => onClickCallback(e, annotation, child, parent), 5);
                    });
                    overlay.appendChild(annotation);
                }
            }
        },

        makeOverlay: function (element) {
            let overlay = document.createElement('div');
            overlay.classList.add(this.annotationParentClassName);
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

    const findFocusableElements = (domain, cssSelectors) => {
        let focusableElements = domain.querySelectorAll(
            cssSelectors.reduce((prev, cur) => `${prev}, ${cur}`, '[dummy-text-ignore-please]')
        );
        focusableElements = [...focusableElements].reduce((prev, cur) => {
            let isFocusable = annotater.isFocusable(cur);
            if (isFocusable) prev.push(cur);
            return prev;
        }, []);
        return focusableElements;
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

    /*
    let targetSizeRule =
            `.${this.getTargetSizeClassName()} {`
            + ` position: absolute;`
            + ` background: transparent;`
            + ` border: 2px solid white;`
            + ` outline: 2px dotted black;`
            + ` outline-offset: -2px;`
            + ` width: 24px;`
            + ` height: 24px;`
            + ` top: 50%;`
            + ` left: 50%;`
            + ` transform: translate(-50%, -50%);`
            + `}`;*/
            
    const loadAnnoations = () => {
        annotater.setup();
        /* specific to checkTargetSize */
        let focusableElementNames = [
            `a[href]:not([tabindex='-1'], [inert])`,
            `area[href]:not([tabindex='-1'], [inert])`,
            `summary:not([tabindex='-1'], [inert])`,
            `input:not([disabled]):not([tabindex='-1'], [inert])`,
            `select:not([disabled]):not([tabindex='-1'], [inert])`,
            `textarea:not([disabled]):not([tabindex='-1'], [inert])`,
            `button:not([disabled]):not([tabindex='-1'], [inert])`,
            `[tabindex]:not([tabindex='-1'], [inert])`,
            `[contentEditable=true]:not([tabindex='-1'], [inert])`
        ];
        let shadowRoots = annotater.findShadowRoots();
        let focusableElements = [];
        for(const domain of shadowRoots) {
            focusableElements.push(...findFocusableElements(domain, focusableElementNames));
        }
        
        /* the elements in focusableElements passed each, individually, to makeTargetSize() */
        annotater.annotateElements(focusableElements, makeTargetSize, reloadAnnotations);
    }

    const reloadAnnotations = (e) => {
        console.log('reloading annotations');
        annotater.removeTaters();
        loadAnnoations();
    }

    const makeTargetSize = (element, parentElement) => {
        let elementBox = document.createElement('div');
        let targetSize = document.createElement('div');
        elementBox.classList.add(annotater.elementBoxClass);
        targetSize.classList.add(annotater.targetSizeClass);
        elementBox.appendChild(targetSize);

        return elementBox;
    }

    main();


})();
