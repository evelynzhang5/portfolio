import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

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
    let data = [1, 2]; // Two slices: 1 and 2

    // Step 4.1: Pie layout (calculates angles)
    let pie = d3.pie();
    let arcData = pie(data);

    // Step 4.2: Arc generator (turns angles into SVG paths)
    let arcGen = d3.arc().innerRadius(0).outerRadius(50);

    // Step 4.3: Choose two colors
    let colors = ['gold', 'purple'];

    // Step 4.4: Select the SVG and draw each path
    let svg = d3.select('#projects-plot');

    arcData.forEach((d, i) => {
      svg.append('path')
        .attr('d', arcGen(d))
        .attr('fill', colors[i])
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5);
    });

    





    
      
    


})();