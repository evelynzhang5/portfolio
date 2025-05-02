
// import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
// import { fetchJSON, renderProjects } from '../global.js';

// (async function () {
//   const projects = await fetchJSON('../lib/projects.json');

//   const projectsContainer = document.querySelector('.projects');
//   renderProjects(projects, projectsContainer, 'h2');

//   const titleEl = document.querySelector('.projects-title');
//   if (titleEl) {
//     const baseText = titleEl.textContent.trim();
//     const count = Array.isArray(projects) ? projects.length : 0;
//     titleEl.textContent = `${count} ${baseText}`;
//   }

//   const searchInput = document.querySelector('.searchBar');
//   let query = '';
//   let selectedIndex = -1;

//   function renderPieChart(projectsToPlot) {
//     const svg = d3.select('#projects-plot');
//     svg.selectAll('path').remove();

//     const legend = d3.select('.legend');
//     legend.selectAll('*').remove();

//     const rolled = d3.rollups(projectsToPlot, v => v.length, d => d.year);
//     const data = rolled.map(([year, count]) => ({ label: year, value: count }));

//     const sliceGenerator = d3.pie().value(d => d.value);
//     const arcData = sliceGenerator(data);
//     const arcGen = d3.arc().innerRadius(0).outerRadius(50);
//     const colors = d3.scaleOrdinal(d3.schemeTableau10);

//     arcData.forEach((d, i) => {
//       svg.append('path')
//         .attr('d', arcGen(d))
//         .attr('fill', colors(i))
//         .attr('stroke', 'white')
//         .attr('stroke-width', 0.5)
//         .attr('class', selectedIndex === i ? 'selected' : null)
//         .on('click', () => {
//           selectedIndex = selectedIndex === i ? -1 : i;

//           svg.selectAll('path')
//             .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : null);

//           legend.selectAll('li')
//             .attr('class', (_, idx) => idx === selectedIndex ? 'legend-item selected' : 'legend-item');

//           if (selectedIndex === -1) {
//             renderProjects(projectsToPlot, projectsContainer, 'h2');
//           } else {
//             const selectedYear = data[selectedIndex].label;
//             const filtered = projectsToPlot.filter(p => p.year === selectedYear);
//             renderProjects(filtered, projectsContainer, 'h2');
//           }
//         });
//     });

//     data.forEach((d, idx) => {
//       legend.append('li')
//         .attr('class', idx === selectedIndex ? 'legend-item selected' : 'legend-item')
//         .attr('style', `--color: ${colors(idx)}`)
//         .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
//         .on('click', () => {
//           selectedIndex = selectedIndex === idx ? -1 : idx;

//           svg.selectAll('path')
//             .attr('class', (_, i) => i === selectedIndex ? 'selected' : null);

//           legend.selectAll('li')
//             .attr('class', (_, i) => i === selectedIndex ? 'legend-item selected' : 'legend-item');

//           if (selectedIndex === -1) {
//             renderProjects(projectsToPlot, projectsContainer, 'h2');
//           } else {
//             const selectedYear = d.label;
//             const filtered = projectsToPlot.filter(p => p.year === selectedYear);
//             renderProjects(filtered, projectsContainer, 'h2');
//           }
//         });
//     });
//   }

//   renderPieChart(projects);

//   searchInput.addEventListener('input', (event) => {
//     query = event.target.value.toLowerCase();
//     const filteredProjects = projects.filter(project => {
//       return Object.values(project).join(' ').toLowerCase().includes(query);
//     });

//     renderProjects(filteredProjects, projectsContainer, 'h2');
//     renderPieChart(filteredProjects);
//   });
// })();
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';

(async function () {
  const projects = await fetchJSON('../lib/projects.json');

  const projectsContainer = document.querySelector('.projects');
  renderProjects(projects, projectsContainer, 'h2');

  const titleEl = document.querySelector('.projects-title');
  if (titleEl) {
    const baseText = titleEl.textContent.trim();
    const count = Array.isArray(projects) ? projects.length : 0;
    titleEl.textContent = `${count} ${baseText}`;
  }

  const searchInput = document.querySelector('.searchBar');
  let query = '';
  let selectedIndex = -1;

  function getFilteredProjects() {
    return projects.filter(p => {
      const matchQuery = Object.values(p).join(' ').toLowerCase().includes(query);
      const matchYear = selectedIndex === -1 || p.year === currentData[selectedIndex].label;
      return matchQuery && matchYear;
    });
  }

  let currentData = [];

  function renderPieChart(projectsToPlot) {
    const svg = d3.select('#projects-plot');
    svg.selectAll('path').remove();

    const legend = d3.select('.legend');
    legend.selectAll('*').remove();

    const rolled = d3.rollups(projectsToPlot, v => v.length, d => d.year);
    currentData = rolled.map(([year, count]) => ({ label: year, value: count }));

    const sliceGenerator = d3.pie().value(d => d.value);
    const arcData = sliceGenerator(currentData);
    const arcGen = d3.arc().innerRadius(0).outerRadius(50);
    const colors = d3.scaleOrdinal(d3.schemeTableau10);

    arcData.forEach((d, i) => {
      svg.append('path')
        .attr('d', arcGen(d))
        .attr('fill', colors(i))
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5)
        .attr('class', selectedIndex === i ? 'selected' : null)
        .on('click', () => {
          selectedIndex = selectedIndex === i ? -1 : i;

          svg.selectAll('path')
            .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : null);

          legend.selectAll('li')
            .attr('class', (_, idx) => idx === selectedIndex ? 'legend-item selected' : 'legend-item');

          const filtered = getFilteredProjects();
          renderProjects(filtered, projectsContainer, 'h2');
          renderPieChart(filtered);
        });
    });

    currentData.forEach((d, idx) => {
      legend.append('li')
        .attr('class', idx === selectedIndex ? 'legend-item selected' : 'legend-item')
        .attr('style', `--color: ${colors(idx)}`)
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
        .on('click', () => {
          selectedIndex = selectedIndex === idx ? -1 : idx;

          svg.selectAll('path')
            .attr('class', (_, i) => i === selectedIndex ? 'selected' : null);

          legend.selectAll('li')
            .attr('class', (_, i) => i === selectedIndex ? 'legend-item selected' : 'legend-item');

          const filtered = getFilteredProjects();
          renderProjects(filtered, projectsContainer, 'h2');
          renderPieChart(filtered);
        });
    });
  }

  renderPieChart(projects);

  searchInput.addEventListener('input', (event) => {
    query = event.target.value.toLowerCase();
    const filteredProjects = getFilteredProjects();
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
  });
})();
