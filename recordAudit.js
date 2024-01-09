// Records the issue description and other similar related fields
// use the reloadAudit bookmarklet to reload this content if the page
// reloads due to a authentication timeout
if (!window.auditorIsRecording) {
    window.auditorIsRecording = true;
    let stylesheet = document.createElement('style');
    stylesheet.id = "style-recording-custom-sheet";
    document.head.appendChild(stylesheet);
    let rule = `[aria-labelledby="modal-title"] h2 { color: darkgreen; }`;
    let rule2 = `[aria-labelledby="modal-title"] h2::after { content: " recording"; font-size: 1rem; }`
    stylesheet.sheet.insertRule(rule);
    stylesheet.sheet.insertRule(rule2);


    const recommendationName = 'last-recommendation';
    const issueName = 'last-issue-description';
    const secondAuditName = 'second_audit_comments';
    const thirdAuditName = 'third_audit_comments';

    let recommendation = document.querySelector('#editor2 > .ql-editor');
    recommendation.addEventListener('input', (e) => {
        localStorage.setItem(recommendationName, recommendation.innerHTML);
    });

    // issues description textarea does not have an ID, and the 
    // label is not associated. We resort to picking the first
    // text area, which appears to be the issues description box.
    let issueDescription = document.querySelector('textarea');

    issueDescription.addEventListener('input', (e) => {
        localStorage.setItem(issueName, issueDescription.value);
    });

    let secondAudit = document.getElementById(secondAuditName);
    if (secondAudit) {
        secondAudit.addEventListener('input', (e) => {
            localStorage.setItem(secondAuditName, secondAudit.value);
        });
    }

    let thirdAudit = document.getElementById(thirdAuditName);
    if (thirdAudit) {
        thirdAudit.addEventListener('input', (e) => {
            localStorage.setItem(thirdAuditName, thirdAudit.value);
        });
    }
}