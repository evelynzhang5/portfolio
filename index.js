// index.js
import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

(async function() {

  const projects = await fetchJSON('./lib/projects.json');


  const latestThree = Array.isArray(projects) 
    ? projects.slice(0, 3) 
    : [];


  // 3️⃣ Find the container on the home page
  const container = document.querySelector('.projects');

  // 4️⃣ Render those three with an <h2> heading
  renderProjects(latestThree, container, 'h2');

  const username = 'evelynzhang5';          // ← replace this!
  const githubData = await fetchGitHubData(username);
  const profileStats = document.querySelector('#profile-stats');

  if (profileStats) {
    profileStats.innerHTML = `
      <dl class="stats-grid">
        <dt>Public Repos:</dt><dd>${githubData.public_repos ?? 0}</dd>
        <dt>Public Gists:</dt><dd>${githubData.public_gists ?? 0}</dd>
        <dt>Followers:</dt><dd>${githubData.followers ?? 0}</dd>
        <dt>Following:</dt><dd>${githubData.following ?? 0}</dd>
      </dl>
    `;
  }
})();
