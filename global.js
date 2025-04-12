console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
// let navLinks = $$("nav a");
// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname,
//   );
//   currentLink?.classList.add('current');
let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'Resume' },
    { url: 'contact/', title: 'Contact' },
    { url: 'https://github.com/evelynzhang5', title: 'Github' }
  ];
  
let nav = document.createElement('nav');
document.body.prepend(nav);
  
for (let p of pages) {
    let url = p.url;
    let title = p.title;
    
    // Adjust relative URLs based on deployment environment
    const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
      ? "/"       // Local server
      : "/evelynzhang5.github.io/portfolio/"; // GitHub Pages repo path
    
    // If the URL is not absolute, prepend the base path.
    url = !url.startsWith('http') ? BASE_PATH + url : url;
    
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    
    // Check if this link is for the current page and add current class if it is
    a.classList.toggle(
      'current',
      a.host === location.host && a.pathname === location.pathname,
    );
    
    // For external links like GitHub, open in a new tab
    if (a.host !== location.host) {
      a.target = "_blank";
    }
    
    nav.append(a);
  }
  