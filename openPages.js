let pagesOptions = document.getElementById('pages').querySelectorAll('option')

for(const pageOption of pagesOptions) {
    if (pageOption.selected) {
        let hrefMatch = pageOption.textContent.match(/https.*/); 
        if (!hrefMatch) return;
        let href = hrefMatch[0];
        // this is used in another bookmarklet that allows users
        // to replace one base website url with another, in case
        // our clients are using different development website urls
        // See bookmarklet replaceBaseURL
        if (window.hasOwnProperty('old-to-new-website')) {
            let convert = window['old-to-new-website'];
            href = href.replace(convert.oldText, convert.newText);
        }
        window.open(href, '_blank');
    }
};