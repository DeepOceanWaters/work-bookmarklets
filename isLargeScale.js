// determines if the text properties 
const getElStyle = (element) => {
    if (!element) throw new Error('no element found. Please focus an element to get its bizniz');
    let elementStyle = window.getComputedStyle(element);
    // convert from px to pt, getPropertyValue should get the used value which should always be in px
    const fontSize = Number(elementStyle.getPropertyValue('font-size').replace('px', '')) * 0.75;
    // 700 or higher is bold
    const fontWeight = Number(elementStyle.getPropertyValue('font-weight'));
    // given the font-size and font-weight, determine if this content is "large-scale"
    // given the WCAG definition of "large-scale"
    const isLargeScale = !!(fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700));
    let color = elementStyle.getPropertyValue('color');
    if (element.tagName.toLowerCase() === 'a') {
        color += 'Link (anchor elements) color should always return the non-visited link color when using JavaScript. Please inspect the content using your browsers DevTools. Search "CSS History Leak" for more information.';
    }
    let text = `color: ${color}\nfont-size: ${fontSize}pt\nfont-weight: ${fontWeight}\nis large-scale: ${isLargeScale}`;
    console.log(text);
}
getElStyle(document.activeElement);