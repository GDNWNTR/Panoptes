  // When the user scrolls down past a certain point, add the "sticky" class to the navigation bar
  window.onscroll = function() {
    const topnav = document.querySelector(".topnav");
    const stickyThreshold = 30; // Adjust this value based on when you want the navbar to become sticky

    if (window.pageYOffset >= stickyThreshold) {
        topnav.classList.add("sticky");
    } else {
        topnav.classList.remove("sticky");
    }
}