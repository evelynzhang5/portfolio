
// import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
// import scrollama from 'https://cdn.jsdelivr.net/npm/scrollama@3.2.0/+esm';

// let commits = [];
// let xScale, yScale, rScale, scatterSvg;
// let timeScale, commitProgress = 100;
// let commitMaxTime, filteredCommits = [];

// const tooltip = document.getElementById('commit-tooltip');
// const pieTooltip = d3.select("#pie-tooltip");


// async function loadData() {
//   const data = await d3.csv('loc.csv', row => ({
//     ...row,
//     line: +row.line,
//     depth: +row.depth,
//     length: +row.length,
//     datetime: new Date(row.datetime)
//   }));
//   return data;
// }


// function processCommits(data) {
//   return d3.groups(data, d => d.commit).map(([id, lines]) => {
//     const first = lines[0];
//     return {
//       id,
//       url: `https://github.com/evelynzhang5/portfolio/commit/${id}`,
//       author: first.author,
//       datetime: first.datetime,
//       hourFrac: first.datetime.getHours() + first.datetime.getMinutes() / 60,
//       totalLines: lines.length,
//       lines
//     };
//   }).sort((a, b) => d3.ascending(a.datetime, b.datetime));
// }

// function renderNarrativeSteps() {
//   d3.select('#scatter-story')
//     .selectAll('.step')
//     .data(commits)
//     .join('div')
//     .attr('class', 'step')
//     .html((d, i) => `
//       <p>On ${d.datetime.toLocaleString()}, I made 
//         <a href="${d.url}" target="_blank">
//           ${i === 0 ? 'my first commit, and it was glorious' : 'another glorious commit'}
//         </a>, editing ${d.totalLines} lines in ${d3.groups(d.lines, d => d.file).length} files.
//       </p>`);
// }

// function renderFileSteps() {
//   d3.select('#file-story')
//     .selectAll('.step')
//     .data(commits)
//     .join('div')
//     .attr('class', 'step')
//     .html(d => `
//       <p>By ${d.author} on ${d.datetime.toLocaleDateString()}, ${d.totalLines} lines were edited.</p>`);
// }



// function onTimeSliderChange() {
//   commitProgress = +document.getElementById("commit-progress").value;
//   commitMaxTime = timeScale.invert(commitProgress);

//   document.getElementById("commit-time").textContent = commitMaxTime.toLocaleString("en", {
//     dateStyle: "long", timeStyle: "short"
//   });

//   filteredCommits = commits.filter(d => d.datetime <= commitMaxTime);
//   updateScatterPlot(filteredCommits);
//   updateFileDisplay(filteredCommits);
//   updateStats(filteredCommits.flatMap(d => d.lines));
//   updateLanguagePie(filteredCommits);
// }

// function renderScatterPlot(data) {
//   const width = 1000, height = 600, margin = { top: 10, right: 10, bottom: 30, left: 40 };
//   const usableW = width - margin.left - margin.right;
//   const usableH = height - margin.top - margin.bottom;

//   xScale = d3.scaleTime().range([margin.left, margin.left + usableW]);
//   yScale = d3.scaleLinear().domain([0, 24]).range([margin.top + usableH, margin.top]);
//   rScale = d3.scaleSqrt().range([5, 20]);

//   scatterSvg = d3.select('#chart').append('svg')
//     .attr('viewBox', `0 0 ${width} ${height}`);

//   scatterSvg.append('g').attr('class', 'gridlines')
//     .selectAll('line')
//     .data(yScale.ticks(24))
//     .join('line')
//     .attr('x1', margin.left)
//     .attr('x2', width - margin.right)
//     .attr('y1', d => yScale(d))
//     .attr('y2', d => yScale(d))
//     .attr('stroke', '#ccc');

//   scatterSvg.append('g')
//     .attr('class', 'x-axis')
//     .attr('transform', `translate(0,${margin.top + usableH})`);

//   scatterSvg.append('g')
//     .attr('class', 'y-axis')
//     .attr('transform', `translate(${margin.left}, 0)`)
//     .call(d3.axisLeft(yScale).tickFormat(d => `${String(d === 24 ? 0 : d).padStart(2, '0')}:00`));

//   scatterSvg.append('g').attr('class', 'dots');

//   scatterSvg.call(d3.brush().on('start brush end', brushed));
//   scatterSvg.select('.dots').raise();
// }

// function updateScatterPlot(commits) {
//   xScale.domain(d3.extent(commits, d => d.datetime));
//   const [minLines, maxLines] = d3.extent(commits, d => d.totalLines);
//   rScale.domain([minLines, maxLines]);

//   const svg = d3.select('#chart').select('svg');
//   const xAxis = d3.axisBottom(xScale);

//   svg.select('g.x-axis').call(xAxis);

//   const dots = svg.select('g.dots');
//   const sortedCommits = d3.sort(commits, (d) => -d.totalLines);
//   dots
//     .selectAll('circle')
//     .data(sortedCommits, d => d.id)
//     .join('circle')
//     .attr('cx', d => xScale(d.datetime))
//     .attr('cy', d => yScale(d.hourFrac))
//     .attr('r', d => rScale(d.totalLines))
//     .attr('class', d => (d.hourFrac < 6 || d.hourFrac >= 18) ? 'dot night' : 'dot day')
//     .style('fill-opacity', 0.7)
//     .on('mouseenter', (event, commit) => {
//       d3.select(event.currentTarget).style('fill-opacity', 1);
//       showTooltip(commit, event);
//     })
//     .on('mouseleave', (event) => {
//       d3.select(event.currentTarget).style('fill-opacity', 0.7);
//       hideTooltip();
//     });
// }

// function brushed(event) {
//   if (!event.selection || !event.selection[0]) return;
//   const [[x0, y0], [x1, y1]] = event.selection;
//   const visible = d3.selectAll('.dots circle').data();
//   const selected = visible.filter(d => {
//     const x = xScale(d.datetime), y = yScale(d.hourFrac);
//     return x >= x0 && x <= x1 && y >= y0 && y <= y1;
//   });
//   d3.selectAll('circle').classed('selected', d => selected.includes(d));
// }


// function showTooltip(d, evt) {
//   tooltip.hidden = false;
//   tooltip.style.left = `${evt.clientX + 10}px`;
//   tooltip.style.top = `${evt.clientY + 10}px`;
//   document.getElementById('commit-link').href = d.url;
//   document.getElementById('commit-link').textContent = d.id;
//   document.getElementById('commit-date').textContent = d.datetime.toLocaleDateString();
//   document.getElementById('commit-time').textContent = d.datetime.toLocaleTimeString();
//   document.getElementById('commit-author').textContent = d.author;
//   document.getElementById('commit-lines').textContent = d.totalLines;
// }

// function updateFileDisplay(commits) {
//   const lines = commits.flatMap(d => d.lines);
//   const files = d3.groups(lines, d => d.file)
//     .map(([file, lines]) => ({ file, lines }))
//     .sort((a, b) => b.lines.length - a.lines.length);

//   const container = d3.select('#files');
//   container.selectAll('*').remove();

//   const fileColors = d3.scaleOrdinal(d3.schemeTableau10);
//   files.forEach(({ file, lines }) => {
//     const fileBlock = container.append('div');
//     fileBlock.append('dt').html(`<code>${file}</code><small>${lines.length} lines</small>`);
//     fileBlock.append('dd')
//       .selectAll('div')
//       .data(lines)
//       .join('div')
//       .attr('class', 'loc')
//       .style('background', d => fileColors(d.type));
//   });
// }
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import scrollama from 'https://cdn.jsdelivr.net/npm/scrollama@3.2.0/+esm';

let commits = [];
let xScale, yScale, rScale, scatterSvg;
let timeScale, commitProgress = 100;
let commitMaxTime, filteredCommits = [];

const tooltip = document.getElementById('commit-tooltip');
const pieTooltip = d3.select("#pie-tooltip");

async function loadData() {
  const data = await d3.csv('loc.csv', row => ({
    ...row,
    line: +row.line,
    depth: +row.depth,
    length: +row.length,
    datetime: new Date(row.datetime)
  }));
  return data;
}

function processCommits(data) {
  return d3.groups(data, d => d.commit).map(([id, lines]) => {
    const first = lines[0];
    return {
      id,
      url: `https://github.com/evelynzhang5/portfolio/commit/${id}`,
      author: first.author,
      datetime: first.datetime,
      hourFrac: first.datetime.getHours() + first.datetime.getMinutes() / 60,
      totalLines: lines.length,
      lines
    };
  }).sort((a, b) => d3.ascending(a.datetime, b.datetime));
}


function renderNarrativeSteps() {
  d3.select('#scatter-story')
    .selectAll('.step')
    .data(commits)
    .join('div')
    .attr('class', 'step')
    .html((d, i) => `
      <p>On ${d.datetime.toLocaleString()}, I made 
        <a href="${d.url}" target="_blank">
          ${i === 0 ? 'my first commit, and it was glorious' : 'another glorious commit'}
        </a>, editing ${d.totalLines} lines in ${d3.groups(d.lines, d => d.file).length} files.
      </p>`);
}

function renderFileSteps() {
  d3.select('#file-story')
    .selectAll('.step')
    .data(commits)
    .join('div')
    .attr('class', 'step')
    .html(d => `
      <p>By ${d.author} on ${d.datetime.toLocaleDateString()}, ${d.totalLines} lines were edited.</p>`);
}

function onTimeSliderChange() {
  commitProgress = +document.getElementById("commit-progress").value;
  commitMaxTime = timeScale.invert(commitProgress);

  document.getElementById("commit-time").textContent = commitMaxTime.toLocaleString("en", {
    dateStyle: "long", timeStyle: "short"
  });

  filteredCommits = commits.filter(d => d.datetime <= commitMaxTime);
  updateScatterPlot(filteredCommits);
  updateFileDisplay(filteredCommits);
  updateStats(filteredCommits.flatMap(d => d.lines));
  updateLanguagePie(filteredCommits);
  updateCommitInfo(filteredCommits.at(-1));
}

function updateCommitInfo(commit) {
  const container = d3.select("#selection-count");
  if (!commit) {
    container.text("No commits selected");
    return;
  }

  const { id, url, datetime, author, totalLines } = commit;

  container.html(`
    <strong>Latest Commit:</strong><br>
    <a href="${url}" target="_blank">${id}</a><br>
    ${datetime.toLocaleDateString()} @ ${datetime.toLocaleTimeString()}<br>
    <strong>Author:</strong> ${author}<br>
    <strong>Lines:</strong> ${totalLines}
  `);
}

function renderScatterPlot(data) {
  const width = 1000, height = 600, margin = { top: 10, right: 10, bottom: 30, left: 40 };
  const usableW = width - margin.left - margin.right;
  const usableH = height - margin.top - margin.bottom;

  xScale = d3.scaleTime().range([margin.left, margin.left + usableW]);
  yScale = d3.scaleLinear().domain([0, 24]).range([margin.top + usableH, margin.top]);
  rScale = d3.scaleSqrt().range([5, 20]);

  scatterSvg = d3.select('#chart').append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`);

  scatterSvg.append('g').attr('class', 'gridlines')
    .selectAll('line')
    .data(yScale.ticks(24))
    .join('line')
    .attr('x1', margin.left)
    .attr('x2', width - margin.right)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d))
    .attr('stroke', '#ccc');

  scatterSvg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${margin.top + usableH})`);

  scatterSvg.append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale).tickFormat(d => `${String(d === 24 ? 0 : d).padStart(2, '0')}:00`));

  scatterSvg.append('g').attr('class', 'dots');

  scatterSvg.call(d3.brush().on('start brush end', brushed));
  scatterSvg.select('.dots').raise();
}

function updateScatterPlot(commits) {
  xScale.domain(d3.extent(commits, d => d.datetime));
  const [minLines, maxLines] = d3.extent(commits, d => d.totalLines);
  rScale.domain([minLines, maxLines]);

  const svg = d3.select('#chart').select('svg');
  const xAxis = d3.axisBottom(xScale);

  svg.select('g.x-axis').call(xAxis);

  const dots = svg.select('g.dots');
  const sortedCommits = d3.sort(commits, (d) => -d.totalLines);
  dots
    .selectAll('circle')
    .data(sortedCommits, d => d.id)
    .join('circle')
    .attr('cx', d => xScale(d.datetime))
    .attr('cy', d => yScale(d.hourFrac))
    .attr('r', d => rScale(d.totalLines))
    .attr('class', d => (d.hourFrac < 6 || d.hourFrac >= 18) ? 'dot night' : 'dot day')
    .style('fill-opacity', 0.7)
    .on('mouseenter', (event, commit) => {
      d3.select(event.currentTarget).style('fill-opacity', 1);
      showTooltip(commit, event);
    })
    .on('mouseleave', (event) => {
      d3.select(event.currentTarget).style('fill-opacity', 0.7);
      hideTooltip();
    });
}

function brushed(event) {
  if (!event.selection || !event.selection[0]) return;
  const [[x0, y0], [x1, y1]] = event.selection;
  const visible = d3.selectAll('.dots circle').data();
  const selected = visible.filter(d => {
    const x = xScale(d.datetime), y = yScale(d.hourFrac);
    return x >= x0 && x <= x1 && y >= y0 && y <= y1;
  });
  d3.selectAll('circle').classed('selected', d => selected.includes(d));
}

function showTooltip(d, evt) {
  tooltip.hidden = false;
  tooltip.style.left = `${evt.clientX + 10}px`;
  tooltip.style.top = `${evt.clientY + 10}px`;
  document.getElementById('commit-link').href = d.url;
  document.getElementById('commit-link').textContent = d.id;
  document.getElementById('commit-date').textContent = d.datetime.toLocaleDateString();
  document.getElementById('commit-time').textContent = d.datetime.toLocaleTimeString();
  document.getElementById('commit-author').textContent = d.author;
  document.getElementById('commit-lines').textContent = d.totalLines;
  updateCommitInfo(d);
}

// function updateFileDisplay(commits) {
//   const lines = commits.flatMap(d => d.lines);
//   const files = d3.groups(lines, d => d.file)
//     .map(([file, lines]) => ({ file, lines }))
//     .sort((a, b) => b.lines.length - a.lines.length);

//   const container = d3.select('#files');
//   container.selectAll('*').remove();

//   const fileColors = d3.scaleOrdinal(d3.schemeTableau10);
//   files.forEach(({ file, lines }) => {
//     const fileBlock = container.append('div');
//     fileBlock.append('dt').html(`<code>${file}</code><small>${lines.length} lines</small>`);
//     fileBlock.append('dd')
//       .selectAll('div')
//       .data(lines)
//       .join('div')
//       .attr('class', 'loc')
//       .style('background', d => fileColors(d.type));
//   });
// }

function updateFileDisplay(commits) {
  const lines = commits.flatMap(d => d.lines);
  const files = d3.groups(lines, d => d.file)
    .map(([file, lines]) => ({ file, lines }))
    .sort((a, b) => b.lines.length - a.lines.length);

  const container = d3.select('#files');
  container.selectAll('*').remove(); // Rebuild display completely

  const fileColors = d3.scaleOrdinal(d3.schemeTableau10);

  files.forEach(({ file, lines }) => {
    const fileBlock = container.append('div');
    fileBlock.append('dt').html(`<code>${file}</code><small>${lines.length} lines</small>`);
    fileBlock.append('dd')
      .selectAll('div')
      .data(lines)
      .join('div')
      .attr('class', 'loc')
      .style('background', d => fileColors(d.type));
  });
}


function updateLanguagePie(filteredCommits) {
  const lines = filteredCommits.flatMap(d => d.lines);
  const counts = d3.rollups(lines, v => v.length, d => d.type)
                   .map(([type, value]) => ({ type, value }))
                   .sort((a, b) => b.value - a.value);

  const radius = 130;
  const hoverRadius = 140;
  const width = 360, height = 360;
  const color = d3.scaleOrdinal(d3.schemeTableau10);

  const pie = d3.pie().value(d => d.value);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);
  const arcHover = d3.arc().innerRadius(0).outerRadius(hoverRadius);

  const svg = d3.select("#language-pie")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  svg.selectAll("g").remove();

  const g = svg.append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2 + 10})`);


  const paths = g.selectAll("path")
    .data(pie(counts), d => d.data.type);

  const updatedPaths = paths.join(
    enter => enter.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.type))
      .each(function(d) { this._current = d; })
      .append("title")
      .text(d => `${d.data.type}: ${d.data.value}`),
    update => update
      .attr("d", arc)
      .attr("fill", d => color(d.data.type))
      .select("title")
      .text(d => `${d.data.type}: ${d.data.value}`),
    exit => exit.remove()
  );

  svg.selectAll("path")
    .on("mouseenter", function(event, d) {
      d3.select(this)
        .transition()
        .duration(150)
        .attr("d", arcHover);
    })
    .on("mouseleave", function(event, d) {
      d3.select(this)
        .transition()
        .duration(150)
        .attr("d", arc);
    })
    .on("mousemove", (event, d) => {
      pieTooltip
        .style("opacity", 1)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY}px`)
        .text(`${d.data.type}: ${d.data.value}`);
      event.currentTarget.parentNode.appendChild(event.currentTarget);
    });

  // 🔻 Language legend (right of pie)
  const legend = d3.select("#language-legend");
  legend.selectAll("*").remove();

  const total = d3.sum(counts, d => d.value);

  counts.forEach(d => {
    const colorValue = color(d.type);
    const percentage = ((d.value / total) * 100).toFixed(1);
    legend.append("li")
      .html(`
        <span class="swatch" style="background:${colorValue};"></span>
        ${d.type}: ${d.value} (${percentage}%)
      `);
  });
}


function updateStats(lines) {
  const c = d3.select('#stats');
  c.selectAll('*').remove();
  const dl = c.append('dl').attr('class', 'stats');

  dl.append('dt').text('Total LOC');
  dl.append('dd').text(lines.length);

  dl.append('dt').text('Total commits');
  dl.append('dd').text(commits.length);

  dl.append('dt').text('Files');
  dl.append('dd').text(d3.groups(lines, d => d.file).length);

  dl.append('dt').text('Avg line length');
  dl.append('dd').text(d3.mean(lines, d => d.length).toFixed(1));

  const periods = d3.rollups(lines, v => v.length, d => {
    const h = d.datetime.getHours();
    return h < 6 ? 'Night' : h < 12 ? 'Morning' : h < 18 ? 'Afternoon' : 'Evening';
  });
  const maxPeriod = d3.greatest(periods, d => d[1])?.[0];
  dl.append('dt').text('Most active period');
  dl.append('dd').text(maxPeriod || 'N/A');
}


function hideTooltip() {
  tooltip.hidden = true;
}

const raw = await loadData();
commits = processCommits(raw);
renderNarrativeSteps();
renderFileSteps();
renderScatterPlot(commits);



const scatterScroller = scrollama();
scatterScroller
  .setup({
    container: '#scrolly-1',
    step: '#scatter-story .step',
    offset: 0.5,
  })
  .onStepEnter(({ element }) => {
    const idx = commits.findIndex(d => d.id === element.__data__.id);
    const visible = commits.slice(0, idx + 1);
    updateScatterPlot(visible);
    updateFileDisplay(visible);
    updateStats(visible.flatMap(d => d.lines));
    updateLanguagePie(visible);
  });

const fileScroller = scrollama();
fileScroller
  .setup({
    container: '#file-scrolly',
    step: '#file-story .step',
    offset: 0.5,
  })
  .onStepEnter(({ element }) => {
    const idx = commits.findIndex(d => d.id === element.__data__.id);
    const visible = commits.slice(0, idx + 1);  // cumulative commits
    updateFileDisplay(visible);
    updateStats(visible.flatMap(d => d.lines));
    updateLanguagePie(visible);

  });

window.addEventListener('resize', () => {
  scatterScroller.resize();
  fileScroller.resize();
});
