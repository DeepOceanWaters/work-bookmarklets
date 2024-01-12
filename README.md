# addRecommendation
replaces tokens inside the audit recommendation editor. Tokens are formed as such: ~~token. ~~help and ~~helpvalue will both provide a list of possible tokens. ~~help only shows the tokens, while ~~helpvalue shows a preview of the value that replaces the token.

# colorContrastHelper
Automatically updates the target element, and the issue description fields based on the contents of the issue description field, and copies the generic audit recommendation to your clipboard. Issue description field should take the contents copied to the clipboard when pressing ctr+shift+c in CCA. Issue description field can also take the tokens: ~~focus, ~~graphic. ~~focus is for color contrast issues related to a focus indicator. ~~graphic is for content that is placed against an image.
Important note: Due to toolbox quirkiness, the following should be done in order: 
1. issue description field should be manually changed (such as adding a space, and then optionally deleting that space)
2. the same should be done to the target element description
3. then the audit recommendations field can be filled by pasting the generic audit recommendation

# exposeAltText
A simplistic way of visually exposing the alt text of images. Caution should be taken as the alt text is exposed in a simplistic manner - for example alt text provided in text near the image is not going to be caught as alt text.
