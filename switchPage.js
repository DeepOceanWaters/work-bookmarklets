// currently only switches between the first two pages, 
// but most audits don't have more than 200 issues anyways
const nextPage = () => {
    let pagination = document.querySelector('nav[aria-label="pagination"]');
    let pageOne = pagination.querySelector('[aria-label="Go to page 1"]');
    let pageTwo = pagination.querySelector('[aria-label="Go to page 2"]');
    if (pageOne.querySelector('[aria-current="page"]')) {
        pageTwo.click();
    }
    else {
        pageOne.click();
    }
}
nextPage();