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

  
function setColorScheme(colorScheme) {
  document.documentElement.classList.remove("force-light", "force-dark");

  if (colorScheme === "auto") {
    // Let browser use the OS-level preference via media query
    return;
  }

  if (colorScheme === "light") {
    document.documentElement.classList.add("force-light");
  } else if (colorScheme === "dark") {
    document.documentElement.classList.add("force-dark");
  }

  // Save to localStorage
  localStorage.colorScheme = colorScheme;
  console.log("Color scheme changed to:", colorScheme);
}


// Initialize theme from saved preference on page load
const select = document.querySelector(".color-scheme select");
if (select) {
  const saved = localStorage.colorScheme || "auto";
  select.value = saved;
  setColorScheme(saved);

  // Update on user change
  select.addEventListener("input", (e) => {
    setColorScheme(e.target.value);
  });
}

const form = document.querySelector("#contact-form");

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const subject = encodeURIComponent(data.get("subject"));
  const body = encodeURIComponent(data.get("body"));

  const mailto = `${form.action}?subject=${subject}&body=${body}`;

  location.href = mailto;
});
