// Scroll to top on reload
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
  
  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  // Hamburger menu toggle
  const menu = document.getElementById('menu');
  const navLinks = document.getElementById('navLinks');
  
  menu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  

  // Function to detect elements in the viewport
  function checkVisibility() {
    const elements = document.querySelectorAll('.content-wrapper');
  
    elements.forEach((element) => {
      const position = element.getBoundingClientRect();
  
      if (position.top < window.innerHeight - 100) {  // Adjust trigger position
        element.classList.add('in-view');
      }
    });
  }
  
  // Run check on scroll and on page load
  window.addEventListener('scroll', checkVisibility);
  window.addEventListener('load', checkVisibility);
  



  // Horizontal auto-scrolling for categories
// Horizontal auto-scrolling for categories
const categoryGrid = document.querySelector('.categories .category-grid');
let scrollSpeed = 1; // Adjust for speed
let isHovering = false;

if (categoryGrid) {
    categoryGrid.addEventListener('mouseenter', () => {
        isHovering = true;
    });

    categoryGrid.addEventListener('mouseleave', () => {
        isHovering = false;
    });

    function autoScroll() {
        if (!isHovering && categoryGrid.scrollWidth > categoryGrid.clientWidth) {
            categoryGrid.scrollLeft += scrollSpeed;
            if (categoryGrid.scrollLeft >= categoryGrid.scrollWidth - categoryGrid.clientWidth) {
                categoryGrid.scrollLeft = 0; // Loop back to the start
            }
        }
        requestAnimationFrame(autoScroll);
    }

    autoScroll();

    // Manual scroll (already handled by browser with overflow-x: auto)
}