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
// function setColorScheme(colorScheme) {
//     if (colorScheme === "auto") {
//       document.documentElement.style.removeProperty('color-scheme');
//     } else {
//       document.documentElement.style.setProperty('color-scheme', colorScheme);
//     }
//     localStorage.colorScheme = colorScheme;
//     console.log('Color scheme changed to:', colorScheme);
//   }
  
//   // 4.5: On page load, read the saved user preference (if any) and apply it,
//   // and update the <select> value to match.
// const select = document.querySelector('.color-scheme select');
// if (select) {
//   if (localStorage.colorScheme) {
//       let savedScheme = localStorage.colorScheme;
//       select.value = savedScheme;
//       setColorScheme(savedScheme);
//     }
//     // 4.4: Attach an input event listener so that when the user changes the selection, we update the scheme.
//   select.addEventListener('input', (event) => {
//       let newScheme = event.target.value;
//       setColorScheme(newScheme);
//     });
//   }
  


// // (Assuming your switcher HTML is already inserted as follows:)
// document.body.insertAdjacentHTML(
//   'afterbegin',
//   `
//     <label class="color-scheme">
//       Theme:
//       <select>
//         <option value="auto">Automatic</option>
//         <option value="light">Light</option>
//         <option value="dark">Dark</option>
//       </select>
//     </label>
//   `
// );

// Function to update the theme by toggling classes on the <html> element
function setTheme(theme) {
  const htmlEl = document.documentElement;
  // Remove any forced override classes first
  htmlEl.classList.remove('force-light', 'force-dark');

  if (theme === 'light') {
    htmlEl.classList.add('force-light');
  } else if (theme === 'dark') {
    htmlEl.classList.add('force-dark');
  }
  // For "auto" mode, don't add any forced class so the media query applies

  // Save the theme preference
  localStorage.setItem('colorScheme', theme);
  console.log('Theme set to:', theme);
}

// On page load, check localStorage
const select = document.querySelector('.color-scheme select');
if (select) {
  const savedTheme = localStorage.getItem('colorScheme') || 'auto';
  select.value = savedTheme;
  setTheme(savedTheme);

  // Attach event listener
  select.addEventListener('change', (event) => {
    setTheme(event.target.value);
  });
}
