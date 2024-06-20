/**
 * each token is an object
 * Token {
 *      value (String) - the recommendation
 *      resources (Array<String>) - list of links to put in the resources section
 * }
 */
/*
const example = {
    issues: "",
    requirement: "",
    recommendation: ""
}*/
(() => {
    const tokens = {
        aliases: {
            bp: "bestpractice",
            re: "recommendation",
            req: "requirement",
            res: "resources",
            lin: "labelinname",
            i: 'issues',
            u: 'usability',
            deco: 'decorative',
            comp: 'component',
            hi: 'hierarchy',
            msg: 'message'
        },

        keywords: (
            (new Set())
                .add('value')
                .add('defaultVar')
                .add('all')
        ),

        cctext: {
            value: "Ensure that normal text has at least a 4.5:1 color contrast against its background color, and that large-scale text has at least a 3:1 color contrast ratio against its background color."
        },

        ccgraphic: {
            value: "Ensure that the contrast ratio meets the ratio 3:1 for interactable components or parts of graphical objects required to understand the content."
        },

        state: {
            value: "Ensure that when users can set the state of an interactive component, that state can be set and determined programmatically.",
            defaultVar: "",
            issues: {
                value: "The state ($var$) of this component is not programmatically determinable.",
                update: "The state ($var$) of this component is not properly updated."
            },
            null: {
                issues: "The state ($var$) of this component is not programmatically determinable.",
                requirement: "Ensure that when users can set the state of an interactive component, that state can be set and determined programmatically.",
                recommendation: "",
                defaultVar: ""
            }
        },

        onfocus: {
            value: "Ensure that moving focus does not cause a change of context."
        },

        focus: {
            value: "stuff",
            hidden: {
                
            },
            href: {
                issues: "This ANCHOR element is not focusable and does not have an appropriate role as it does not have an HREF attribute. Note that ANCHOR elements without an HREF attribute have a role of GENERIC and are not focusable.",
                requirement: "Ensure that interactive anchor elements have an HREF attribute, or are given an appropriate role and can be operated using a keyboard.",
                recommendation: "We recommend giving this ANCHOR element the HREF attribute. Otherwise we recommend giving it a ROLE of LINK, and TABINDEX=0."
            },
            manage: {
                open: {
                    relatedsc: ["2.4.3"],
                    issues: "When opening this dialog, focus is not managed and remains on the original",
                    requirement: "Ensure that when a modal dialog is opened, that focus is moved into the dialog.",
                    recommendation: "We recommend placing focus on the first focusable element in the dialog."
                },
                remove: {
                    issues: "When this content is removed, focus is not managed.",
                    requirement: "Ensure that when content in focus is removed, focus is managed and placed somewhere logical.",
                    recommendation: ""
                },
                restrict: {
                    disclosure: {
                        issues: "Focus is not resctricted within this content, and this disclosure does not collapse when focus moves out of it.",
                        requirement: "Ensure that when disclosure widgets can obscure other content, that focus is either restricted within the disclosure widget, or the disclosure widget is collapsed when focus moves out of it.",
                        recommendation: ""
                    },
                    dialog: {
                        issues: "Focus is not resctricted within this modal dialog.",
                        requirement: "Ensure that modal dialogs restrict focus within themselves.",
                        recommendation: "Typically, modal content restricts focus using JavaScript, where: \n- when moving focus forward while on the last element in the modal content, focus moves to the first focusable element in the modal content\n- when moving focus backwards while on the first element in the modal content, focus moves to the last focusable element in the modal content."
                    }
                }
            },
            visible: {
                issues: "This component does not have a visible focus indicator.",
                requirement: "Ensure that content in focus has a visible focus indicator, and the focus indicator has at least a 3:1 color contrast ratio against adjacent colors.",
                recommendation: "We recommend using a solid outline with a width of at least 2px, that also contrasts well with its adjacent colors (at least a 3:1 color contrast ratio).",
                lose: {
                    value: "Ensure that activating a component does not cause the component to lose its focus indicator."
                }
            }
        },

        oninput: {
            value: "Ensure that changing the setting of an interactive component does not cause an automatic change in context"
        },

        name: {
            value: "Ensure that interactive components have an accessible name that describes their purpose.",
            issues: "This component does not have an accessible name.",
            graphic: {
                issues: "This non-context content labels an interactive component, but it does not have a text alternative that describes the purpose/function of this component.",
                requirement: "Ensure that when non-text content labels an interactive component, it has a text alternative that describes the function/purpose of that component.",
                recommendation: "We recommend either:\n- updating the ALT attribute to describe the components purpose\n- Using the ARIA-LABEL or ARIA-LABELLEDBY attribute on the interactive component"
            },
            recommendation: {
                value: "We recommend either:\n- Adding a visually hidden SPAN element with text content that describes the purpose of this component\n- Using the ARIA-LABEL or ARIA-LABELLEDBY attribute"
            },
            badlabel: {
                issues: "This component does not have a label that describes its purpose/function.",
                requirement: "Ensure that interactive components have a label/accessible name that describes their purpose/function.",
                recommendation: ""
            }
        },

        role: {
            value: "Ensure that interactive components have an appropriate role.",
            dialog: {
                issues: "This content is a modal dialog, but it is not programmatically determinable as such.",
                requirement: "Ensure that modal dialogs are programmatically determinable as such.",
                recommendation: "We recommend adding the following attributes to an element that wraps this content:\n- ROLE=DIALOG\n- ARIA-MODAL=TRUE\n- ARIA-LABEL or ARIA-LABELLEDBY (to provide an accessible name that describes the dialog's purpose/content)"
            }
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

        keyboard: {
            value: "Ensure that all functionality of content can be operated using a keyboard."
        },

        bestpractice: {
            value: "Note that this is a best practice, and not necessary for conformance."
        },

        usability: {
            value: "Note that this is a usability problem, and not necessary for conformance."
        },

        extra: {
            value: "In addition, while the following is not necessary for conformance, we recommend "
        },

        info: {
            role: {
                issues: "This text presents as and acts as a $var$, but is not programmatically determinable as such.",
                recommendation: "We recommend converting this text into a $var$.",
                requirement: "Ensure that structure/relationships conveyed by presentation can be programmatically determined."
            },
            structure: {
                value: "Ensure that structure conveyed through presentation can be programmatically determined or is available in text."
            },
            info: {
                value: "Ensure that information conveyed through presentation can be programmatically determined or is available in text."
            },
            relationship: {
                value: "Ensure that relationships conveyed through presentation can be programmatically determined or is available in text."
            },
            value: "Ensure that structure, relationships, and information conveyed through presentation can be programmatically determined or is available in text."
        },

        alt: {
            value: "Ensure that non-text content has a text alternative that serves and equivalent purpose.",
            complex: {
                value: ""
            }
        },

        labelinname: {
            value: "Ensure that when text visually labels an interactive component, that component's accessible name includes that text word-for-word.",

            issues: {
                value: "The text that visually labels this component is not present in its accessible name word-for-word."
            }

        },

        focusrestrict: {
            value: "Ensure that "
        },

        focusvisible: {
            value: "Ensure that content in focus has a visible focus indicator, and the focus indicator has at least a 3:1 color contrast ratio against adjacent colors.",
            lose: {
                value: "Ensure that activating a component does not cause the component to lose its focus indicator."
            }
        },

        flyout: {
            value: "Ensure that when modal content is opened/showed, focus is moved into this content and restricted within it.",

            focusorder: {
                value: "Ensure that flyouts either restrict focus within themselves, or that the flyout is collapsed when focus moves beyond the flyout."
            }
        },

        at: {
            issues: {
                value: "",
                requirement: "Ensure that when content is meant to be hidden from all users, it is also hidden from AT.",
                recommendation: "Content can be hidden from AT by adding ARIA-HIDDEN=TRUE to an element wrapping the content. Any focusable elements within this content should be removed from focus order by adding TABINDEX=-1."
            }
        },

        focusorder: {
            issues: {
                multiplesame: {
                    value: "This component takes multiple tab stops as the interactive component is nested within a non-interactive element with tabindex=0",
                    recommendation: "Ensure that interactive components only take one tab stop."
                },
                hidden: {
                    value: "The contents of this widget are still focusable while hidden.",
                    recommendation: {
                        value: "Ensure that hidden content is not focusable unless it becomes visible while focused."
                    }
                }
            },

            value: "Ensure that focus order preserves meaning and operability.",

            multiple: {
                value: "Ensure that interactive components only take one tab stop."
            },

            inert: {
                value: ""
            }
        },

        image: {
            noalt: {
                issues: "This non-text content does not have a text alternative.",
                requirement: "Ensure that non-text content has a text alternative that adequately describes the content in context.",
                recommendation: "",
                imgre: {
                    value: "We recommend giving this IMG element an ALT attribute."
                }
            },
            badalt: {
                issues: "This non-text content has a text alternative, but it does not adequately describe the non-text content.",
                requirement: "Ensure that non-text content has a text alternative that adequately describes the content in context. If the non-text content is decorative, it should be implemented in a way such that AT can ignore it.",
                recommendation: ""
            },
            decorative: {
                issues: "This non-text content has a text alternative, but it is decorative.",
                requirement: "Ensure that decorative non-text content is implemented in a way such that AT can ignore it.",
                recommendation: "For IMG elements, we recommend setting the ALT attribute to be empty.\nFor SVG elements we recommend adding ARIA-HIDDEN=TRUE."
            }

        },

        link: {
            purpose: {
                issues: "The purpose of this link is ambiguous.",
                requirement: "Ensure that the purpose of each link is unambiguous.",
                recommendation: "We recommend adding the ARIA-DESCRIBEDBY attribute to provide context."
            },
        },


        focusindicator: {
            value: "We recommend using a solid outline with a width of at least 2px, that also contrasts well with its adjacent colors (at least a 3:1 color contrast ratio)."
        },

        namere: {
            value: "We recommend either:\n- Adding a visually hidden SPAN element with text content that describes the purpose of this component\n- Adding the attribute ARIA-LABEL with a value that describes the purpose of this component\n- Adding the attribute ARIA-LABELLEDBY with a value equal to the ID of an element that has text content that describes the purpose of this component"
        },

        heading: {
            value: "Ensure that text that presents as, and acts as a heading is programmatically determinable as such.",
            issues: {
                value: "This text presents as and acts as a HEADING, but is not programmatically determinable as such."
            },
            recommendation: {
                value: "We recommend converting this text into a HEADING element of the appropriate level."
            },
            empty: {
                issues: "This heading element empty.",
                requirement: "Ensure that headings describe the content that proceeds it.",
                recommendation: "We recommend removing this heading element if it is not being used. Otherwise please ensure that it has content that describes the content it heads."
            },
            null: {
                relatedsc: ["1.3.1"],
                issues: "This content is not visually presented as, and does not act as, a heading.",
                requirement: "Ensure that only text that acts and is presented as a heading is programmatically determinable as such.",
                recommendation: "We recommend replacing the HEADING element with a more appropriate element, such as a PARAGARAPH element. Alternatively, the attribute ROLE=NONE can be added to the HEADING element."
            },
            hierarchy: {
                relatedsc: ['1.3.1'],
                issues: "The visual/practical hierarchy of these headings does not match the programmatic hierarchy.",
                requirement: "Ensure that the visual/practical hierarchy of headings is programmatically determinable.",
                recommendation: "Heading levels (1-6) determine hierarchy. Heading levels can be skipped if necessary, but best practice is to ensure that heading levels aren't skipped - e.g. H2 is followed by an H3 if it is logical subsection of the H2 topic."
            }
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

        status: {
            value: "Ensure that status messages are implemented in a way such that AT can notify users of the message.",
            issues: {
                value: "This status message is not implemented in a way such that AT is notifying users of the message."
            },
            recommendation: {
                value: "We recommend adding a live region and updating this live region with the text of the status message.\n\nLive regions can be created by adding the ARIA-LIVE attribute with a value of either POLITE or ASSERTIVE to an element. The following ROLES have an implicit ARIA-LIVE attribute value:\n- ROLE=STATUS (implicit ARIA-LIVE value of POLITE)\n- ROLE=ALERT (implicit ARIA-LIVE value of ASSERTIVE)\n\nNote that users agents need time to register live regions before they can be used. As such, we recommend that all live regions are added to the DOM as soon as the page loads. If the live region is added dynamically, then a delay will need to be implemented before any change is made to that live region to ensure that it has been registered by all user agents and works as intended.",
                desc: {
                    value: "We recommend adding ARIA-DESCRIBEDBY to this INPUT, targeting the status message."
                }
            },
            message: {
                relatedsc: ["4.1.3"],
                issues: "This status message is not implemented in a way such that AT is notifying users of the message.",
                requirement: "Ensure that status messages are implemented in a way such that AT can notify users of the message.",
                recommendation: "We recommend adding a live region and updating this live region with the text of the status message.\n\nLive regions can be created by adding the ARIA-LIVE attribute with a value of either POLITE or ASSERTIVE to an element. The following ROLES have an implicit ARIA-LIVE attribute value:\n- ROLE=STATUS (implicit ARIA-LIVE value of POLITE)\n- ROLE=ALERT (implicit ARIA-LIVE value of ASSERTIVE)\n\nNote that users agents need time to register live regions before they can be used. As such, we recommend that all live regions are added to the DOM as soon as the page loads. If the live region is added dynamically, then a delay will need to be implemented before any change is made to that live region to ensure that it has been registered by all user agents and works as intended."
            },
            loading: {
                relatedsc: ["4.1.3"],
                issues: "Loading animations act as status messages but this one is not implemented in a way such that AT is notifying users of the message.",
                requirement: "Ensure that status messages such as loading animations are implemented in a way such that AT can notify users of the message.",
                recommendation: "We recommend adding a live region and updating this live region with the text of the status message.\n\nLive regions can be created by adding the ARIA-LIVE attribute with a value of either POLITE or ASSERTIVE to an element. The following ROLES have an implicit ARIA-LIVE attribute value:\n- ROLE=STATUS (implicit ARIA-LIVE value of POLITE)\n- ROLE=ALERT (implicit ARIA-LIVE value of ASSERTIVE)\n\nNote that users agents need time to register live regions before they can be used. As such, we recommend that all live regions are added to the DOM as soon as the page loads. If the live region is added dynamically, then a delay will need to be implemented before any change is made to that live region to ensure that it has been registered by all user agents and works as intended."
            }
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

        video: {
            audiodesc: {
                issues: "This video does not have an audio description.",
                requirement: "Ensure that videos have an audio description.",
                recommendation: "If the an audio description cannot be added to the video player, we recommend adding an audio description in text below the video. It can either be inside a disclosure widget (native HTML DETAILS/SUMMARY elements), or it can be a link to the audio description. Audio descriptions describe important visual elements that can't be understood from the main soundtrack alone - if provided in text it should annotate a transcript of the main soundtrack"
            }
        },

        inlineerror: {
            value: "For inline error messages that appear either: onblur/focus movement, or when the related form field is in focus and an error has been detected; we recommend setting the error message as the accessible description of the related form field. The ARIA-DESCRIBEDBY attribute can be used to provide an accessible description.",
            resources: [
                "https://www.tpgi.com/simple-standalone-toggletip-widget-pattern/"
            ]
        },

        grouping: {
            issues: "This content is visually grouped, but this grouping",
            value: "We recommend either:\n- wrapping this content in a native HTML FIELDSET element, with a LEGEND element.\n- adding the attribute ROLE=GROUP to an element wrapping this content\nAdditionally, the GROUP will need an accessible name, which should be the same as the text that visually labels it."
        },

        form: {
            group: {
                relatedsc: ["1.3.1"],
                issues: "These form fields are visually grouped, but this grouping is not programmatically determinable.",
                requirement: "Ensure that when content is visually grouped, this grouping can be programmatically determined.",
                recommendation: "We recommend either:\n- wrapping this content in a native HTML FIELDSET element, with a LEGEND element (provides an accessible name to the FIELDSET).\n- adding the attribute ROLE=GROUP to an element wrapping this content and providing it an accessible name.\n\nNote that GROUPs need an accessible name otherwise they are not exposed to users. For a FIELDSET element, the LEGEND element provides an accessible name. For ROLE=GROUP, ARIA-LABEL or ARIA-LABELLEDBY can be used."
            },
            errors: {
                null: {
                    issues: "While errors are detected, the form fields in error are not identified and the error described in text."
                },
                message: {
                    relatedsc: ['3.3.1', '4.1.3'],
                    issues: "While errors are detected and described in text, they are not implemented in a way such that AT can relay this message to users when it is populated.",
                    requirement: "Ensure that AT can notify users of error messages.",
                    recommendation: "We recommend adding a list of errors at the top of the form where:\n- each list item identifies the form field in error with a link to the form field, and notes the error\n- focus is shifted onto the list of errors on form submission\nWe also recommend (in addition to the above) adding inline errors to each form field in error and associating that error with the form field as an accessible description - this can be done by adding ARIA-DESCRIBEDBY to the form field.",
                    resources: [
                        "https://webaim.org/techniques/formvalidation/#form"
                    ]
                }
            }
        },

        thirdparty: {
            value: "Content that is powered by code from a 3rd party vendor (such as YouTube, Twitter, etc.) must have a disclaimer added before it. The disclaimer should point out what aspect of this content is beyond your control. It should also give direct contact information so that users who have trouble accessing this content can get help easily.\n\nDisclaimers should come before the content in question, and must conform to WCAG. We recommend displaying disclaimers as either plain text, or a toggletip. We have added a link in the Resources section that demonstrates a toggletip.",
            resources: [
                "https://www.tpgi.com/simple-standalone-toggletip-widget-pattern/"
            ]
        },

        accdescription: {
            value: "The ARIA-DESCRIBEDBY attribute takes a space delineated list of ID values, and constructs an accessible description based on those elements.\n"
        },

        skiplink: {
            value: "Ensure that there is a mechanism available to bypass blocks of content that have been repeated across multiple pages.\n\nWe recommend implementing a 'skip link'. Skip links typically take the form of an ANCHOR element named something similar to 'Skip to content', and when activated moves focus past the repeated block of content.",
            resources: [
                "https://webaim.org/techniques/skipnav/"
            ]
        }
    }

    const getRecommendation = (token) => {
        let splits = token.split(':');
        token = splits[0];
        let args = splits.slice(1);
        let possibleTokens = token.split('.');
        let tokenObj = tokens;
        let outputValue = "";
        for (let aToken of possibleTokens) {
            if (aToken in tokens.aliases) {
                aToken = tokens.aliases[aToken];
            }
            if (aToken === 'value') {
                throw new Error('"value" is not an allowed token value.');
            }
            else if (aToken === 'all') {
                outputValue = tokenObj["issues"];
                outputValue += '\n\n';
                outputValue += tokenObj["requirement"];
                outputValue += '\n\n';
                outputValue += tokenObj["recommendation"];
                break;
            }
            else if (aToken === 'resources') {
                let listOfResources = tokenObj["resources"];
                if (!listOfResources) {
                    outputValue = `no resources found for ${token}`;
                }
                else {
                    for(const resource of listOfResources) {
                        outputValue += "\n" + resource; 
                    }
                }
            }
            else if (!(aToken in tokenObj)) {
                console.log(`token not found (${token})`);
                return;
            }
            else {
                tokenObj = tokenObj[aToken];
            }
        }
        outputValue ||= tokenObj.value;
        return replaceVariables(outputValue, args);
    }

    const replaceVariables = (recommendation, args) => {
        if (args.length === 1) {
            recommendation = recommendation.replaceAll('$var$', args[0]);
        }
        else {
            let variablesAndValues = getVariablesAndValues(args);
            for (let [variable, value] of variablesAndValues) {
                recommendation = recommendation.replaceAll(`$${variable}$`, value);
            }
        }
        return recommendation;
    }

    const getVariablesAndValues = (variableAssignments) => {
        let variablesAndValues = [];
        for (let variableAssignment of variableAssignments) {
            let [variable, value] = variableAssignment.split('=');
            variablesAndValues.push([variable, value]);
        }
        return variablesAndValues;
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
            let tokenObj = tokens[token];
            let tokenObjKeys = Object.keys(tokenObj);
            tokenObjKeys.splice(tokenObjKeys.indexOf('value'), 1);
            let options = tokenObjKeys.join(', ');
            let text = `${token}[ ${options} ]`;
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
})();