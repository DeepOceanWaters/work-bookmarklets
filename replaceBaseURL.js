
let contentId = 'old-to-new-website';
if (window.hasOwnProperty(contentId)) {
    delete window[contentId];
    console.log('Successfully deleted previous baseURL');
}
else {
    let oldText = prompt('text to replace');
    let newText = prompt('text to replace with');
    window[contentId] = {
        oldText: oldText,
        newText: newText
    };
}