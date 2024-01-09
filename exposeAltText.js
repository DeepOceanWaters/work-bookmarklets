
const exposeAltText = (element = document) => {
    const windowPropName = 'exposingImgs';
    let imgs = [...element.querySelectorAll('img')];
    imgs.push(...element.querySelectorAll('[role="img"]'));
    let imgNoAlt = [];
    let wonkersImgs = [];
    for (const img of imgs) {
        if (window.hasOwnProperty(windowPropName) && window[windowPropName]) {
            img.parentElement.parentElement.replaceChild(img, img.parentElement);
        }
        else {
            let wrapper = document.createElement('div');
            let altText = document.createElement('span');
            let altTextMsg;
            if (img.hasAttribute('role')) {
                if (img.role === 'img') {
                    if (img.hasAttribute('aria-label')) {
                        let label = img.getAttribute('aria-label')
                        altTextMsg = `${img.tagName}[role="${img.role}"] aria-label="${label}"`;
                    }
                    else {
                        altTextMsg = `UNEXPECTED: ${img.tagName}[role="${img.role}"] no aria-label`;
                        imgNoAlt.push(img);
                    }
                }
                else {
                    altTextMsg = `UNEXPECTED: ${img.tagName}[role="${img.role}"]`
                    wonkersImgs.push(img);
                }
            }
            else if (img.hasAttribute('alt')) {
                let alt = img.getAttribute('alt');
                altTextMsg = alt ? `alt="${img.alt}"` : 'empty alt';
            }
            else if (img.hasAttribute('title')) {
                altTextMsg = `title="${img.title}"`;
            }
            else {
                altTextMsg = 'no alt attribute';
                imgNoAlt.push(img);
            }
            altText.textContent = altTextMsg;

            wrapper.style.position = 'relative';
            wrapper.style.border = '2px dashed #351968';
            wrapper.style.borderRadius = '0.35rem';
            wrapper.style.outline = '2px dotted #f9e2e2'
            wrapper.style.width = 'fit-content';

            altText.style.position = 'absolute';
            altText.style.top = '0';
            altText.style.left = '0';
            altText.style.backgroundColor = 'rgba(0,0,0,0.8)';
            altText.style.color = 'white';
            altText.style.padding = '0.5rem';
            altText.style.zIndex = '999';
            img.parentElement.replaceChild(wrapper, img);
            wrapper.append(img, altText);
        }
    }
    if (window.hasOwnProperty(windowPropName)) {
        window[windowPropName] = !window[windowPropName];
    }
    else {
        window[windowPropName] = true;
    }
    console.log('all imgs', imgs);
    if (imgNoAlt.length > 0) console.log('imgs no alt:', imgNoAlt);
    if (wonkersImgs.length > 0) console.log('wonkers imgs, have a bizarre role???', wonkersImgs);
}
exposeAltText();