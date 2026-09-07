document.querySelector('.menu').addEventListener('click', () => {
  const nav = document.querySelector('nav');
  const open = nav.classList.toggle('mobile-open');
  nav.style.display = open ? 'flex' : '';
  if (open) {
    nav.style.position = 'absolute';
    nav.style.top = '72px';
    nav.style.left = '0';
    nav.style.right = '0';
    nav.style.padding = '20px 6vw';
    nav.style.background = 'rgba(247,239,227,.98)';
    nav.style.flexDirection = 'column';
    nav.style.alignItems = 'stretch';
  }
});
