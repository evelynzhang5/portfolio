

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let commits = [];
let NUM_ITEMS = 0;
let ITEM_HEIGHT = 120;
let VISIBLE_COUNT = 5;

let xScale, yScale, rScale;
let scrollContainer, spacer, itemsContainer;


async function loadData() {
  const data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: +row.line,
    depth: +row.depth,
    length: +row.length,
    date: new Date(row.date + 'T00:00' + row.timezone),
    datetime: new Date(row.datetime),
  }));
  return data;
}

function getTimeOfDay(hour) {
  if (hour < 6) return 'Night';
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
}

function processCommits(data) {
  return d3.groups(data, d => d.commit).map(([commit, lines]) => {
    let first = lines[0];
    let { author, date, time, timezone, datetime } = first;
    return {
      id: commit,
      url: 'https://github.com/evelynzhang5/portfolio/commit/' + commit,
      author,
      date,
      time,
      timezone,
      datetime,
      hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
      totalLines: lines.length,
      lines: lines
    };
  });
}

function updateStats(data) {
  const container = d3.select('#stats');
  container.selectAll('*').remove();
  const dl = container.append('dl').attr('class', 'stats');

  dl.append('dt').text('Total LOC');
  dl.append('dd').text(data.length);

  dl.append('dt').text('Total commits');
  dl.append('dd').text(commits.length);

  dl.append('dt').text('Files');
  dl.append('dd').text(d3.groups(data, d => d.file).length);

  dl.append('dt').text('Avg line length');
  dl.append('dd').text(d3.mean(data, d => d.length).toFixed(1));

  dl.append('dt').text('Most active period');
  const period = d3.rollups(data, v => v.length, d => getTimeOfDay(d.datetime.getHours()));
  const maxPeriod = d3.greatest(period, d => d[1])?.[0];
  dl.append('dd').text(maxPeriod);
}
function brushed(event) {
  if (!event.selection) return;
  const [[x0,y0],[x1,y1]] = event.selection;

  // grab only the data bound to the circles in the chart:
  const visible = d3.selectAll('.dots circle').data();
  const selected = visible.filter(d => {
    const x = xScale(d.datetime),
          y = yScale(d.hourFrac);
    return x >= x0 && x <= x1 && y >= y0 && y <= y1;
  });

  d3.selectAll('circle')
    .classed('selected', d => selected.includes(d));

  renderSelectionCount(selected);
  renderLanguageBreakdown(selected);
}

function showTooltip(d, event) {
  tooltip.hidden = false;
  tooltip.style.left = `${event.clientX + 10}px`;
  tooltip.style.top = `${event.clientY + 10}px`;

  document.getElementById('commit-link').href = d.url;
  document.getElementById('commit-link').textContent = d.id;
  document.getElementById('commit-date').textContent = d.datetime.toLocaleDateString();
  document.getElementById('commit-time').textContent = d.datetime.toLocaleTimeString();
  document.getElementById('commit-author').textContent = d.author;
  document.getElementById('commit-lines').textContent = d.totalLines;
}

function hideTooltip() {
  tooltip.hidden = true;
}


function renderSelectionCount(selected) {
  document.getElementById('selection-count').textContent =
    `${selected.length} commit${selected.length !== 1 ? 's' : ''} selected`;
}

function renderLanguageBreakdown(selected) {
  const container = document.getElementById('language-breakdown');
  container.innerHTML = '';

  if (selected.length === 0) return;

  const lines = selected.flatMap(d => d.lines);
  const breakdown = d3.rollup(lines, v => v.length, d => d.type);

  for (const [lang, count] of breakdown) {
    const percent = d3.format('.1%')(count / lines.length);
    container.innerHTML += `<dt>${lang}</dt><dd>${count} lines (${percent})</dd>`;
  }
}

function updateScatterPlot(data) {
  const width = 1000;
  const height = 700;
  const margin = { top: 10, right: 10, bottom: 30, left: 40 };
  const usableWidth = width - margin.left - margin.right;
  const usableHeight = height - margin.top - margin.bottom;

  d3.select('#chart svg').remove();

  const svg = d3.select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');

  xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.datetime))
    .range([margin.left, margin.left + usableWidth]);

  yScale = d3.scaleLinear()
    .domain([0, 24])
    .range([margin.top + usableHeight, margin.top]);

  const [minLines, maxLines] = d3.extent(data, d => d.totalLines);
  rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([5, 20]);

  svg.append('g')
  .attr('class', 'gridlines')
  .selectAll('line')
  .data(yScale.ticks(24))
  .join('line')
  .attr('x1', margin.left)
  .attr('x2', width - margin.right)
  .attr('y1', d => yScale(d))
  .attr('y2', d => yScale(d));

  svg.append('g')
    .attr('transform', `translate(0, ${margin.top + usableHeight})`)
    .call(d3.axisBottom(xScale));

  svg.append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale).tickFormat(d => `${String(d === 24 ? 0 : d).padStart(2, '0')}:00`)
  );

  svg.append('g')
    .attr('class', 'dots')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', d => xScale(d.datetime))
    .attr('cy', d => yScale(d.hourFrac))
    .attr('r', d => rScale(d.totalLines))
    .attr('class', d => 'dot ' + (d.hourFrac < 6 || d.hourFrac >= 18 ? 'night' : 'day'))
    .on('mouseenter', (event, d) => showTooltip(d, event))
    .on('mouseleave', hideTooltip);

    // Brush interaction
    // const brush = d3.brush()
    // .on('start brush end', brushed);

    // svg.append('g')
    // .attr('class', 'brush')
    // .call(brush);
    const brush = d3.brush().on('start brush end', brushed);
    svg.call(brush);
    svg.select('.dots').raise();

}

function renderUnitVisualization(filteredCommits) {
  const lines = filteredCommits.flatMap(d => d.lines);
  let files = d3.groups(lines, d => d.file).map(([name, lines]) => ({ name, lines }));
  files = d3.sort(files, d => -d.lines.length);

  const fileTypeColors = d3.scaleOrdinal(d3.schemeTableau10);
  const dl = d3.select('.files');
  dl.selectAll('div').remove();

  const containers = dl.selectAll('div').data(files).enter().append('div');

  containers.append('dt')
    .html(d => `<code>${d.name}</code><small>${d.lines.length} lines</small>`);

  containers.append('dd')
    .selectAll('div')
    .data(d => d.lines)
    .join('div')
    .attr('class', 'line')
    .style('background', d => fileTypeColors(d.type));
}

function renderItems(startIndex) {
  itemsContainer.selectAll('div').remove();
  const endIndex = Math.min(startIndex + VISIBLE_COUNT, commits.length);
  const slice = commits.slice(startIndex, endIndex);

  updateScatterPlot(slice);
  renderUnitVisualization(slice);
  updateStats(slice.flatMap(d => d.lines));

  itemsContainer
    .selectAll('div')
    .data(commits)
    .enter()
    .append('div')
    .attr('class', 'item')
    .style('position', 'absolute')
    .style('top', (_, i) => `${i * ITEM_HEIGHT}px`)
    .html((commit, i) => `
      <p>On ${commit.datetime.toLocaleString()}, I made
      <a href="${commit.url}" target="_blank">
        ${i === 0 ? 'my first commit, and it was glorious' : 'another glorious commit'}
      </a>, editing ${commit.totalLines} lines in ${d3.groups(commit.lines, d => d.file).length} files.</p>
    `);
}
function renderFileItems(startIndex) {
  fileItemsContainer.selectAll('div').remove();
  const endIndex = Math.min(startIndex + VISIBLE_COUNT, commits.length);
  const slice = commits.slice(startIndex, endIndex);

  renderUnitVisualization(slice);  // reuses your file visualization
  updateStats(slice.flatMap(d => d.lines));

  fileItemsContainer
    .selectAll('div')
    .data(commits)
    .enter()
    .append('div')
    .attr('class', 'item')
    .style('position', 'absolute')
    .style('top', (_, i) => `${i * ITEM_HEIGHT}px`)
    .html((commit, i) => `
      <p>By ${commit.author} on ${commit.datetime.toLocaleDateString()}, 
      ${commit.totalLines} lines were edited in ${d3.groups(commit.lines, d => d.file).length} files.</p>
    `);
}


// === MAIN ===
const tooltip = document.getElementById('commit-tooltip');
const data = await loadData();
commits = processCommits(data);
NUM_ITEMS = commits.length;


scrollContainer = d3.select('#scroll-container');
spacer = d3.select('#spacer');
itemsContainer = d3.select('#items-container');

spacer.style('height', `${(NUM_ITEMS - 1) * ITEM_HEIGHT}px`);

scrollContainer.on('scroll', () => {
  const scrollTop = scrollContainer.property('scrollTop');
  let startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
  startIndex = Math.max(0, Math.min(startIndex, NUM_ITEMS - VISIBLE_COUNT));
  renderItems(startIndex);
});

const fileScrollContainer = d3.select('#file-scroll-container');
const fileSpacer = d3.select('#file-spacer');
const fileItemsContainer = d3.select('#file-items-container');

fileSpacer.style('height', `${(NUM_ITEMS - 1) * ITEM_HEIGHT}px`);

fileScrollContainer.on('scroll', () => {
  const scrollTop = fileScrollContainer.property('scrollTop');
  let startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
  startIndex = Math.max(0, Math.min(startIndex, NUM_ITEMS - VISIBLE_COUNT));
  renderFileItems(startIndex);
});


renderItems(0);
renderFileItems(0);
