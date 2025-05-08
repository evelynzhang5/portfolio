
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';

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

//   function getFilteredProjects() {
//     return projects.filter(p => {
//       const matchQuery = Object.values(p).join(' ').toLowerCase().includes(query);
//       const matchYear = selectedIndex === -1 || p.year === currentData[selectedIndex].label;
//       return matchQuery && matchYear;
//     });
//   }

//   let currentData = [];

//   function renderPieChart(projectsToPlot) {
//     const svg = d3.select('#projects-plot');
//     svg.selectAll('path').remove();

//     const legend = d3.select('.legend');
//     legend.selectAll('*').remove();

//     const rolled = d3.rollups(projectsToPlot, v => v.length, d => d.year);
//     currentData = rolled.map(([year, count]) => ({ label: year, value: count }));

//     const sliceGenerator = d3.pie().value(d => d.value);
//     const arcData = sliceGenerator(currentData);
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

//           const filtered = getFilteredProjects();
//           renderProjects(filtered, projectsContainer, 'h2');
//           renderPieChart(filtered);
//         });
//     });

//     currentData.forEach((d, idx) => {
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

//           const filtered = getFilteredProjects();
//           renderProjects(filtered, projectsContainer, 'h2');
//           renderPieChart(filtered);
//         });
//     });
//   }

//   renderPieChart(projects);

//   searchInput.addEventListener('input', (event) => {
//     query = event.target.value.toLowerCase();
//     const filteredProjects = getFilteredProjects();
//     renderProjects(filteredProjects, projectsContainer, 'h2');
//     renderPieChart(filteredProjects);
//   });
// })();
let query = '';
let selectedIndex = -1;
let allProjects = [];

async function main() {
  allProjects = await fetchJSON('../lib/projects.json');
  const searchInput = document.querySelector('.searchBar');
  searchInput.addEventListener('input', (event) => {
    query = event.target.value;
    renderAll();
  });

  renderAll();
}

function getYearByIndex(i) {
  const rolled = d3.rollups(allProjects, v => v.length, d => d.year);
  return rolled.map(([year]) => year)[i];
}

function getFilteredProjects() {
  return allProjects.filter(project => {
    const values = Object.values(project).join('\n').toLowerCase();
    const matchesQuery = values.includes(query.toLowerCase());

    if (selectedIndex === -1) {
      return matchesQuery;
    } else {
      const selectedYear = getYearByIndex(selectedIndex);
      return matchesQuery && project.year === selectedYear;
    }
  });
}

function renderAll() {
  const filtered = getFilteredProjects();
  renderProjects(filtered, document.querySelector('.projects'), 'h2');
  renderPieChart(allProjects, filtered);
}

function renderPieChart(fullProjects, filteredProjects) {
  const svg = d3.select('svg');
  svg.selectAll('*').remove();
  d3.select('.legend').selectAll('*').remove();

  const rolledData = d3.rollups(
    fullProjects,
    v => v.length,
    d => d.year
  );

  const data = rolledData.map(([year, count]) => ({
    label: year,
    value: count
  }));

  const pie = d3.pie().value(d => d.value);
  const arcData = pie(data);
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  const colors = d3.scaleOrdinal(d3.schemeTableau10);

  arcData.forEach((arc, i) => {
    svg.append('path')
      .attr('d', arcGenerator(arc))
      .attr('fill', colors(i))
      .attr('class', i === selectedIndex ? 'selected' : '')
      .style('cursor', 'pointer')
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        renderAll();
      });
  });

  const legend = d3.select('.legend');
  legend
    .style('display', 'flex')
    .style('justify-content', 'space-between')
    .style('flex-wrap', 'wrap')
    .style('gap', '1rem')
    .style('width', '100%');

  data.forEach((d, i) => {
    legend.append('li')
      .attr('class', `legend-item ${i === selectedIndex ? 'selected' : ''}`)
      .style('--color', colors(i))
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        renderAll();
      });
  });
}

main();