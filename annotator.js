(() => {

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

            delete this.init;

            return this;
        },

        hasTaters: function() {
            let stylesheet = document.getElementById(this.stylesheetId);
            let overlays = document.querySelectorAll(`.${this.annotationParentClassName}`);
            return stylesheet || overlays.length;
        },


        /** from microlib */
        getSelectorHelper: function(element) {
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
        getSelector: function(element) {
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
        removeTaters: function() {
            let stylesheet = document.getElementById(this.stylesheetId);
            let overlays = document.querySelectorAll(`.${this.annotationParentClassName}`);
            stylesheet.remove();
            for (let overlay of overlays) {
                overlay.remove();
            }
        },

        setup: function() {
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
                + '}';
            document.documentElement.style.position = 'relative!important';
            // add rules
            stylesheet.sheet.insertRule(targetSizeRule);
            stylesheet.sheet.insertRule(elementBoxRule);
            stylesheet.sheet.insertRule(overlayRule);
            return this.exists = true;
        },

        getClosestNonStaticPositionedElement: function(element) {
            let position = 'static';
            while (position === 'static' && element !== document.documentElement) {
                element = element.parentElement;
                let style = window.getComputedStyle(element);
                position = style.getPropertyValue('position');
            }
            // should we return null, or just return the html element?
            return [element, position];
        },

        /**
         * Given a list of elements and a callback to create the annotation, annotates the webpage
         * @param {Array<HTMLElement>} listOfElements list of elements to annotate
         * @param {Function} callback parameter 1 = the element to annotate, parameter 2 = the closest parent element with a non-static position, must return an HTMLElement
         */
        annotateElements: function(listOfElements, callback) {

            // Organize list of elements by closest parent element that has a non-static CSS position
            for (const element of listOfElements) {
                let [parent, positionType] = this.getClosestNonStaticPositionedElement(element);
                if (!this.parent2child.has(parent)) {
                    this.parent2child.set(parent, []);
                }
                this.parent2child.get(parent).push(element);
            }

            // create the overlay and annotations
            for (const [parent, children] of this.parent2child.entries()) {
                // create an overlay layer for the parent element
                let overlay = this.makeOverlay(parent);
                for (const child of children) {
                    // make annotation
                    let annotation = callback(child, parent);
                    this.positionAnnotation(annotation, child, parent);
                    overlay.appendChild(annotation);
                    if (child.tagName === 'SUMMARY') console.log('annotating summary (summary, overlay)', child, annotation);
                }
            }
        },

        makeOverlay: function(element) {
            let overlay = document.createElement('div');
            overlay.classList.add(this.annotationParentClassName);
            element.appendChild(overlay);
            return overlay;
        },

        positionAnnotation: function(annotation, annotatedElement, annotatedElementParent) {
            let elementRect = annotatedElement.getBoundingClientRect();
            let parentRect = annotatedElementParent.getBoundingClientRect();
            // set element box location
            let top = elementRect.top - parentRect.top;
            let left = elementRect.left - parentRect.left;
            annotation.style.top = top + 'px';
            annotation.style.left = left + 'px';
            annotation.style.width = elementRect.width + 'px';
            annotation.style.height = elementRect.height + 'px';
            annotation.addEventListener('click', () => {
                console.log(this.getSelector(annotatedElement));
                console.log(annotatedElement);
            });
        },

        isFocusable: function (element, log = false) {
            // is not inert or contained within an inert element
            // tabindex = 0
            // is not contained within a closed details
            let isTabbable = element.tabIndex === 0;
            let isInert = element.hasAttribute('inert');
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
            return isTabbable && !isInert && !isInInert && !closestClosedAncestorDetails;
        },

        addStyleRule: function(rule) {
            let stylesheet = document.getElementById(this.stylesheetId);
        }
    }.init();

    /* main should only call the library, should usually be specific to the bookmarklet */
    const main = () => {
        console.log('has taters', annotater.hasTaters());
        if (annotater.hasTaters()) {
            annotater.removeTaters();
            return;
        }

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
        let focusableElements = document.querySelectorAll(
            focusableElementNames.reduce((prev, cur) => `${prev}, ${cur}`, '[dummy-text-ignore-please]')
        );
        focusableElements = [...focusableElements].reduce((prev, cur) => {
            let isFocusable = annotater.isFocusable(cur);
            if (isFocusable) prev.push(cur);
            if (cur.tagName === 'SUMMARY') console.log('found summary: ', cur, isFocusable);
            return prev;
        }, []);
        /* the elements in focusableElements passed each, individually, to makeTargetSize() */
        annotater.annotateElements(focusableElements, makeTargetSize);
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
