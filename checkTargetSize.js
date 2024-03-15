(() => {

    /** from microlib */
    const getSelectorHelper = (element) => {
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

    /** end from microlib */
    const focusableElementNames = [
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
    const id = "expose-target-size";
    const overlayId = 'expose-target-size-overlay';
    const overlayClass = 'target-size-overlay-container';
    const elementBoxClass = 'element-box-thingy';
    const targetSizeClass = 'target-size-box-thingy';
    let parent2child = new Map();

    
    // new stuff

    const setupCSSstyleSheets = () => {
        let stylesheet = document.getElementById(id);
        let overlay = document.getElementById(overlayId);
        if (stylesheet || overlay) {
            stylesheet?.remove();
            overlay?.remove();
            let overlays = [...document.querySelectorAll(`.${overlayClass}`)];
            overlays.forEach(e => e.remove());
            return false;
        }
        // create overlay sheet
        overlay = document.createElement('div');
        overlay.id = overlayId;
        document.documentElement.appendChild(overlay);
        // create stylesheet
        stylesheet = document.createElement('style');
        stylesheet.id = id;
        document.head.appendChild(stylesheet);
        // create rules
        let ruleItems = focusableElementNames.reduce((prev, cur) => `${prev}, ${cur}::before`, '[dummy-text-ignore-please]');
        let parentItems = focusableElementNames.reduce((prev, cur) => `${prev}, ${cur}`, '[dummy-text-ignore-please]');
        let targetSizeRule =
            `.${targetSizeClass} {`
            + ` position: absolute;`
            + ` background: white;`
            + ` border: 2px solid black;`
            + ` width: 20px;`
            + ` height: 20px;`
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
        return true;
    }


    const getClosestNonStaticPositionedElement = (element) => {
        let position = 'static';
        while (position === 'static' && element !== document.documentElement) {
            element = element.parentElement;
            let style = window.getComputedStyle(element);
            position = style.getPropertyValue('position');
        }
        // should we return null, or just return the html element?
        return [element, position];
    }

    const exposeTargetSizeNew = () => {
        // move to stylesheets func
        const overlayId = 'expose-target-size-overlay';
        let overlay = document.getElementById(overlayId);

        //dsa
        let focusableElements = document.querySelectorAll(
            focusableElementNames.reduce((prev, cur) => `${prev}, ${cur}`, '[dummy-text-ignore-please]')
        );
        // create overlay layer should span entire webpage
        // create a target size element based on 
        // for each focusable element:
        for (const focusableElement of focusableElements) {
            let [parent, positionType] = getClosestNonStaticPositionedElement(focusableElement);
            if (!parent2child.has(parent)) {
                parent2child.set(parent, []);
            } 
            parent2child.get(parent).push(focusableElement);
        }

        for(const [parent, children] of parent2child.entries()) {
            let overlay = makeOverlay(parent);
            for(const child of children) {
                let targetSizeBox = makeTargetSize(child, parent);
                overlay.appendChild(targetSizeBox);
            }
        }
    }

    const makeOverlay = (element) => {
        let overlay = document.createElement('div');
        overlay.classList.add(overlayClass);
        element.appendChild(overlay);
        return overlay;
    }

    const makeTargetSize = (element, parentElement) => {
        let elementBox = document.createElement('div');
        let targetSize = document.createElement('div');
        elementBox.classList.add(elementBoxClass);
        targetSize.classList.add(targetSizeClass);
        elementBox.appendChild(targetSize);

        let elementBoxSizing = window.getComputedStyle(element).getPropertyValue('box-sizing');
        let elementRect = element.getBoundingClientRect();
        let parentRect = parentElement.getBoundingClientRect();
        //let parentElementRect = element.getBoundingClientRect();
        // set element box location
        let top = elementRect.top - parentRect.top;
        let left = elementRect.left - parentRect.left;
        elementBox.style.top = top + 'px';
        elementBox.style.left = left + 'px';
        elementBox.style.width = elementRect.width + 'px';
        elementBox.style.height = elementRect.height + 'px';
        elementBox.addEventListener('click', () => {
            console.log(getSelector(element));
            console.log(element);
        });

        return elementBox;
    }

    const main = () => {
        if (!setupCSSstyleSheets()) {
            return;
        }
        exposeTargetSizeNew();
    }

    main();


})();
