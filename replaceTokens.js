/**
 * each token is an object
 * Token {
 *      value (String) - the recommendation
 *      resources (Array<String>) - list of links to put in the resources section
 * }
 */
const tokens = {
    cctext: {
        value: "Ensure that normal text has at least a 4.5:1 color contrast against its background color, and that large-scale text has at least a 3:1 color contrast ratio against its background color."
    },

    ccgraphic: {
        value: "Ensure that the contrast ratio meets the ratio 3:1 for interactable components or parts of graphical objects required to understand the content."
    },

    state: {
        value: "Ensure that when users can set the state of an interactive component, that state can be set and determined programmatically."
    },

    onfocus: {
        value: "Ensure that moving focus does not cause a change of context."
    },

    oninput: {
        value: "Ensure that changing the setting of an interactive component does not cause an automatic change in context"
    },

    name: {
        value: "Ensure that interactive components have an accessible name that describes their purpose."
    },

    role: {
        value: "Ensure that interactive components have an appropriate role."
    },

    label: {
        value: "Ensure that interactive components related to user input have a visible label at all times."
    },

    usecolor: {
        value: "Ensure that color is not the only means of distinguishing a visual element. Note that when the color contrast ratio is 3:1 or higher, then color is not considered the only means of distinguishing a visual element as luminance is perceived differently than hue/color."
    },

    reflow: {
        value: "Ensure that there is no loss of content or functionality when the viewport is set as described in the 1.4.10 Reflow Success Criterion (320 CSS Pixels width by 256 CSS Pixels height)."
    },

    zoom: {
        value: "Ensure that there is no loss of content or functionality when zoomed in up to 200%."
    },

    focusmanage: {
        value: "Ensure that when content in focus is removed, focus is managed and returned to a logical place."
    },

    keyboard: {
        value: "Ensure that all functionality of content can be operated using a keyboard."
    },
    
    bestpractice: {
        value: "Note that this is a best practice, and not necessary for conformance."
    },

    extra: {
        value: "In addition, while the following is not necessary for conformance, we recommend "
    },

    info: {
        value: "Ensure that structure and relationships and information conveyed through presentation can be programmatically determined or is available in text."
    },

    alt: {
        value: "Ensure that non-text content has a text alternative that serves and equivalent purpose."
    },

    labelinname: {
        value: "Ensure that when text visually labels an interactive component, that component's accessible name includes that text word-for-word."
    },

    focusvisible: {
        value: "Ensure that content in focus has a visible focus indicator, and the focus indicator has at least a 3:1 color contrast ratio against adjacent colors."
    },

    focusmodal: {
        value: "Ensure that when modal content is opened/showed, focus is moved into this content and restricted within it."
    },

    focusorder: {
        value: "Ensure that focus order preserves meaning and operability."
    },

    purpose: {
        value: "Ensure that the purpose of each link is unambiguous."
    },

    purposere: {
        value: "We recommend either:\n- Adding a visually hidden SPAN element with text content that provides context\n- Adding the attribute ARIA-DESCRIBEDBY with a value equal to the ID of an element that would provide context"
    },

    focusindicator: {
        value: "We recommend using a solid outline with a width of at least 2px, that also contrasts well with its adjacent colors (at least a 3:1 color contrast ratio)."
    },

    namere: {
        value: "We recommend either:\n- Adding a visually hidden SPAN element with text content that describes the purpose of this component\n- Adding the attribute ARIA-LABEL with a value that describes the purpose of this component\n- Adding the attribute ARIA-LABELLEDBY with a value equal to the ID of an element that has text content that describes the purpose of this component"
    },

    headingre: {
        value: "We recommend converting this text into a HEADING element of the appropriate level."
    },

    scrollableregion: {
        value: "We recommend wrapping this content in an element with the following properties:\n- ROLE=REGION\n- TABINDEX=0\n- ARIA-LABEL or ARIA-LABELLEDBY to provide an accessible name that describes the region"
    },

    labelre: {
        value: "We recommend adding a native HTML LABEL element and programmatically associating it with the component using the LABEL's FOR attribute."
    },

    focusrestrict: {
        value: "Typically, modal content restricts focus using JavaScript, where: \n- when moving focus forward while on the last element in the modal content, focus moves to the first focusable element in the modal content\n- when moving focus backwards while on the first element in the modal content, focus moves to the last focusable element in the modal content"
    },

    oninputre: {
        value: "We recommend either:\n- add a submit button and only update the content on submission\n- OR add text before these controls that notes that they will automatically update the associated content when their value is set"
    },

    statusfull: {
        value: "We recommend adding a live region and updating this live region with the text of the status message.\n\nLive regions can be created by adding the ARIA-LIVE attribute with a value of either POLITE or ASSERTIVE to an element. The following ROLES have an implicit ARIA-LIVE attribute value:\n- ROLE=STATUS (implicit ARIA-LIVE value of POLITE)\n- ROLE=ALERT (implicit ARIA-LIVE value of ASSERTIVE)\n\nNote that users agents need time to register live regions before they can be used. As such, we recommend that all live regions are added to the DOM as soon as the page loads. If the live region is added dynamically, then a delay will need to be implemented before any change is made to that live region to ensure that it has been registered by all user agents and works as intended."
    },

    onhover: {
        value: "Ensure that when content appears on hover/focus, that content can be dismissed without moving the pointer or focus."
    },

    onhoverre: {
        value: "We recommend either:\n- allow users to dismiss this content by pressing the Escape key\n- AND/OR allow users to dismiss this content by pressing the Control key"
    },

    focuscolor: {
        value: "Ensure that focus indicators have at least a 3:1 color contrast against adjacent colors."
    },

    errors: {
        value: "We recommend adding a list of errors at the top of the form where:\n- each list item identifies the form field in error with a link to the form field, and notes the error\n- focus is shifted onto the list of errors on form submission\nIf this is a long form, we recommend (in addition to the above) adding inline errors to each form field in error and associating that error with the form field as an accessible description.",
        resources: [
            "https://webaim.org/techniques/formvalidation/#form"
        ]
    },

    inlineerror: {
        value: "For inline error messages that appear either: onblur/focus movement, or when the related form field is in focus and an error has been detected; we recommend setting the error message as the accessible description of the related form field. The ARIA-DESCRIBEDBY attribute can be used to provide an accessible description.",
        resources: [
            "https://www.tpgi.com/simple-standalone-toggletip-widget-pattern/"
        ]
    },

    grouping: {
        value: "We recommend either:\n- wrapping this content in a native HTML FIELDSET element, with a LEGEND element.\n- adding the attribute ROLE=GROUP to an element wrapping this content\nAdditionally, the GROUP will need an accessible name, which should be the same as the text that visually labels it."
    },

    thirdparty: {
        value: "Content that is powered by code from a 3rd party vendor (such as YouTube, Twitter, etc.) must have a disclaimer added before it. The disclaimer should point out what aspect of this content is beyond your control. It should also give direct contact information so that users who have trouble accessing this content can get help easily.\n\nDisclaimers should come before the content in question, and must conform to WCAG. We recommend displaying disclaimers as either plain text, or a toggletip. We have added a link in the Resources section that demonstrates a toggletip.",
        resources: [
            "https://www.tpgi.com/simple-standalone-toggletip-widget-pattern/"
        ]
    },

    accdescription: {
        value: 'The ARIA-DESCRIBEDBY attribute takes a space delineated list of ID values, and constructs an accessible description based on those elements.'
    },

    skiplink: {
        value: "Ensure that there is a mechanism available to bypass blocks of content that have been repeated across multiple pages.\n\nWe recommend implementing a 'skip link'. Skip links typically take the form of an ANCHOR element named something similar to 'Skip to content', and when activated moves focus past the repeated block of content.",
        resources: [
            "https://webaim.org/techniques/skipnav/"
        ]
    }
}

const getRecommendation = (token) => {
    if (!(token in tokens)) {
        console.log(`token not found (${token})`);
    }
    else {
        return tokens[token].value;
    }
}

const getResources = (token) => {
    if (!(token in tokens)) {
        console.log(`token not found (${token})`);
    }
    else {
        return tokens[token].resources || [];
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
                let withValue = token === 'helpvalue';
                if (token === 'help' || withValue) {
                    let allOptions = listTokens(withValue);
                    let optionsText = '';
                    for (const option of allOptions) {
                        optionsText += option + '\n';
                    }
                    processedText = processedText.replaceAll('help', optionsText);
                    console.log(allOptions);
                }
                else {
                    let recommendation = getRecommendation(token) || `(couldn't find ${token})`;
                    let resources = getResources(token);
                    processedText = processedText.replace(processedText, recommendation);
                    if (resources?.length) processedText += '\n\n';
                    for(const resource of resources) {
                        processedText += '\n' + resource;
                    }
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
        if (withValue) text += `: ${tokens[token].value.substring(0, 25)}...`;
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