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
      : "/portfolio/"; // GitHub Pages repo path
    
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

document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
      Theme:
      <select>
        <option value="auto">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    `
  );
const select = document.querySelector('.color-scheme select');
if (select) {
    // On load, check for a saved color scheme:
  if (localStorage.colorScheme) {
      select.value = localStorage.colorScheme;
      document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    }
    
  select.addEventListener('input', (event) => {
      let newScheme = event.target.value;
      if (newScheme === "auto") {
        document.documentElement.style.removeProperty('color-scheme');
      } else {
        document.documentElement.style.setProperty('color-scheme', newScheme);
      }
      localStorage.colorScheme = newScheme;
      console.log('Color scheme changed to:', newScheme);
    });
  }
  