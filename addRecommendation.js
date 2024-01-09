// still needs some work, and the "add recommendation" already covers this functionaliy
// however, I still enjoy preparing the recommendation with tokens
(() => {
    const tokens = {
        // ensure
        cctext: 'Ensure that normal text has at least a 4.5:1 color contrast against its background color, and that large-scale text has at least a 3:1 color contrast ratio against its background color',

        ccgraphic: 'Ensure that the contrast ratio meets the ratio 3:1 for interactable components or parts of graphical objects required to understand the content.',

        state: 'Ensure that when users can set the state of an interactive component, that state can be set and determined programmatically.',

        onfocus: 'Ensure that moving focus does not cause a change of context.',

        oninput: 'Ensure that changing the setting of an interactive component does not cause an automatic change in context',

        name: 'Ensure that interactive components have an accessible name that describes their purpose.',

        namere: 'We recommend either:\n- Adding a visually hidden SPAN element with text content that describes the purpose of this component\n- Adding the attribute ARIA-LABEL with a value that describes the purpose of this component\n- Adding the attribute ARIA-LABELLEDBY with a value equal to the ID of an element that has text content that describes the purpose of this component',

        label: 'Ensure that interactive components related to user input have a visible label at all times.',

        usecolor: 'Ensure that color is not the only means of distinguishing a visual element. Note that when the color contrast ratio is 3:1 or higher, then color is not considered the only means of distinguishing a visual element as luminance is perceived differently than hue/color.',

        extra: 'Additionally, while not necessary for conformance, we recommend ',

        reflow: 'Ensure that there is no loss of content or functionality when the viewport is set as described in the 1.4.10 Reflow Success Criterion (320 CSS Pixels width by 256 CSS Pixels height).',

        zoom: 'Ensure that there is no loss of content or functionality when zoomed in up to 200%.',

        focusmanage: 'Ensure that when content in focus is removed, that focus is managed and returned to a logical place.',

        scrollableregion: 'We recommend wrapping this content in an element with the following properties:\n- ROLE=REGION\n- TABINDEX=0\n- ARIA-LABEL or ARIA-LABELLEDBY to provide an accessible name that describes the region',

        keyboard: 'Ensure that all functionality of content can be operated using a keyboard.',

        bestpractice: 'Note that this is a best practice, and not necessary for conformance.',

        extrabp: 'In addition, while the following is not necessary for conformance, we recommend ',

        info: 'Ensure that structure and relationships and information conveyed through presentation can be programmatically determined or is available in text.',
    }

    const getRecommendation = (token) => {
        if (!(token in tokens)) {
            console.log(`token not found (${token})`);
        }
        else {
            return tokens[token];
        }
    }

    const getTokenMatches = (text) => {
        let tokenRegex = /~~(.+?)(\n|;|$)/gi;
        return [...text.matchAll(tokenRegex)].map(x => [x[0], x[1]]);
    }

    const replaceAllTokens = (node) => {
        for (let child of node.childNodes) {
            // type of 3 === text node
            if (child.nodeType === 3) {
                let text = child.nodeValue;
                let tokenMatches = getTokenMatches(text);
                // for each token replace with recommendation
                let parentSpan = document.createElement('span');
                for (let [originalText, token] of tokenMatches) {
                    let recommendation = getRecommendation(token) || token;
                    let spanNode = document.createElement('span');
                    spanNode.textContent = text.replace(originalText, recommendation);
                    console.log(originalText);
                    parentSpan.append(spanNode);
                }
                child.replaceWith(parentSpan);
            }
            else {
                replaceAllTokens(child);
            }
        }
    } 

    const addRecommendation = () => {
        let recommendationEditor = document.querySelector('#editor2 > .ql-editor');
        replaceAllTokens(recommendationEditor);
    }

    const listTokens = () => {
        let tokenNames = Object.keys(tokens).sort();
        for(let token of tokenNames) {
            console.log(`[${token}] ${tokens[token].substring(0, 10)}...`);
        }
    }

    const main = () => {
        if ('pleaseListTokens' in window) {
            listTokens();
        }
        else {
            addRecommendation();
        }
    }

    main();
})();