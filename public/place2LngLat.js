// Example coordinates (latitude and longitude) for two places

const calculateBtn = document.querySelector('#index_calculateBtn');
calculateBtn.addEventListener('click', async () => {
    const place1 = document.getElementById('pickup_location').value;
    const place2 = document.getElementById('drop_location').value;

    const response = await fetch(`/getlocation?place1=${place1}&place2=${place2}`);
    const data = await response.json();

    coords1 = await data.coords1;
    coords2 = await data.coords2;
    const distance = calculateDistance(coords1.lat, coords1.lng, coords2.lat, coords2.lng);

    console.log(`Distance between ${place1} and ${place2}: ${distance.toFixed(2)} km`);
    results.innerHTML = `<br><h1>Estimated Cost : ₹${(Math.ceil(distance.toFixed(2) * 5))}</h1>`


})

// Function to calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

// Function to convert degrees to radians
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}