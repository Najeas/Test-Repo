let authToken = null;

async function login() {
  const password = document.getElementById('passwordInput').value;
  const response = await fetch('/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });

  const data = await response.json();
  if (data.success) {
    authToken = data.token;
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadData();
  } else {
    alert('Incorrect password!');
  }
}

async function loadData() {
  const response = await fetch('/admin/data', {
    headers: { 'Authorization': authToken }
  });
  const links = await response.json();

  // Render stats
  const totalClicks = links.reduce((sum, link) => sum + link.clicks.length, 0);
  document.getElementById('stats').innerHTML = `
    <p>Total Links: ${links.length} | Total Clicks: ${totalClicks}</p>
  `;

  // Render table
  const tbody = document.querySelector('#linksTable tbody');
  tbody.innerHTML = links.map(link => `
    <tr>
      <td>${link.trackingId}</td>
      <td><a href="${link.destinationUrl}" target="_blank">${link.destinationUrl.slice(0, 30)}...</a></td>
      <td>${link.clicks.length}</td>
      <td><button onclick="viewDetails('${link.trackingId}')">View</button></td>
    </tr>
  `).join('');
}

function viewDetails(trackingId) {
    fetch(`/admin/data/${trackingId}`, {
      headers: { 'Authorization': authToken }
    })
    .then(res => res.json())
    .then(link => {
      // Render map using Google Maps/Leaflet
      const locations = link.clicks.map(click => ({
        lat: click.latitude,
        lng: click.longitude,
        timestamp: new Date(click.timestamp).toLocaleString()
      }));
      console.log('Locations:', locations); // Implement map here
    });
  }