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
  
      // Check if element is in view
      if (position.top >= 0 && position.bottom <= window.innerHeight) {
        element.classList.add('in-view');
      } else {
        element.classList.remove('in-view');
      }
    });
  }
  
  // Listen to scroll event
  window.addEventListener('scroll', checkVisibility);
  
  // Initial check
  checkVisibility();
  