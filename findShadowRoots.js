(() => {
    console.log(findShadowRoot());
    
    function findShadowRoot(element = document.documentElement) {
        let shadowRootElements = [];
        _findShadowRoot(element, shadowRootElements);
        return shadowRootElements;
    }

    function _findShadowRoot(element, outputArray) {
        for (const child of element.children) {
            if (child.shadowRoot) {
                outputArray.push(child);
            }
            _findShadowRoot(child, outputArray);
        }
    }
})();