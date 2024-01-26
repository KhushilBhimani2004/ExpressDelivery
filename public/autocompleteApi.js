const script = document.getElementById('search-js');
script.onload = function() {
  // Make a request to the server to get the Mapbox access token
  fetch('/getMapboxToken')
    .then(response => response.json())
    .then(data => {
      // Use the received access token for Mapbox
      mapboxsearch.autofill({
        accessToken: data.accessToken
      });
    })
    .catch(error => console.error('Error fetching Mapbox token:', error));
};