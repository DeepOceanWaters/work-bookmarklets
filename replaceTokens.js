const tokens = {
    // ensure
    cctext: 'Ensure that normal text has at least a 4.5:1 color contrast against its background color, and that large-scale text has at least a 3:1 color contrast ratio against its background color',

    ccgraphic: 'Ensure that the contrast ratio meets the ratio 3:1 for interactable components or parts of graphical objects required to understand the content.',

    state: 'Ensure that when users can set the state of an interactive component, that state can be set and determined programmatically.',

    onfocus: 'Ensure that moving focus does not cause a change of context.',

    oninput: 'Ensure that changing the setting of an interactive component does not cause an automatic change in context',

    name: 'Ensure that interactive components have an accessible name that describes their purpose.',

    role: 'Ensure that interactive components have an appropriate role.',

    label: 'Ensure that interactive components related to user input have a visible label at all times.',

    usecolor: 'Ensure that color is not the only means of distinguishing a visual element. Note that when the color contrast ratio is 3:1 or higher, then color is not considered the only means of distinguishing a visual element as luminance is perceived differently than hue/color.',

    reflow: 'Ensure that there is no loss of content or functionality when the viewport is set as described in the 1.4.10 Reflow Success Criterion (320 CSS Pixels width by 256 CSS Pixels height).',

    zoom: 'Ensure that there is no loss of content or functionality when zoomed in up to 200%.',

    focusmanage: 'Ensure that when content in focus is removed, focus is managed and returned to a logical place.',

    keyboard: 'Ensure that all functionality of content can be operated using a keyboard.',

    bestpractice: 'Note that this is a best practice, and not necessary for conformance.',

    extra: 'In addition, while the following is not necessary for conformance, we recommend ',

    info: 'Ensure that structure and relationships and information conveyed through presentation can be programmatically determined or is available in text.',

    alt: 'Ensure that non-text content has a text alternative that serves and equivalent purpose.',

    labelinname: `Ensure that when text visually labels an interactive component, that component's accessible name includes that text word-for-word.`,

    focusvisible: 'Ensure that content in focus has a visible focus indicator.',

    focusmodal: 'Ensure that when modal content is opened/showed, focus is moved into this content and restricted within it.',

    focusorder: 'Ensure that focus order preserves meaning and operability.',

    /*** recommendations ***/
    focusindicator: 'We recommend using a solid outline with a width of at least 2px, that also contrasts well with its adjacent colors (at least a 3:1 color contrast ratio).',

    namere: 'We recommend either:\n- Adding a visually hidden SPAN element with text content that describes the purpose of this component\n- Adding the attribute ARIA-LABEL with a value that describes the purpose of this component\n- Adding the attribute ARIA-LABELLEDBY with a value equal to the ID of an element that has text content that describes the purpose of this component',

    scrollableregion: 'We recommend wrapping this content in an element with the following properties:\n- ROLE=REGION\n- TABINDEX=0\n- ARIA-LABEL or ARIA-LABELLEDBY to provide an accessible name that describes the region',

    labelre: `We recommend adding a native HTML LABEL element and programmatically associating it with the component using the LABEL's FOR attribute.`,

    focusrestrict: 'Typically, modal content restricts focus using JavaScript, where: \n- when moving focus forward while on the last element in the modal content, focus moves to the first focusable element in the modal content\n- when moving focus backwards while on the first element in the modal content, focus moves to the last focusable element in the modal content',

    oninputre: 'We recommend either:\n- add a submit button and only update the content on submission\n- OR add text before these controls that notes that they will automatically update the associated content when their value is set'
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

/**
 * Note that due to how the toolbox's widget works, only the text nodes should be replaced.
 * @param {HTMLNode} node 
 */
const replaceAllTokens = (node) => {
    for (let child of node.childNodes) {
        // type of 3 === text node
        if (child.nodeType === 3) {
            let text = child.nodeValue;
            let tokenMatches = getTokenMatches(text);
            // for each token replace with recommendation
            node.textContent = '';
            let processedText = text;
            for (let [originalText, token] of tokenMatches) {
                let withValue = false;
                if (token === 'helpvalue') {
                    withValue = true;
                    token = 'help';
                }
                if (token === 'help') {
                    let allOptions = listTokens(withValue);
                    let optionsText = '';
                    for(const option of allOptions) {
                        optionsText += option + '\n';
                    }
                    processedText = processedText.replaceAll('help', optionsText);
                    console.log(allOptions);
                }
                else {
                    let recommendation = getRecommendation(token) || `(couldn't find ${token})`;
                    processedText = processedText.replace(processedText, recommendation);
                }
            }
            node.append(processedText);
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

const listTokens = (withValue = false) => {
    let tokenList = [];
    let tokenNames = Object.keys(tokens).sort();
    for (let token of tokenNames) {
        let text = `${token}`;
        if (withValue) text += `: ${tokens[token].substring(0, 25)}...`;
        tokenList.push(text);
    }
    console.log(tokenList);
    return tokenList;
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