let coords1;
let coords2;

function getParentNode(button) {
  // Access the parent div of the clicked button
  let parentDiv = button.parentNode.parentNode;

  // Do something with the parent div
  let pickupLocation = parentDiv.querySelector('.pickup-location').textContent;
  let dropLocation = parentDiv.querySelector('.drop-location').textContent;

  getlocation(pickupLocation, dropLocation);
}

async function getlocation(pickupLocation, dropLocation) {
  try {
    const response = await fetch(`/getlocation?place1=${pickupLocation}&place2=${dropLocation}`);
    const data = await response.json();

    coords1 = await data.coords1;
    coords2 = await data.coords2;

    plotMap(coords1, coords2);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}



// Initialize Leaflet map
if(window.location.href.includes("/agents")){
  const map = L.map('map').setView([0, 0], 2); // Default view at (0, 0) with zoom level 2
  // Add a tile layer to the map (you can use different tile providers)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
}

function plotMap(coords1, coords2) {
  // Example: Set starting and ending coordinates
  const startCoords = [coords1.lat, coords1.lng];
  const endCoords = [coords2.lat, coords2.lng];

  // Add markers for starting and ending locations
  const startMarker = L.marker(startCoords).addTo(map).bindPopup('Starting Location');
  const endMarker = L.marker(endCoords).addTo(map).bindPopup('Ending Location');

  // Create a polyline to connect the markers
  const polyline = L.polyline([startCoords, endCoords], { color: 'blue' }).addTo(map);

  // Fit the map to the bounds of the markers and polyline
  const bounds = L.latLngBounds([startCoords, endCoords]);
  map.fitBounds(bounds);

}

function getCardData(cardId) {
  fetch(`/getCardData/${cardId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {

        getlocation(data.data.pickup_location, data.data.drop_location);
        setTimeout(() => {
          // Display the card data in a specific element (e.g., a div)
          const cardDataContainer = document.getElementById('product_info');
          cardDataContainer.innerHTML = `
          <div class="row p-2 ms-1 mt-4 rounded-2 w-100" style="border: 1px solid black; background-color: white;">
          <h5>Details of Delivery:</h5><hr>
          <div class="col">
            <h6 class="m-0"><i class="fa-regular fa-user"></i> Contact Person:</h6>
            <p class="m-0 ms-3 p-0" style="font-size: x-small;">(Pickup)</p>
            <p class="ms-3 pickup-location">${data.data.pickupPerson_Name}</p>

            <h6 class="m-0"><i class="fa-regular fa-user"></i> Contact Person:</h6>
            <p class="m-0 ms-3 p-0" style="font-size: x-small;">(Drop)</p>
            <p class="ms-3 pickup-location">${data.data.dropPerson_Name}</p>
            </div>
            <div class="col">
              <h6><i class="m-0 p-0 fa-solid fa-location-dot"></i> Pick-up point:</h6>
              <p class="ms-3 pickup-location">${data.data.pickup_location} - <a href="https://www.google.com/maps?q=${coords1.lat},${coords1.lng}" target="_blank" style="color: blue">Start</a></p>
          
              <h6><i class="fa-solid fa-location-crosshairs"></i> Drop point:</h6>
              <p class="ms-3 drop-location">${data.data.drop_location} - <a href="https://www.google.com/maps?q=${coords2.lat},${coords2.lng}" target="_blank" style="color: blue">End</a></p>
            </div>
            <div class="col">
              <h6><i class="fa-solid fa-truck-fast"></i> Items to be Delivered:</h6>
              <p class="pickup-location ms-3">Product</p>
          
              <h6><i class="fa-solid fa-coins"></i> Your Commission:</h6>
              
            </div>
          </div>
          </div>
          <button class="btn btn-primary" onclick="acceptBtn('${data.data._id}')" >Accept request</button>
          `;
        }, 3000);
      } else {
        // Handle errors, e.g., show an error message
        console.log(data.message);
      }
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

function getstatus(cardId) {
  fetch(`/getstatus/${cardId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {

        getlocation(data.data.pickup_location, data.data.drop_location);
        setTimeout(() => {
          // Display the card data in a specific element (e.g., a div)
          const cardDataContainer = document.getElementById('product_info');
          cardDataContainer.innerHTML = `
          <div class="row p-2 ms-1 mt-4 rounded-2 w-100" style="border: 1px solid black; background-color: white;">
          <h5>Details of Delivery:</h5><hr>
          <div class="col">
            <h6 class="m-0"><i class="fa-regular fa-user"></i> Contact Person:</h6>
            <p class="m-0 ms-3 p-0" style="font-size: x-small;">(Pickup)</p>
            <p class="ms-3 pickup-location">${data.data.pickupPerson_Name}</p>

            <h6 class="m-0"><i class="fa-regular fa-user"></i> Contact Person:</h6>
            <p class="m-0 ms-3 p-0" style="font-size: x-small;">(Drop)</p>
            <p class="ms-3 pickup-location">${data.data.dropPerson_Name}</p>
            </div>
            <div class="col">
              <h6><i class="m-0 p-0 fa-solid fa-location-dot"></i> Pick-up point:</h6>
              <p class="ms-3 pickup-location">${data.data.pickup_location} - <a href="https://www.google.com/maps?q=${coords1.lat},${coords1.lng}" target="_blank" style="color: blue">Start</a></p>
          
              <h6><i class="fa-solid fa-location-crosshairs"></i> Drop point:</h6>
              <p class="ms-3 drop-location">${data.data.drop_location} - <a href="https://www.google.com/maps?q=${coords2.lat},${coords2.lng}" target="_blank" style="color: blue">End</a></p>
            </div>
            <div class="col">
              <h6><i class="fa-solid fa-truck-fast"></i> Items to be Delivered:</h6>
              <p class="pickup-location ms-3">Product</p>
          
              <h6><i class="fa-solid fa-coins"></i> Status:</h6>
              <p class="ms-3 drop-location">${data.data.status}</p>

              <button type="button" class="btn btn-primary" onclick="markCompletedBtn('${data.data._id}')">Mark as Completed</button>
            </div>
          </div>
          </div>
          `;
        }, 3000);
      } else {
        // Handle errors, e.g., show an error message
        console.log(data.message);
      }
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
    });
}


function acceptBtn(UserId) {
  fetch(`/acceptrequest/${UserId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        console.log("task Completed");

      } else {
        // Handle errors, e.g., show an error message
        console.log(data.message);
      }
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

function markCompletedBtn(UserId) {
  fetch(`/markCompleted/${UserId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        console.log("task Completed");

      } else {
        // Handle errors, e.g., show an error message
        console.log(data.message);
      }
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

const screenWidth = window.screen.width;
if (screenWidth < 480 ) {
  main_container.classList.remove("flex-row")
  main_container.classList.add("flex-column")
  detailsSide.classList.remove("w-50","m-5")
  detailsSide.classList.add("w-100")
  mapSide.classList.remove("w-50")
  mapSide.classList.add("w-100")

}
// else{
//   main_container1.classList.remove("flex-row")
//   main_container1.classList.add("flex-column")
//   detailsSide1.classList.remove("w-50","m-5")
//   detailsSide1.classList.add("w-100")
//   mapSide1.classList.remove("w-50")
//   mapSide1.classList.add("w-100")
// }
