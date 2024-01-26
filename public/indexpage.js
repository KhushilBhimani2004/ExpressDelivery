  // JavaScript to handle dropdown toggle
  const dropdownBtn = document.querySelector('.dropdown-btn');
  const dropdownContent = document.querySelector('.dropdown-content');

  dropdownBtn.addEventListener('click', () => {
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    arrow.classList.toggle("fa-angle-up")
  });



  // Close the dropdown when clicking outside of it
  window.addEventListener('click', (event) => {
    if (!event.target.matches('.dropdown-btn')) {
      dropdownContent.style.display = 'none';
      arrow.classList.replace("fa-angle-up","fa-angle-down");
    }
  });


   // Function to automatically switch to the next slide
   function autoSlide() {
    var slides = document.getElementsByName("slider");
    var currentSlide = Array.from(slides).findIndex(slide => slide.checked);

    // Move to the next slide or loop to the first slide
    var nextSlide = (currentSlide + 1) % slides.length;
    slides[nextSlide].checked = true;
  }

  // Set the interval for auto-sliding (in milliseconds)
  setInterval(autoSlide, 5000); // Change 5000 to the desired time in milliseconds