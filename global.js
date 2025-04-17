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

// === Enhanced Contact Form ===
const form = document.querySelector("#contact-form");

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const subject = encodeURIComponent(data.get("subject"));
  const body = encodeURIComponent(data.get("body"));

  const mailto = `${form.action}?subject=${subject}&body=${body}`;
  location.href = mailto;
});
