import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

import { fetchJSON, renderProjects } from '/portfolio/global.js';

(async function() {
  const projects = await fetchJSON('/portfolio/lib/projects.json');

  const projectsContainer = document.querySelector('.projects');
  renderProjects(projects, projectsContainer, 'h2');

    const titleEl = document.querySelector('.projects-title');
    if (titleEl) {
    const baseText = titleEl.textContent.trim();
    const count    = Array.isArray(projects) ? projects.length : 0;
    titleEl.textContent = `${count} ${baseText}`;
    }
    let data = [1, 2]; 

    let pie = d3.pie();
    let arcData = pie(data);

    let arcGen = d3.arc().innerRadius(0).outerRadius(50);

    let colors = ['gold', 'purple'];

    let svg = d3.select('#projects-plot');

    arcData.forEach((d, i) => {
      svg.append('path')
        .attr('d', arcGen(d))
        .attr('fill', colors[i])
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5);
    });

  

})();