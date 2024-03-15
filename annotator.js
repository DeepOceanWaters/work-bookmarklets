(() => {

    var annotater = {
        parent2child: new Map(),
        annotationParentClassName: 'annotator-container-tator',
        stylesheetId: 'annotator-stylesheet-tator',
        exists: false,

        init: () => {
            this.getSelectorHelper = this.getSelectorHelper.bind(this);
            this.getSelector = this.getSelector.bind(this);
            this.removeTaters = this.removeTaters.bind(this);
            this.setup = this.setup.bind(this);
            this.getClosestNonStaticPositionedElement = this.getClosestNonStaticPositionedElement.bind(this);
            this.annotateElements = this.annotateElements.bind(this);
            this.makeOverlay = this.makeOverlay.bind(this);
            this.positionAnnotation = this.positionAnnotation.bind(this);
            return this;
        },

        hasTaters: () => {
            return this.exists;
        },


        /** from microlib */
        getSelectorHelper: (element) => {
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
        getSelector: (element) => {
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
        removeTaters: () => {
            let stylesheet = document.getElementById(this.stylesheetId);
            let overlays = document.querySelectorAll(`.${this.annotationParentClassName}`);
            stylesheet.remove();
            for (const overlay of overlays) {
                overlay.remove();
            }
            exists = false;
        },

        setup: () => {
            // create stylesheet
            stylesheet = document.createElement('style');
            stylesheet.id = id;
            document.head.appendChild(stylesheet);
            // create rules
            let targetSizeRule =
                `.${targetSizeClass} {`
                + ` position: absolute;`
                + ` background: white;`
                + ` border: 2px solid black;`
                + ` width: 24px;`
                + ` height: 24px;`
                + ` top: 50%;`
                + ` left: 50%;`
                + ` transform: translate(-50%, -50%);`
                + `}`;
            let elementBoxRule =
                `.${elementBoxClass} {`
                + ` position: absolute;`
                + " background: rgba(0,0,0,0.8)!important;"
                + `}`;
            let overlayRule =
                `.${overlayClass} {`
                + ' position: absolute;'
                + ' z-index: 1000000;'
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

        getClosestNonStaticPositionedElement: (element) => {
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
        annotateElements: (listOfElements, callback) => {

            // Organize list of elements by closest parent element that has a non-static CSS position
            for (const element of listOfElements) {
                let [parent, positionType] = this.getClosestNonStaticPositionedElement(element);
                if (!parent2child.has(parent)) {
                    parent2child.set(parent, []);
                }
                parent2child.get(parent).push(element);
            }

            // create the overlay and annotations
            for (const [parent, children] of parent2child.entries()) {
                // create an overlay layer for the parent element
                let overlay = this.makeOverlay(parent);
                for (const child of children) {
                    // make annotation
                    let annotation = callback(child, parent);
                    this.positionAnnotation(annotation, child, parent);
                    overlay.appendChild(annotation);
                }
            }
        },

        makeOverlay: (element) => {
            let overlay = document.createElement('div');
            overlay.classList.add(this.annotationParentClassName);
            element.appendChild(overlay);
            return overlay;
        },

        positionAnnotation: (annotation, annotatedElement, annotatedElementParent) => {
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
        }
    }

    /* main should only call the library, should usually be specific to the bookmarklet */
    const main = () => {
        if (annotater.hasTaters()) {
            annotater.removeTaters();
            return;
        }

        annotater.setup();
        /* specific to checkTargetSize */
        let focusableElementNames = [
            `a[href]:not([tabindex='-1'])`,
            `area[href]:not([tabindex='-1'])`,
            `input:not([disabled]):not([tabindex='-1'])`,
            `select:not([disabled]):not([tabindex='-1'])`,
            `textarea:not([disabled]):not([tabindex='-1'])`,
            `button:not([disabled]):not([tabindex='-1'])`,
            /*`iframe:not([tabindex='-1'])`, //removing iframe as they are often large an annoying*/
            `[tabindex]:not([tabindex='-1'])`,
            `[contentEditable=true]:not([tabindex='-1'])`
        ];
        let focusableElements = document.querySelectorAll(
            focusableElementNames.reduce((prev, cur) => `${prev}, ${cur}`, '[dummy-text-ignore-please]')
        );
        /* the elements in focusableElements passed each, individually, to makeTargetSize() */
        annotater.annotateElements(focusableElements, makeTargetSize);
    }

    const makeTargetSize = (element, parentElement) => {
        const elementBoxClass = 'element-box-thingy';
        const targetSizeClass = 'target-size-box-thingy';
        let elementBox = document.createElement('div');
        let targetSize = document.createElement('div');
        elementBox.classList.add(elementBoxClass);
        targetSize.classList.add(targetSizeClass);
        elementBox.appendChild(targetSize);

        return elementBox;
    }

    main();


})();
