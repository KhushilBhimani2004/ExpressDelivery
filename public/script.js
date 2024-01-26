// JavaScript function to toggle the 'active' class on click
function toggleCard(card) {
  card.classList.toggle('active');
}

document.addEventListener("DOMContentLoaded", function() {
  const profileButton = document.getElementById("profile-button");
  const dropdownContent = document.getElementById("dropdown-content-profile");

  profileButton.addEventListener("click", function() {
      dropdownContent.classList.toggle("show");
  });

  // Close the dropdown when clicking outside of it
  window.addEventListener("click", function(event) {
      if (!event.target.matches("#profile-button")) {
          if (dropdownContent.classList.contains("show")) {
              dropdownContent.classList.remove("show");
          }
      }
  });
});

