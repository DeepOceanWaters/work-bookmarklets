const recommendationName = 'last-recommendation';
const issueName = 'last-issue-description';
const secondAuditName = 'second_audit_comments';
const thirdAuditName = 'third_audit_comments';

let recommendation = document.querySelector('#editor2 > .ql-editor');
recommendation.innerHTML = localStorage.getItem(recommendationName);

// issues description textarea does not have an ID, and the 
// label is not associated. We resort to picking the first
// text area, which appears to be the issues description box.
let issueDescription = document.querySelector('textarea');
issueDescription.value = localStorage.getItem(issueName);

let secondAudit = document.getElementById(secondAuditName);
if (secondAudit) secondAudit.value = localStorage.getItem(secondAuditName);

let thirdAudit = document.getElementById(thirdAuditName);
if (thirdAudit) thirdAudit.value = localStorage.getItem(thirdAuditName);