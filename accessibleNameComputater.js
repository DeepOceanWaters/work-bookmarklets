const computeAccessibleName = (element) => {
    let rootNode = element;
    let currentNode = rootNode;
    let totalAccumulatedText = '';

}

const ROLES = {
    NOCORRESPONDINGROLE: 'No Corresponding Role',
    LINK: 'link',
    GENERIC: 'generic',
    GROUP: 'group',
    ARTICLE: 'article',
    COMPLEMENTARY: 'complementary',
    BLOCKQUOTE: 'blockquote',
    BUTTON: 'button',
    CAPTION: 'caption',
    CODE: 'code',
    LISTBOX: 'listbox',
    DELETION: 'deletion',
    TERM: 'term',
    DIALOG: 'dialog',
    EMPHASIS: 'emphasis',
    FIGURE: 'figure',
    CONTENTINFO: 'contentinfo',
    MAIN: 'main',
    NAVIGATION: 'navigation',
    REGION: 'region',
    FORM: 'form',
    HEADING: 'heading',
    BANNER: 'banner',
    SEPARATOR: 'separator',
    DOCUMENT: 'document',
    IMG: 'img',
    CHECKBOX: 'checkbox',
    TEXTBOX: 'textbox',
    SPINBUTTON: 'spinbutton',
    RADIO: 'radio',
    SLIDER: 'slider',
    SEARCHBOX: 'searchbox',
    COMBOBOX: 'combobox',
    INSERTION: 'insertion',
}

const getRole = (element) => {
    if (element.hasAttribute('role')) return element.getAttribute('role');

    let role;
    if (isCombobox(element)) return ROLES.COMBOBOX;
    switch (element.tagName) {
        // no corresponding role
        case 'ABBR':
        case 'AUDIO':
        case 'BASE':
        case 'BR':
        case 'CITE':
        case 'COL':
        case 'COLGROUP':
        case 'DD':
        case 'DL':
        case 'DT':
        case 'EMBED':
        case 'FIGCAPTION':
        case 'HEAD':
        case 'IFRAME':
            role = element.tageName;
            break;
        case 'A':
        case 'AREA':
            role = element.hasAttribute('href') ? LINK : GENERIC;
            break;
        case 'ADDRESS':
        case 'DETAILS':
        case 'FIELDSET':
        case 'HGROUP':
            role = ROLES.GROUP;
            break;
        case 'ARTICLE':
            role = ROLES.ARTICLE;
            break;
        case 'ASIDE':
            role = ROLES.COMPLEMENTARY;
            break;
        case 'B':
        case 'BDI':
        case 'BDO':
        case 'BODY':
        case 'DATA':
        case 'DIV':
        case 'I':
            role = ROLES.GENERIC;
            break;
        case 'BLOCKQUOTE':
            role = ROLES.BLOCKQUOTE;
            break;
        case 'BUTTON':
            role = ROLES.BUTTON;
            break;
        case 'CAPTION':
            role = ROLES.CAPTION;
            break;
        case 'CODE':
            role = ROLES.CODE;
            break;
        case 'DATALIST':
            role = ROLES.LISTBOX;
            break;
        case 'DEL':
            role = ROLES.DELETION;
            break;
        case 'DFN':
            role = ROLES.TERM;
            break;
        case 'DIALOG':
            role = ROLES.DIALOG;
            break;
        case 'EM':
            role = ROLES.EMPHASIS;
            break;
        case 'FIGURE':
            role = ROLES.FIGURE;
            break;
        case 'FOOTER':
            role = hasGenericfierParent(element) ? ROLES.GENERIC : ROLES.CONTENTINFO;
            break;
        case 'FORM':
            role = ROLES.FORM;
            break;
        case 'H1':
        case 'H2':
        case 'H3':
        case 'H4':
        case 'H5':
        case 'H6':
            role = ROLES.HEADING;
            break;
        case 'HEADER':
            role = hasGenericfierParent(element) ? ROLES.GENERIC : ROLES.BANNER;
            break;
        case 'HR':
            role = ROLES.SEPARATOR;
            break;
        case 'HTML':
            role = ROLES.DOCUMENT;
            break;
        case 'IMG':
            // SEE NOTE IN https://www.w3.org/TR/html-aria/#aria-semantics-that-extend-and-diverge-from-html MUST COMPLETE!
            // img has accname 
            role = ROLES.IMG;
            break;
        case 'INPUT':
            switch (element.type.toUpperCase()) {
                case 'COLOR':
                case 'DATE':
                case 'DATETIME-LOCAL':
                case 'FILE':
                case 'HIDDEN':
                case 'MONTH':
                case 'PASSWORD':
                case 'TIME':
                case 'WEEK':
                    role = `[${ROLES.NOCORRESPONDINGROLE}]INPUT[type="${element.type}"]`;
                case 'BUTTON':
                case 'IMAGE':
                case 'RESET':
                case 'SUBMIT':
                    role = ROLES.BUTTON;
                    break;
                case 'CHECKBOX':
                    role = ROLES.CHECKBOX;
                    break;
                case 'EMAIL':
                case 'TEL':
                case 'URL':
                    // with no list attribute
                    role = (element.hasAttribute('list')) ? ROLES.COMBOBOX : ROLES.TEXTBOX;
                    break;
                case 'NUMBER':
                    role = ROLES.SPINBUTTON;
                    break;
                case 'RADIO':
                    role = ROLES.RADIO;
                    break;
                case 'RANGE':
                    role = ROLES.SLIDER;
                    break;
                case 'SEARCH':
                    // with no list attr
                    role = (element.hasAttribute('list')) ? ROLES.COMBOBOX : ROLES.SEARCHBOX;
                    break;
                case 'TEXT':
                // with no list attr
                default:
                    role = (element.hasAttribute('list')) ? ROLES.COMBOBOX : ROLES.TEXTBOX;
                    break;
            }
            break;
        case 'INS':
            role = ROLES.INSERTION;
            break;
    }

}

const hasGenericfierParent = (element) => {
    let genericfiersNoRole = [
        'ARTICLE',
        'ASIDE',
        'MAIN',
        'NAV',
        'SECTION'
    ];
    let genericfiersWithRole = [
        ROLES.ARTICLE,
        ROLES.COMPLEMENTARY,
        ROLES.MAIN,
        ROLES.NAVIGATION,
        ROLES.REGION
    ]
    let CSSSelector = genericfiersNoRole.join(',')
    CSSSelector += ',' + genericfiersWithRole.map(rolename => `[role="${rolename}"]`).join(',');
    CSSSelector = `:is(${CSSSelector.trim(',')})`;
    return !!element.closest(CSSSelector);
}