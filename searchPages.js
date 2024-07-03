/**
 * TODO:
 *  - add comments
 *  - add text warning about needing to interact
 *  - with the multi-select
 */
(() => {
    const listboxId = 'bmk-pages-listbox';
    const comboboxId = 'bmk-pages-combobox';
    const containerId = 'bmk-pages-container';
    const comboboxWidgetId = 'bmk-pages-combobox-widget';

    let option2option = {};

    const pages = document.getElementById('pages');
    let styles;

    main();

    function main() {
        let options = [...pages.querySelectorAll('option')];
        let [label, pageSearch, optionsSearch] = makePagesCombobox(options);
        pageSearch.addEventListener('focusin', () => toggleListbox(pageSearch, true));
        pageSearch.addEventListener('blur', (e) => {
            if (!optionsSearch.contains(e.relatedTarget)) toggleListbox(pageSearch, false)
        });
        pageSearch.addEventListener('input', searchOptions);
        pageSearch.addEventListener('keydown', keyRouter);
        optionsSearch.addEventListener('keydown', optionKeyRouter);
        let container = makeHeaderBar();
        let closeBtn = makeCloseButton();
        let comboboxWidget = makeComboboxWidget(label, pageSearch, optionsSearch);
        container.append(comboboxWidget, closeBtn);
        document.documentElement.append(container);
        makeStyles();
    }

    function keyRouter(e) {
        let combobox = e.currentTarget;
        let listbox = document.getElementById(
            combobox.getAttribute('aria-controls')
        );
        switch (e.key) {
            case 'ArrowDown':
            case 'Enter':
                if (listbox.hidden) toggleListbox(combobox);
                listbox.querySelector('[role="option"]:not([hidden])').focus();
                return;
            case 'Escape':
                if (!listbox.hidden) toggleListbox(combobox);
                break;
            default:
                return;
        }
        e.preventDefault();
    }

    function makeStyles() {
        styles = document.createElement('style');
        document.head.appendChild(styles);
        let containerRule =
            `#${containerId} {`
            + ` position: absolute;`
            + ` width: 100vw;`
            + ` z-index: 100;`
            + ` background: white;`
            + ` display: flex;`
            + ` flex-direction: row;`
            + ` justify-content: space-between;`
            + ` align-items: center;`
            + ` gap: 0.5rem;`
            + ` padding: 0.5rem;`
            + ` box-shadow: 0px 3px 8px -3px black;`
            + ` border-bottom: 1px solid black;`
            + ` top: 0;`
            + `}`;
        let comboboxWidgetRule =
            `#${comboboxWidgetId} {`
            + ` position: relative;`
            + ` width: fit-content;`
            + `}`;
        let comboboxContainerBtnRule =
            `#${containerId} button {`
            + ` border: 1px solid black;`
            + ` box-shadow: 0px 3px 8px -3px black;`
            + ` display: flex;`
            + ` justify-content: center;`
            + ` padding: 0.5rem;`
            + `}`;
        let comboboxContainerBtnHoverRule =
            `#${containerId} button:hover {`
            + ` box-shadow: 0px 4px 9px -3px black;`
            + ` background-color: #EFEFEF;`
            + `}`;
        let listboxRule =
            `#${listboxId} {`
            + ` position: absolute;`
            + ` bottom: 0;`
            + ` transform: translate(0, 100%);`
            + ` max-height: calc(100vh - 5rem);`
            + ` z-index: 100;`
            + ` background: white;`
            + ` overflow-y: scroll;`
            + ` border: 1px solid black;`
            + `}`;
        let listboxOptionRule =
            `#${listboxId} [role="option"] {`
            + ` border-bottom: 1px solid black;`
            + ` padding: 0.3rem;`
            + `}`
        let listboxOptionSelectedRule =
            `#${listboxId} [role="option"].selected {`
            + ` font-weight: bold;`
            + ` border-bottom: 1px solid black;`
            + ` padding: 0.3rem;`
            + `}`
        let listboxOptionRule2 = 
            `#${listboxId} [role="option"]:nth-child(even):not(:focus) {`
            + ` background-color: #EFEFEF;`
            + `}`
        let listboxOptionFocusRule = 
            `#${listboxId} [role="option"]:focus {`
            + ` outline: none;`
            + ` color: #EFEFEF;`
            + ` background-color: #333;`
            + `}`
        let comboboxRule =
            `#${comboboxId} {`
            + ` border: 1px solid black;`
            + ` min-height: 2rem;`
            + ` margin-left: 0.5rem;`
            + `}`;
        styles.sheet.insertRule(containerRule);
        styles.sheet.insertRule(comboboxWidgetRule);
        styles.sheet.insertRule(comboboxContainerBtnRule);
        styles.sheet.insertRule(comboboxContainerBtnHoverRule);
        styles.sheet.insertRule(listboxRule);
        styles.sheet.insertRule(listboxOptionRule);
        styles.sheet.insertRule(listboxOptionRule2);
        styles.sheet.insertRule(listboxOptionFocusRule);
        styles.sheet.insertRule(listboxOptionSelectedRule);
        styles.sheet.insertRule(comboboxRule);
    }

    function makeComboboxWidget(label, combobox, listbox) {
        let widget = document.createElement('div');
        widget.id = comboboxWidgetId;
        widget.append(label, combobox, listbox);
        return widget;
    }

    function close(element) {
        let container = element.closest('[role="region"]');
        option2option = {};
        container.remove();
        styles.remove();
        pages.focus();
    }

    function makeCloseButton() {
        let btn = document.createElement('button');
        btn.textContent = 'close';
        btn.addEventListener('click', (e) => close(e.currentTarget));
        return btn;
    }

    function makeHeaderBar() {
        let header = document.createElement('div');
        header.role = 'region';
        header.id = containerId;
        header.setAttribute('aria-label', 'search pages combobox');
        header.classList.add('bmk-header');
        return header;
    }

    function optionKeyRouter(e) {
        let listbox = e.currentTarget;
        let combobox = document.querySelector(
            `[aria-controls="${listbox.id}"]`
        );
        let currentOption = e.target;
        let options = Array.from(
            listbox.querySelectorAll('[role="option"]:not([hidden])')
        );
        let currentIndex = options.indexOf(currentOption);
        let nextFocus, nextIndex;
        switch (e.key) {
            case 'ArrowDown':
                nextIndex = (currentIndex + 1);
            case 'ArrowUp':
                // if next index is set 
                // (aka arrow down was hit), don't set it
                nextIndex ??= (options.length + currentIndex - 1);
                nextIndex %= options.length;
                nextFocus = options[nextIndex];
                break;
            case 'Enter':
            case ' ':
                toggleListbox(combobox);
                activateOption(currentOption);
                return;
            case 'Escape':
                nextFocus = combobox;
                break;
            default:
                return;
        }
        e.preventDefault();
        nextFocus.focus();
    }

    function activateOption(option) {
        let realOption = option2option[option.textContent];
        //realOption.scrollIntoView({ block: 'center' });
        realOption.style.fontWeight = '700';
        realOption.selected = true;
        realOption.click();
        setTimeout(() => realOption.scrollIntoView({ block: 'center' }), 50);
        setTimeout(() => {
            realOption.style.fontWeight = 'normal';
        }, 10000);
        close(option);
    }

    function makePagesCombobox(options) {
        let label, combobox, listbox;
        label = document.createElement('label');
        label.textContent = 'Search Pages';
        label.htmlFor = comboboxId;

        combobox = document.createElement('input');
        combobox.id = comboboxId;
        combobox.type = 'text';
        combobox.role = 'combobox';
        combobox.setAttribute('aria-expanded', false);
        combobox.setAttribute('aria-controls', listboxId);
        combobox.setAttribute('aria-autocomplete', 'list');

        listbox = document.createElement('ul');
        listbox.role = 'listbox';
        listbox.id = listboxId;
        listbox.hidden = true;
        listbox.append(...options.map(o => {
            let newOption = document.createElement('li');
            newOption.role = 'option';
            newOption.tabIndex = -1;
            newOption.textContent = o.textContent;
            if (o.selected) {
                newOption.textContent = newOption.textContent + ' (selected)';
                newOption.classList.add('selected');
            }
            option2option[newOption.textContent] = o;
            newOption.addEventListener('click', () => {
                activateOption(newOption);
            });
            return newOption;
        }));
        return [label, combobox, listbox];
    }

    // return: the current expanded state
    function toggleListbox(combobox, visibility) {
        let listbox = document.getElementById(
            combobox.getAttribute('aria-controls')
        );
        let expanded = combobox.getAttribute('aria-expanded') === 'true';
        if (visibility !== undefined) {
            expanded = !visibility;
        }
        listbox.hidden = expanded;
        combobox.setAttribute('aria-expanded', !expanded);
        return !expanded;
    }

    function searchOptions(e) {
        let combobox = e.currentTarget;
        let options = Array.from(
            document.getElementById(
                combobox.getAttribute('aria-controls')
            ).querySelectorAll('[role="option"]')
        );
        for (let option of options) {
            let matched =
            option.textContent.toLowerCase()
                    .includes(combobox.value.toLowerCase());
            option.hidden = !matched;
        }
    }

})();