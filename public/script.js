document.getElementById('linkForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const urlInput = document.getElementById('destinationUrl');
    const resultDiv = document.getElementById('result');
  
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinationUrl: urlInput.value })
      });
      const { trackingUrl } = await response.json();
  
      resultDiv.innerHTML = `
        <p>Your tracking link is ready:</p>
        <input type="text" value="${trackingUrl}" readonly>
        <p>Share this link to track visits.</p>
      `;
      urlInput.value = '';
    } catch (err) {
      resultDiv.innerHTML = `<p class="error">Error: ${err.message}</p>`;
    }
  });