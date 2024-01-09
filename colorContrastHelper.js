/* toolbox contrast help */
/* Edits the inputs: target element description, issue description */
/* copies recommendation to clipboard based on success criteria (1.4.3 or 1.4.10) */
/* TODO: add 1.4.1 suppport */
const colorContraster = () => {
    let textareas = document.querySelectorAll('textarea:not(#auditor_notes):not(#second_audit_comments');
    let issueDesc = textareas[0];
    let target = document.getElementById('target');
    let sc = document.getElementById('success_criteria');

    let sc_text = sc.options[sc.selectedIndex].text;
    let text = issueDesc.value;

    let rgbaEx = new RegExp(/rgba\(((\d+(\.\d+)?)(, ?)?){4}\)/);
    let hexEx = new RegExp(/#[A-Fa-f\d]{6}/);
    let fore;
    let back;
    try {
        fore = text.match(/Foreground: #[A-Fa-f\d]{6}/gi)[0].match(/#[A-Fa-f\d]{6}/gi)[0];
        back = text.match(/Background: #[A-Fa-f\d]{6}/gi)[0].match(/#[A-Fa-f\d]{6}/gi)[0];
    } catch (e) {
        throw new Error(`couldn't find a match to something: ${e}`)
    }
    let ratio;
    if (text.match(/\d+.\d+:1/g) !== null) {
        ratio = text.match(/\d+.\d+:1/g)[0];
    }
    else if (text.match(/\d:1/g) !== null) {
        ratio = text.match(/\d:1/g)[0];
    }
    else {
        throw new Error('could not find ratio!');
    }
    ratio = formatRatio(ratio);

    let sc_chosen = sc_text.match(/\d+.\d+.\d+/)[0];

    let isGraphic = !!issueDesc.value.match(/~~graphic/gi);
    let isFocus = !!issueDesc.value.match(/~~focus/gi);
    let issueDescValue = '';
    let type;
    if (sc_chosen === '1.4.3') {
        type = 'Text';
    }
    else if (sc_chosen === '1.4.11') {
        type = 'Non-text'
    }

    if (!isGraphic) {
        target.value += ` and other elements sitewide with color combination ${fore} and ${back}`;
    }

    if (isGraphic && isFocus) {
        issueDescValue = `Focus indicator has an insufficient color contrast against a background image.\n\n`;
        issueDescValue += 'Representative Sample:\n';
    }
    else if (isGraphic) {
        issueDescValue = `${type} content has an insufficient color contrast against a background image.\n\n`;
        issueDescValue += 'Representative Sample:\n';
    }
    else if (isFocus) {
        issueDescValue = `Focus indicator has an insufficient color contrast against adjacent colors.\n\n`;
    }

    let forgroundName = 'Foreground';
    let backgroundName = 'Background';
    if (isFocus) {
        forgroundName = 'Focus Indicator (foreground)';
    }
    if (isGraphic) {
        backgroundName = 'Sampled Image (background)';
    }
    issueDescValue += `Insufficient color contrast ratio of ${ratio}\n${forgroundName}: ${fore}\n${backgroundName}: ${back}`;
    issueDesc.value = issueDescValue;

    let recommendation;
    if (sc_chosen === '1.4.3') {
        recommendation = 'Ensure that the contrast ratio meets the ratio 4.5:1 for normal text, and 3:1 for large-scale text.';

    }
    else if (sc_chosen === '1.4.11') {
        recommendation = 'Ensure that the contrast ratio meets the ratio 3:1 for interactable components or parts of graphical objects required to understand the content.';
    }
    else {
        alert('non applicable success criteria, cannot create recommendation');
    }

    if (isFocus) {
        recommendation += '\n\n';
        recommendation += 'We recommend using a solid outline with a width of at least 2px, that also contrasts well with its adjacent colors (at least a 3:1 color contrast ratio).';
        if (isGraphic) {
            recommendation += '\n\n';
            recommendation += 'To ensure that the focus indicator has good color contrast against an image, we recommend either using a two-tone focus indicator, or ensuring that the focus indicator is placed against a solid background color.';
        }
    }
    else if (isGraphic) {
        recommendation += '\n\n';
        recommendation += 'We recommend adding a solid background color to this content, and ensuring that the content contrasts well against this background color.'
    }

    navigator.clipboard.writeText(recommendation);
}
// round ratio down as 4.499999999999999999999 is still a wcag failure

/**
 * 
 * @param {String} ratioText format: 7864564:1
 */
function formatRatio(ratioText) {
    let [left, right] = ratioText.split(':');
    if (left.length > 4) left = left.substring(0, 4);
    return `${left}:1`;
}
colorContraster();