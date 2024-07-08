# addRecommendation
replaces tokens inside the audit recommendation editor. Tokens are formed as such: ~~token. ~~help and ~~helpvalue will both provide a list of possible tokens. ~~help only shows the tokens, while ~~helpvalue shows a preview of the value that replaces the token.
Tokens can be formed as such:
- ~~token
- ~~token.subtoken.subtoken
- ~~token.all (all will add the: issue, recommendation, and requirement; requirement typically stars with "ensure that...", recommendation is a default recommendation)

If you want to check the token values without needing to use ~~help, I recommend searching the code file. The "tokens" object contains all the recommendation information.

# colorContrastHelper
Automatically updates the target element, and the issue description fields based on the contents of the issue description field, and copies the generic audit recommendation to your clipboard. Issue description field should take the contents copied to the clipboard when pressing ctr+shift+c in CCA. Issue description field can also take the tokens: ~~focus, ~~graphic. ~~focus is for color contrast issues related to a focus indicator. ~~graphic is for content that is placed against an image.

Can handle: 1.4.3, 1.4.11, 1.4.1 (with use of color, I recommend modifying the issue text to be a little more descriptive)

Important note: Due to toolbox quirkiness, the following should be done in order: 
1. issue description field should be manually changed (such as adding a space, and then optionally deleting that space)
2. the same should be done to the target element description
3. then the audit recommendations field can be filled by pasting the generic audit recommendation

# exposeAltText
A simplistic way of visually exposing the alt text of images. Caution should be taken as the alt text is exposed in a simplistic manner - for example alt text provided in text near the image is not going to be caught as alt text.

If you don't see a label for an image that's been highlighted on the page, you can click on the image to log both the text alternative and the image element in the console.

# exposeElement
Takes a space delineated list of CSS selectors, and uses CSS ::before pseudo-elements to try and expose the elements that match the CSS selectors.

# exposeLabels
Similar to the other expose functions/bookmarklets, this uses CSS to visually identify when components have been given the ARIA-LABEL attribute.

# isLargeScale
This function is also present in the microlib. It will print in the console the color, text size, font-weight, and whether it is large-scale text or not. As a bookmarklet, it only is able to check the currently focused element. When called as part of the microlib, it can check any element (typically I use $0 to select the currently selected element in the inspector (for Chrome, I'm not sure if this is available in FireFox).

# microlib
A small collection of functions that, when this bookmarklet is activated, are added to the window object. It lists the functions available. 

# openPages
While viewing an issue in toolbox, opens each selected page.

# recordAudit
Saves changes made to various textareas in case the toolbox reloads when trying to submit and issue. 

# reloadAudit
Reloads the changes saved by recordAudit.

# replaceBaseURL
Relates to openPages. Sometimes clients use a different base url (probably due to changing dev environments in someway). This allows users to replace the base url of a previous link with the new base url. Specifically when using openPages.

# scrollTo
If an issue is selected, it should provide the issue's number relative to the page (e.g. 1-100). If given a number, the page will scroll to the table row that corresponds to the given issue number.

# showHeadings
Similar to expose functions. Visually exposes headings, accounts for ROLE=HEADING. Headings may or may not be visually exposed depending on the webpage's styles, but usually there isn't an issue.

# styleToolbox
Adds some basic styling to the various multi-selects that help me more easily use these controls.

# searchPage
Used on Toolbox audit page while an issue is open. It shows up at the top of the screen. It can be used to:
- search the pages multiselect
- select an option from the pages multiselet (IMPORTANT NOTE: You still need to manually interact with the pages multiselect. I recommend CTRL+Click on an unselected option twice) Also note that when selecting on option, the multiselect should scroll the option into view and bold its text for ~10 seconds.
- show only the currently selected pages in the combobox's associated listbox.

# switchPage
Switches between the first and second page of an audit in the toolbox. Audits almost never go above 200 issues. So far I have not had a single instance where I needed to view a third page.
