const headerBlur = document.querySelector('.header-blur');
const headerBlurMobile = document.querySelector('.header-blur-mobile');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    let opacity = scrollY / 10;
    opacity = Math.min(opacity, 1);
    headerBlur.style.opacity = opacity;
    headerBlurMobile.style.opacity = opacity;
});