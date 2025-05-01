console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "resume/", title: "Resume" },
  { url: "contact/", title: "Contact" },
  { url: "https://github.com/evelynzhang5", title: "Github" },
];

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  const BASE_PATH =
    location.hostname === "localhost" || location.hostname === "127.0.0.1"
      ? "/"
      : "/portfolio/";

  url = !url.startsWith("http") ? BASE_PATH + url : url;

  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;

  a.classList.toggle(
    "current",
    a.host === location.host && a.pathname === location.pathname
  );

  if (a.host !== location.host) {
    a.target = "_blank";
  }

  nav.append(a);
}

// === Theme Switcher ===
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const autoLabel = `Automatic (${prefersDark ? "Dark" : "Light"})`;

document.body.insertAdjacentHTML(
  "afterbegin",
  `
  <label class="color-scheme" for="theme-select">
    Theme:
    <select id="theme-select" aria-label="Theme selector">
      <option value="auto">${autoLabel}</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
`
);

function setColorScheme(colorScheme) {
  document.documentElement.classList.remove("force-light", "force-dark");

  if (colorScheme === "auto") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    document.documentElement.classList.add(
      prefersDark ? "force-dark" : "force-light"
    );
  } else {
    document.documentElement.classList.add(`force-${colorScheme}`);
  }

  localStorage.colorScheme = colorScheme;
  console.log("Color scheme changed to:", colorScheme);
}

// === Initialize saved theme preference ===
const select = document.querySelector(".color-scheme select");
if (select) {
  const saved = localStorage.colorScheme || "auto";
  select.value = saved;
  setColorScheme(saved);

  select.addEventListener("input", (e) => {
    setColorScheme(e.target.value);
  });
}

// === Update theme label on OS change if set to auto ===
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (localStorage.colorScheme === "auto") {
      setColorScheme("auto");

      const select = document.querySelector(".color-scheme select");
      if (select) {
        select.options[0].textContent = `Automatic (${
          e.matches ? "Dark" : "Light"
        })`;
      }
    }
  });


const form = document.querySelector("#contact-form");

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const subject = encodeURIComponent(data.get("subject"));
  const body = encodeURIComponent(data.get("body"));

  const mailto = `${form.action}?subject=${subject}&body=${body}`;
  location.href = mailto;
});


export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    console.log('Fetch response:', response);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
    return [];
  }
}

/**
 * Render a list of projects into `containerElement`.
 * @param {Array<Object>} projects – array of { title, image, description, … }
 * @param {HTMLElement} containerElement – where to put the <article>s
 * @param {string} headingLevel – e.g. 'h2', 'h3'; defaults to 'h2'
 */
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
 // Validate container
 if (!(containerElement instanceof HTMLElement)) {
   console.error('Invalid container element:', containerElement);
   return;
 }

 // Clear out any old content
 containerElement.innerHTML = '';

 // Handle empty or non‐array data
 if (!Array.isArray(projects) || projects.length === 0) {
   const placeholder = document.createElement('p');
   placeholder.textContent = 'No projects to display.';
   containerElement.appendChild(placeholder);
   return;
 }

 // Sanitize headingLevel
 const tag = /^h[1-6]$/.test(headingLevel) ? headingLevel : 'h2';

 // Generate one <article> per project
 projects.forEach((project) => {
  const article = document.createElement('article');

  // Fallbacks for missing data
  const title       = project.title       || 'Untitled project';
  const link        = project.link        || null;
  const description = project.description || 'No description available.';

  // Image markup: wrapped in <a> if link exists
  const imgMarkup = project.image
    ? (link
        ? `<a href="${link}" target="_blank"><img src="${project.image}" alt="${title}"></a>`
        : `<img src="${project.image}" alt="${title}">`)
    : `<p><em>(No image provided)</em></p>`;

  // Title markup: wrapped in <a> if link exists
  const titleMarkup = link
    ? `<a href="${link}" target="_blank">${title}</a>`
    : title;

  // article.innerHTML = `
  //   <${tag}>${titleMarkup}</${tag}>
  //   ${imgMarkup}
  //   <p>${description}</p>
  //   <p class="year">${project.year}</p>
  // `;
    article.innerHTML = `
    <${tag}>${titleMarkup}</${tag}>
    ${imgMarkup}
    <div class="project-meta">
      <p>${description}</p>
      <p class="year">${project.year}</p>
    </div>
  `;


  containerElement.appendChild(article);
});
}
// global.js
// … your existing fetchJSON & renderProjects …

/**
 * Fetch public profile data for the given GitHub username.
 * Returns an object with fields like `public_repos`, `followers`, etc.
 */
export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
