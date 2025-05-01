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

    let data = [
      { value: 1, label: 'apples' },
      { value: 2, label: 'oranges' },
      { value: 3, label: 'mangos' },
      { value: 4, label: 'pears' },
      { value: 5, label: 'limes' },
      { value: 5, label: 'cherries' },
    ];
    

    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcData = sliceGenerator(data); 
    let arcGen = d3.arc().innerRadius(0).outerRadius(50);

    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    let svg = d3.select('#projects-plot');
    let legend = d3.select('.legend');
   
    data.forEach((d, idx) => {
      legend
        .append('li')
        .attr('class', 'legend-item')
        .attr('style', `--color:${colors(idx)}`)
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });

})();