window.addEventListener('load', function () {
    // Hide preloader after the page is fully loaded
    setTimeout(function() {
      document.querySelector('.preloader').style.display = 'none'; // Hide preloader
    }, 3000); // 3000ms (3 seconds) delay before hiding the preloader
  });
  
  // If you want to show the preloader for a set time (e.g., 3 seconds) regardless of the page load:
  // Remove the "load" event listener if you want it to be based only on the timer
  setTimeout(function() {
    document.querySelector('.preloader').style.display = 'none'; // Hide preloader
  }, 3000); // 3000ms (3 seconds)
  