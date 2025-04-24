import { fetchJSON, renderProjects } from '/portfolio/global.js';

(async function() {
  const projects = await fetchJSON('/portfolio/lib/projects.json');

  const projectsContainer = document.querySelector('.projects');
  renderProjects(projects, projectsContainer, 'h2');

    const titleEl = document.querySelector('.projects-title');
    if (titleEl) {
    // if you want to preserve any existing text, grab it first:
    const baseText = titleEl.textContent.trim();
    const count    = Array.isArray(projects) ? projects.length : 0;
    titleEl.textContent = `${count} ${baseText}`;
    }


})();