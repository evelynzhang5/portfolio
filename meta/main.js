
// // import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// // let xScale, yScale, rScale;
// // let commits = [];
// // let commitProgress = 100;
// // let timeScale, commitMaxTime;
// // let filteredCommits = [];

// // async function loadData() {
// //   const data = await d3.csv('loc.csv', (row) => ({
// //     ...row,
// //     line: +row.line,
// //     depth: +row.depth,
// //     length: +row.length,
// //     date: new Date(row.date + 'T00:00' + row.timezone),
// //     datetime: new Date(row.datetime),
// //   }));
// //   return data;
// // }

// // function getTimeOfDay(hour) {
// //   if (hour < 6) return 'Night';
// //   if (hour < 12) return 'Morning';
// //   if (hour < 18) return 'Afternoon';
// //   return 'Evening';
// // }

// // function processCommits(data) {
// //   return d3.groups(data, (d) => d.commit).map(([commit, lines]) => {
// //     let first = lines[0];
// //     let { author, date, time, timezone, datetime } = first;
// //     return {
// //       id: commit,
// //       url: 'https://github.com/evelynzhang5/portfolio/commit/' + commit,
// //       author,
// //       date,
// //       time,
// //       timezone,
// //       datetime,
// //       hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
// //       totalLines: lines.length,
// //       lines: lines
// //     };
// //   });
// // }

// // function renderUnitVisualization(filteredCommits) {
// //   const lines = filteredCommits.flatMap(d => d.lines);
// //   let files = d3.groups(lines, d => d.file).map(([name, lines]) => ({ name, lines }));
// //   files = d3.sort(files, d => -d.lines.length);

// //   const fileTypeColors = d3.scaleOrdinal(d3.schemeTableau10);

// //   const dl = d3.select('.files');
// //   dl.selectAll('div').remove();

// //   const containers = dl.selectAll('div').data(files).enter().append('div');

// //   containers.append('dt')
// //     .html(d => `<code>${d.name}</code><small>${d.lines.length} lines</small>`);

// //   containers.append('dd')
// //     .selectAll('div')
// //     .data(d => d.lines)
// //     .join('div')
// //     .attr('class', 'line')
// //     .style('background', d => fileTypeColors(d.type));
// // }

// // function renderCommitInfo(data, commits) {
// //   d3.select('#stats').selectAll('*').remove();  // ✅ important line to prevent stacking

// //   const dl = d3.select('#stats').append('dl').attr('class', 'stats');

// //   dl.append('dt').html('Total <abbr title="Lines of Code">LOC</abbr>');
// //   dl.append('dd').text(data.length);

// //   dl.append('dt').text('Total commits');
// //   dl.append('dd').text(commits.length);

// //   dl.append('dt').text('Number of files');
// //   dl.append('dd').text(d3.groups(data, d => d.file).length);

// //   dl.append('dt').text('Average line length (chars)');
// //   dl.append('dd').text(d3.mean(data, d => d.length).toFixed(1));

// //   dl.append('dt').text('Max depth');
// //   dl.append('dd').text(d3.max(data, d => d.depth));

// //   const workByPeriod = d3.rollups(data, v => v.length, d => getTimeOfDay(d.datetime.getHours()));
// //   const maxPeriod = d3.greatest(workByPeriod, d => d[1])?.[0];
// //   dl.append('dt').text('Most active time of day');
// //   dl.append('dd').text(maxPeriod);

// //   const workByDay = d3.rollups(data, v => v.length, d => d.datetime.toLocaleDateString('en-US', { weekday: 'long' }));
// //   const maxDay = d3.greatest(workByDay, d => d[1])?.[0];
// //   dl.append('dt').text('Most active day of the week');
// //   dl.append('dd').text(maxDay);
// // }


// // function renderTooltipContent(commit) {
// //   if (!commit) return;
// //   document.getElementById('commit-link').href = commit.url;
// //   document.getElementById('commit-link').textContent = commit.id;
// //   document.getElementById('commit-date').textContent = commit.datetime.toLocaleDateString('en', { dateStyle: 'full' });
// //   document.getElementById('commit-time').textContent = commit.datetime.toLocaleTimeString('en', { timeStyle: 'short' });
// //   document.getElementById('commit-author').textContent = commit.author;
// //   document.getElementById('commit-lines').textContent = commit.totalLines;
// // }

// // function updateTooltipVisibility(isVisible) {
// //   document.getElementById('commit-tooltip').hidden = !isVisible;
// // }

// // function updateTooltipPosition(event) {
// //   const tooltip = document.getElementById('commit-tooltip');
// //   tooltip.style.left = `${event.clientX + 10}px`;
// //   tooltip.style.top = `${event.clientY + 10}px`;
// // }

// // function updateScatterPlot(data, inputCommits) {
// //   commits = inputCommits;
// //   const sortedCommits = d3.sort(inputCommits, d => -d.totalLines);
// //   const [minLines, maxLines] = d3.extent(inputCommits, d => d.totalLines);
// //   rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([5, 30]);

// //   const width = 1000;
// //   const height = 600;
// //   const margin = { top: 10, right: 10, bottom: 30, left: 40 };

// //   const usableArea = {
// //     top: margin.top,
// //     left: margin.left,
// //     right: width - margin.right,
// //     bottom: height - margin.bottom,
// //     width: width - margin.left - margin.right,
// //     height: height - margin.top - margin.bottom,
// //   };

// //   d3.select('#chart svg').remove();

// //   const svg = d3.select('#chart')
// //     .append('svg')
// //     .attr('viewBox', `0 0 ${width} ${height}`)
// //     .style('overflow', 'visible');

// //   xScale = d3.scaleTime()
// //     .domain(d3.extent(inputCommits, d => d.datetime))
// //     .range([usableArea.left, usableArea.right])
// //     .nice();

// //   yScale = d3.scaleLinear()
// //     .domain([0, 24])
// //     .range([usableArea.bottom, usableArea.top]);

// //   svg.append('g')
// //     .attr('class', 'gridlines')
// //     .attr('transform', `translate(${usableArea.left}, 0)`)
// //     .call(d3.axisLeft(yScale).tickSize(-usableArea.width).tickFormat(''));

// //   svg.append('g')
// //     .attr('transform', `translate(0, ${usableArea.bottom})`)
// //     .call(d3.axisBottom(xScale));

// //   svg.append('g')
// //     .attr('transform', `translate(${usableArea.left}, 0)`)
// //     .call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, '0') + ':00'));

// //   svg.append('g')
// //     .attr('class', 'dots')
// //     .selectAll('circle')
// //     .data(sortedCommits)
// //     .join('circle')
// //     .attr('cx', d => xScale(d.datetime))
// //     .attr('cy', d => yScale(d.hourFrac))
// //     .attr('r', d => rScale(d.totalLines))
// //     .attr('class', d => 'dot ' + (d.hourFrac < 6 || d.hourFrac >= 20 ? 'night' : 'day'))
// //     .style('--r', d => rScale(d.totalLines))
// //     .style('fill-opacity', 0.7)
// //     .on('mouseenter', (event, commit) => {
// //       d3.select(event.currentTarget).style('fill-opacity', 1);
// //       renderTooltipContent(commit);
// //       updateTooltipVisibility(true);
// //       updateTooltipPosition(event);
// //     })
// //     .on('mousemove', updateTooltipPosition)
// //     .on('mouseleave', (event) => {
// //       d3.select(event.currentTarget).style('fill-opacity', 0.7);
// //       updateTooltipVisibility(false);
// //     });

// //   const brush = d3.brush().on('start brush end', brushed);
// //   svg.call(brush);
// //   svg.selectAll('.dots, .overlay ~ *').raise();
// // }

// // function brushed(event) {
// //   const selection = event.selection;
// //   d3.selectAll('circle.dot').classed('selected', d =>
// //     d && isCommitSelected(selection, d)
// //   );
// //   const selected = selection ? commits.filter(d => isCommitSelected(selection, d)) : [];
// //   renderSelectionCount(selection);
// //   renderLanguageBreakdown(selected);
// // }

// // function isCommitSelected(selection, commit) {
// //   if (!selection || !commit) return false;
// //   const [[x0, y0], [x1, y1]] = selection;
// //   const x = xScale(commit.datetime);
// //   const y = yScale(commit.hourFrac);
// //   return x >= x0 && x <= x1 && y >= y0 && y <= y1;
// // }

// // function renderSelectionCount(selection) {
// //   const selected = selection ? commits.filter(d => isCommitSelected(selection, d)) : [];
// //   document.getElementById('selection-count').textContent =
// //     `${selected.length || 'No'} commits selected`;
// // }

// // function renderLanguageBreakdown(selected) {
// //   const container = document.getElementById('language-breakdown');
// //   if (!selected.length) {
// //     container.innerHTML = '';
// //     return;
// //   }
// //   const lines = selected.flatMap(d => d.lines || []);
// //   const breakdown = d3.rollup(lines, v => v.length, d => d.type);
// //   container.innerHTML = '';
// //   for (const [lang, count] of breakdown) {
// //     const formatted = d3.format('.1~%')(count / lines.length);
// //     container.innerHTML += `<dt>${lang}</dt><dd>${count} lines (${formatted})</dd>`;
// //   }
// // }

// // const data = await loadData();
// // const processedCommits = processCommits(data);
// // renderCommitInfo(data, processedCommits);

// // timeScale = d3.scaleTime()
// //   .domain(d3.extent(processedCommits, d => d.datetime))
// //   .range([0, 100]);

// // const timeSlider = document.getElementById("timeSlider");
// // const selectedTime = document.getElementById("selectedTime");

// // function updateTimeDisplay() {
// //   commitProgress = +timeSlider.value;
// //   commitMaxTime = timeScale.invert(commitProgress);

// //   selectedTime.textContent = commitMaxTime.toLocaleString(undefined, {
// //     dateStyle: "long",
// //     timeStyle: "short"
// //   });

// //   filteredCommits = processedCommits.filter(d => d.datetime <= commitMaxTime);

// //   updateScatterPlot(data, filteredCommits);
// //   renderUnitVisualization(filteredCommits);
// //   renderCommitInfo(
// //     filteredCommits.flatMap(d => d.lines),
// //     filteredCommits
// //   );
// // }


// // timeSlider.addEventListener("input", updateTimeDisplay);
// // updateTimeDisplay();
// import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// let xScale, yScale, rScale;
// let commits = [];
// let commitProgress = 100;
// let timeScale, commitMaxTime;
// let filteredCommits = [];

// async function loadData() {
//   const data = await d3.csv('loc.csv', (row) => ({
//     ...row,
//     line: +row.line,
//     depth: +row.depth,
//     length: +row.length,
//     date: new Date(row.date + 'T00:00' + row.timezone),
//     datetime: new Date(row.datetime),
//   }));
//   return data;
// }

// function getTimeOfDay(hour) {
//   if (hour < 6) return 'Night';
//   if (hour < 12) return 'Morning';
//   if (hour < 18) return 'Afternoon';
//   return 'Evening';
// }

// function processCommits(data) {
//   return d3.groups(data, (d) => d.commit).map(([commit, lines]) => {
//     let first = lines[0];
//     let { author, date, time, timezone, datetime } = first;
//     return {
//       id: commit,
//       url: 'https://github.com/evelynzhang5/portfolio/commit/' + commit,
//       author,
//       date,
//       time,
//       timezone,
//       datetime,
//       hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
//       totalLines: lines.length,
//       lines: lines
//     };
//   });
// }

// function renderUnitVisualization(filteredCommits) {
//   const lines = filteredCommits.flatMap(d => d.lines);
//   let files = d3.groups(lines, d => d.file).map(([name, lines]) => ({ name, lines }));
//   files = d3.sort(files, d => -d.lines.length);

//   const fileTypeColors = d3.scaleOrdinal(d3.schemeTableau10);

//   const dl = d3.select('.files');
//   dl.selectAll('div').remove();

//   const containers = dl.selectAll('div').data(files).enter().append('div');

//   containers.append('dt')
//     .html(d => `<code>${d.name}</code><small>${d.lines.length} lines</small>`);

//   containers.append('dd')
//     .selectAll('div')
//     .data(d => d.lines)
//     .join('div')
//     .attr('class', 'line')
//     .style('background', d => fileTypeColors(d.type));
// }

// function renderCommitInfo(data, commits) {
//   d3.select('#stats').selectAll('*').remove();

//   const dl = d3.select('#stats').append('dl').attr('class', 'stats');

//   dl.append('dt').html('Total <abbr title="Lines of Code">LOC</abbr>');
//   dl.append('dd').text(data.length);

//   dl.append('dt').text('Total commits');
//   dl.append('dd').text(commits.length);

//   dl.append('dt').text('Number of files');
//   dl.append('dd').text(d3.groups(data, d => d.file).length);

//   dl.append('dt').text('Average line length (chars)');
//   dl.append('dd').text(d3.mean(data, d => d.length).toFixed(1));

//   dl.append('dt').text('Max depth');
//   dl.append('dd').text(d3.max(data, d => d.depth));

//   const workByPeriod = d3.rollups(data, v => v.length, d => getTimeOfDay(d.datetime.getHours()));
//   const maxPeriod = d3.greatest(workByPeriod, d => d[1])?.[0];
//   dl.append('dt').text('Most active time of day');
//   dl.append('dd').text(maxPeriod);

//   const workByDay = d3.rollups(data, v => v.length, d => d.datetime.toLocaleDateString('en-US', { weekday: 'long' }));
//   const maxDay = d3.greatest(workByDay, d => d[1])?.[0];
//   dl.append('dt').text('Most active day of the week');
//   dl.append('dd').text(maxDay);
// }

// function renderTooltipContent(commit) {
//   if (!commit) return;
//   document.getElementById('commit-link').href = commit.url;
//   document.getElementById('commit-link').textContent = commit.id;
//   document.getElementById('commit-date').textContent = commit.datetime.toLocaleDateString('en', { dateStyle: 'full' });
//   document.getElementById('commit-time').textContent = commit.datetime.toLocaleTimeString('en', { timeStyle: 'short' });
//   document.getElementById('commit-author').textContent = commit.author;
//   document.getElementById('commit-lines').textContent = commit.totalLines;
// }

// function updateTooltipVisibility(isVisible) {
//   document.getElementById('commit-tooltip').hidden = !isVisible;
// }

// function updateTooltipPosition(event) {
//   const tooltip = document.getElementById('commit-tooltip');
//   tooltip.style.left = `${event.clientX + 10}px`;
//   tooltip.style.top = `${event.clientY + 10}px`;
// }

// function updateScatterPlot(data, inputCommits) {
//   commits = inputCommits;
//   const sortedCommits = d3.sort(inputCommits, d => -d.totalLines);
//   const [minLines, maxLines] = d3.extent(inputCommits, d => d.totalLines);
//   rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([5, 30]);

//   const width = 1000;
//   const height = 600;
//   const margin = { top: 10, right: 10, bottom: 30, left: 40 };

//   const usableArea = {
//     top: margin.top,
//     left: margin.left,
//     right: width - margin.right,
//     bottom: height - margin.bottom,
//     width: width - margin.left - margin.right,
//     height: height - margin.top - margin.bottom,
//   };

//   d3.select('#chart svg').remove();

//   const svg = d3.select('#chart')
//     .append('svg')
//     .attr('viewBox', `0 0 ${width} ${height}`)
//     .style('overflow', 'visible');

//   xScale = d3.scaleTime()
//     .domain(d3.extent(inputCommits, d => d.datetime))
//     .range([usableArea.left, usableArea.right])
//     .nice();

//   yScale = d3.scaleLinear()
//     .domain([0, 24])
//     .range([usableArea.bottom, usableArea.top]);

//   svg.append('g')
//     .attr('class', 'gridlines')
//     .attr('transform', `translate(${usableArea.left}, 0)`)
//     .call(d3.axisLeft(yScale).tickSize(-usableArea.width).tickFormat(''));

//   svg.append('g')
//     .attr('transform', `translate(0, ${usableArea.bottom})`)
//     .call(d3.axisBottom(xScale));

//   svg.append('g')
//     .attr('transform', `translate(${usableArea.left}, 0)`)
//     .call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, '0') + ':00'));

//   svg.append('g')
//     .attr('class', 'dots')
//     .selectAll('circle')
//     .data(sortedCommits)
//     .join('circle')
//     .attr('cx', d => xScale(d.datetime))
//     .attr('cy', d => yScale(d.hourFrac))
//     .attr('r', d => rScale(d.totalLines))
//     .attr('class', d => 'dot ' + (d.hourFrac < 6 || d.hourFrac >= 20 ? 'night' : 'day'))
//     .style('--r', d => rScale(d.totalLines))
//     .style('fill-opacity', 0.7)
//     .on('mouseenter', (event, commit) => {
//       d3.select(event.currentTarget).style('fill-opacity', 1);
//       renderTooltipContent(commit);
//       updateTooltipVisibility(true);
//       updateTooltipPosition(event);
//     })
//     .on('mousemove', updateTooltipPosition)
//     .on('mouseleave', (event) => {
//       d3.select(event.currentTarget).style('fill-opacity', 0.7);
//       updateTooltipVisibility(false);
//     });

//   const brush = d3.brush().on('start brush end', brushed);
//   svg.call(brush);
//   svg.selectAll('.dots, .overlay ~ *').raise();
// }

// function brushed(event) {
//   const selection = event.selection;
//   d3.selectAll('circle.dot').classed('selected', d =>
//     d && isCommitSelected(selection, d)
//   );
//   const selected = selection ? commits.filter(d => isCommitSelected(selection, d)) : [];
//   renderSelectionCount(selection);
//   renderLanguageBreakdown(selected);
// }

// function isCommitSelected(selection, commit) {
//   if (!selection || !commit) return false;
//   const [[x0, y0], [x1, y1]] = selection;
//   const x = xScale(commit.datetime);
//   const y = yScale(commit.hourFrac);
//   return x >= x0 && x <= x1 && y >= y0 && y <= y1;
// }

// function renderSelectionCount(selection) {
//   const selected = selection ? commits.filter(d => isCommitSelected(selection, d)) : [];
//   document.getElementById('selection-count').textContent =
//     `${selected.length || 'No'} commits selected`;
// }

// function renderLanguageBreakdown(selected) {
//   const container = document.getElementById('language-breakdown');
//   if (!selected.length) {
//     container.innerHTML = '';
//     return;
//   }
//   const lines = selected.flatMap(d => d.lines || []);
//   const breakdown = d3.rollup(lines, v => v.length, d => d.type);
//   container.innerHTML = '';
//   for (const [lang, count] of breakdown) {
//     const formatted = d3.format('.1~%')(count / lines.length);
//     container.innerHTML += `<dt>${lang}</dt><dd>${count} lines (${formatted})</dd>`;
//   }
// }

// const data = await loadData();
// const processedCommits = processCommits(data);
// renderCommitInfo(data, processedCommits);
// updateScatterPlot(data, processedCommits);
// renderUnitVisualization(processedCommits);
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

function updateScatterPlot(data, inputCommits) {
  const sortedCommits = d3.sort(inputCommits, d => -d.totalLines);
  const [minLines, maxLines] = d3.extent(inputCommits, d => d.totalLines);
  rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([5, 30]);

  const width = 1000;
  const height = 600;
  const margin = { top: 10, right: 10, bottom: 30, left: 40 };

  const usableArea = {
    top: margin.top,
    left: margin.left,
    right: width - margin.right,
    bottom: height - margin.bottom,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };

  d3.select('#chart svg').remove();

  const svg = d3.select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');

  xScale = d3.scaleTime()
    .domain(d3.extent(inputCommits, d => d.datetime))
    .range([usableArea.left, usableArea.right])
    .nice();

  yScale = d3.scaleLinear()
    .domain([0, 24])
    .range([usableArea.bottom, usableArea.top]);

  svg.append('g')
    .attr('class', 'gridlines')
    .attr('transform', `translate(${usableArea.left}, 0)`)
    .call(d3.axisLeft(yScale).tickSize(-usableArea.width).tickFormat(''));

  svg.append('g')
    .attr('transform', `translate(0, ${usableArea.bottom})`)
    .call(d3.axisBottom(xScale));

  svg.append('g')
    .attr('transform', `translate(${usableArea.left}, 0)`)
    .call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, '0') + ':00'));

  svg.append('g')
    .attr('class', 'dots')
    .selectAll('circle')
    .data(sortedCommits)
    .join('circle')
    .attr('cx', d => xScale(d.datetime))
    .attr('cy', d => yScale(d.hourFrac))
    .attr('r', d => rScale(d.totalLines))
    .attr('class', d => 'dot ' + (d.hourFrac < 6 || d.hourFrac >= 20 ? 'night' : 'day'))
    .style('--r', d => rScale(d.totalLines))
    .style('fill-opacity', 0.7);
}

// === renderItems for scrollytelling ===
function renderItems(startIndex) {
  itemsContainer.selectAll('div').remove();

  const endIndex = Math.min(startIndex + VISIBLE_COUNT, commits.length);
  const visibleCommits = commits.slice(startIndex, endIndex);

  // Update visualization
  updateScatterPlot(null, visibleCommits);
  renderUnitVisualization(visibleCommits);

  // Add narrative
  itemsContainer.selectAll('div')
    .data(visibleCommits)
    .enter()
    .append('div')
    .attr('class', 'item')
    .style('position', 'absolute')
    .style('top', (_, i) => `${i * ITEM_HEIGHT}px`)
    .html((commit, index) => `
      <p>
        On ${commit.datetime.toLocaleString("en", { dateStyle: "full", timeStyle: "short" })}, I made 
        <a href="${commit.url}" target="_blank">
          ${index > 0 ? 'another glorious commit' : 'my first commit, and it was glorious'}
        </a>. 
        I edited ${commit.totalLines} lines across ${d3.rollups(commit.lines, d => d.length, d => d.file).length} files.
        Then I looked over all I had made, and I saw that it was very good.
      </p>
    `);
}

// === MAIN SCRIPT ===
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
  startIndex = Math.max(0, Math.min(startIndex, commits.length - VISIBLE_COUNT));
  renderItems(startIndex);
});

// Initial render
renderItems(0);
